import { NextResponse } from 'next/server';
import { getUserProfile, getUserCasts } from '@/lib/neynar-api';
import { gemini } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Get FID from query params
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

    if (!fid) {
      return NextResponse.json(
        { error: 'FID parameter is required' },
        { status: 400 }
      );
    }

    console.log('calling neynar with fid', fid)

    // Fetch user profile and casts in parallel
    const [profile, castsData] = await Promise.all([
      getUserProfile(fid),
      getUserCasts(fid, 300)
    ]);

    if (!profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!castsData || !castsData.casts || castsData.casts.length === 0) {
      return NextResponse.json(
        { error: 'No casts found for user' },
        { status: 404 }
      );
    }

    // Analyze the user's founder type
    const analysis = await gemini.analyzeFounderType(castsData.casts, profile);

    if (!analysis) {
      return NextResponse.json(
        { error: 'Failed to analyze user' },
        { status: 500 }
      );
    }

    // Return the analysis along with some metadata
    return NextResponse.json({
      fid: parseInt(fid),
      username: profile.username,
      displayName: profile.displayName,
      castsAnalyzed: castsData.count,
      analysis
    });

  } catch (error) {
    console.error('Error in analyze-user:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
} 