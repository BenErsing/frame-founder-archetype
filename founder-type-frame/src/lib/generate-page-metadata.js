export async function generateMetadata({ searchParams }) {
  // Get the image URL based on type or use default
  const params = await searchParams;
  const type = params.type;

  // 3:2 image that represents the in-feed embedded image for each type
  const IMAGE_LOOKUP = {
    'visionary': '/visionary-builder.webp',
    'strategic': '/strategic-operator.webp',
    'community': '/community-catalyst.webp',
    'contrarian': '/contrarian.webp',
    'relentless': '/problem-solver.webp',
  }

  const imageUrl = type ? IMAGE_LOOKUP[type] : '/archetype-frame-coverimage.png';

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