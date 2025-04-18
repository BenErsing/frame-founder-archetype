'use client';

import { useState } from 'react';
import Image from "next/image";
import { frameActions } from '@/lib/frame';

const FOUNDER_TYPE_RECOMMENDATIONS = {
  visionary: {
    title: 'The Visionary Builder',
    strengths: 'Big-picture thinking, bold ideas, market foresight.',
    watchOut: 'Execution gaps—your ideas may be ahead of their time, but without a solid plan, they can stall.',
    consider: 'Surround yourself with operators who can turn your vision into reality. Set execution milestones to keep progress grounded.',
  },
  strategic: {
    title: 'The Strategic Operator',
    strengths: 'Systems thinking, efficiency, execution.',
    watchOut: 'Getting too caught up in details—scaling requires letting go of control at times.',
    consider: 'Delegate more and focus on high-leverage decisions. Partner with visionaries to balance execution with long-term innovation.',
  },
  community: {
    title: 'The Community Catalyst',
    strengths: 'Relationship-building, influence, brand trust.',
    watchOut: `Over-prioritizing people at the expense of product and strategy. Being well-liked doesn't always equate to building a great business.`,
    consider: 'Ensure you have strong product and technical talent in your leadership team. Set measurable business goals beyond community engagement.',
  },
  contrarian: {
    title: 'The Contrarian Thinker',
    strengths: 'Unique insights, challenging industry assumptions, first-principles thinking.',
    watchOut: `Struggling to gain buy-in—being right isn't enough if you can't get others on board.`,
    consider: 'Improve storytelling and persuasion skills to bring investors, employees, and customers along with your vision. Find pragmatic ways to implement your disruptive ideas.',
  },
  relentless: {
    title: 'The Relentless Problem-Solver',
    strengths: 'Practicality, persistence, hands-on innovation.',
    watchOut: 'Burning out—solving problems endlessly can prevent you from stepping back to think strategically.',
    consider: 'Take time to reflect on long-term vision and scalability. Bring on team members who can help you see the bigger picture while you focus on solving immediate challenges.',
  },
};

export function HomeComponent() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleShare = async (primaryType) => {
    try {
      const shareText = `I'm ${FOUNDER_TYPE_RECOMMENDATIONS[primaryType.toLowerCase()]?.title}! 🚀 Discover your founder archetype and unlock personalized insights for your entrepreneurial journey.`;
      const appUrl = `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}?type=${primaryType.toLowerCase()}`;
      
      const encodedText = encodeURIComponent(shareText);
      const encodedAppUrl = encodeURIComponent(appUrl);
      const shareUrl = `https://warpcast.com/~/compose?text=${encodedText}&embeds[]=${encodedAppUrl}`;

      await frameActions.openUrl(shareUrl);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);

      // Get the user's FID from the frame context
      if (!window.userFid) {
        throw new Error('Please open this page in a Farcaster frame to analyze your founder type');
      }

      const response = await fetch(`/api/analyze-user?fid=${window.userFid}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze founder type');
      }

      setResult(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="brand-gradient absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-2xl mx-auto space-y-12 px-4 py-16 sm:px-6 sm:py-24">
        {/* Initial Content - Only show when no result */}
        {!result && (
          <>
            {/* Header */}
            <div className="text-center space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                Discover Your <span className="brand-text">Founder Archetype</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                Using AI analysis of your Farcaster activity, we'll identify your unique founder personality type
                and provide insights into your entrepreneurial strengths.
              </p>
            </div>

            {/* Action Button */}
            <div className="text-center">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="analyze-button"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze My Founder Type'
                )}
              </button>
            </div>

            {/* Types Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="type-card">
                <h3 className="font-semibold mb-2 brand-text text-lg">The Visionary Builder</h3>
                <p className="text-gray-600 dark:text-gray-300">Ambitious thinker focused on big ideas and future impact</p>
              </div>
              <div className="type-card">
                <h3 className="font-semibold mb-2 brand-text text-lg">The Strategic Operator</h3>
                <p className="text-gray-600 dark:text-gray-300">Execution-driven, focused on efficiency and scaling</p>
              </div>
              <div className="type-card">
                <h3 className="font-semibold mb-2 brand-text text-lg">The Community Catalyst</h3>
                <p className="text-gray-600 dark:text-gray-300">People-focused, thriving on engagement and connection</p>
              </div>
              <div className="type-card">
                <h3 className="font-semibold mb-2 brand-text text-lg">The Contrarian Thinker</h3>
                <p className="text-gray-600 dark:text-gray-300">Challenges norms with unique perspectives</p>
              </div>
            </div>
          </>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-t-4 border-brand-color rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-t-4 border-brand-color/30 rounded-full"></div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Analyzing Your Profile</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Examining your Farcaster activity to determine your founder archetype...
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !isAnalyzing && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                You're <span className="brand-text">{FOUNDER_TYPE_RECOMMENDATIONS[result.analysis.primaryType.toLowerCase()]?.title}</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Based on analysis of {result.castsAnalyzed} casts
              </p>
              <button
                onClick={() => handleShare(result.analysis.primaryType)}
                className="analyze-button mt-4"
              >
                Share My Type
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl brand-border space-y-8">
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">{result.analysis.analysis}</p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Type Breakdown</h3>
                <div className="space-y-4">
                  {Object.entries(result.analysis.secondaryTypes)
                    .sort(([, a], [, b]) => b - a)
                    .map(([type, percentage]) => (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="capitalize text-gray-700 dark:text-gray-300">
                          {FOUNDER_TYPE_RECOMMENDATIONS[type]?.title || type}
                        </span>
                        <span className="brand-text">{Math.round(percentage * 100)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${percentage * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center text-sm font-medium">
                <span className="text-gray-500 dark:text-gray-400">Confidence Score: </span>
                <span className="brand-text">{Math.round(result.analysis.confidence * 100)}%</span>
              </div>

              {/* Personalized Recommendations */}
              <div className="border-t brand-border pt-8">
                <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Personalized Recommendations</h3>
                <div className="space-y-6">
                  <div className="recommendation-card">
                    <h4 className="font-semibold brand-text text-lg mb-3">Your Key Strengths</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {FOUNDER_TYPE_RECOMMENDATIONS[result.analysis.primaryType.toLowerCase()]?.strengths}
                    </p>
                  </div>
                  <div className="recommendation-card">
                    <h4 className="font-semibold brand-text text-lg mb-3">Watch Out For</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {FOUNDER_TYPE_RECOMMENDATIONS[result.analysis.primaryType.toLowerCase()]?.watchOut}
                    </p>
                  </div>
                  <div className="recommendation-card">
                    <h4 className="font-semibold brand-text text-lg mb-3">Consider Doing</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {FOUNDER_TYPE_RECOMMENDATIONS[result.analysis.primaryType.toLowerCase()]?.consider}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 