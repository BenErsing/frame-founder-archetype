export async function generateMetadata({ searchParams }) {
  // Get the image URL based on type or use default
  const params = await searchParams;
  const type = params.type;

  // 3:2 image that represents the in-feed embedded image for each type
  const IMAGE_LOOKUP = {
    'visionary': 'https://placehold.co/1200x800/png',
    'strategic': 'https://placehold.co/1200x800/png',
    'community': 'https://placehold.co/1200x800/png',
    'contrarian': 'https://placehold.co/1200x800/png',
    'relentless': 'https://placehold.co/1200x800/png',
  }

  const imageUrl = type ? IMAGE_LOOKUP[type] : 'https://placehold.co/1200x800/png';

  return {
    title: 'Founder Archetype',
    description: 'Find out your founder archetype',
    other: {
      'fc:frame': JSON.stringify({
        version: "next",
        imageUrl,
        button: {
          title: 'Find Out Your Type',
          action: {
            type: "launch_frame",
            name: "Founder Archetype",
            url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
            splashImageUrl: 'https://placehold.co/200x200/png',
            splashBackgroundColor: '#9232ed'
          }
        }
      })
    }
  };
} 