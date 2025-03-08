import * as frame from '@farcaster/frame-sdk';

export async function initializeFrame() {
  try {
    let user = await frame.sdk.context.user;
    
    // Handle known issue where user might be nested
    if (user && user.user) {
      user = user.user;
    }

    if (!user || !user.fid) {
      // Most likely not in a frame
      return;
    }

    window.userFid = user.fid;

    // Remove splash screen when in a frame
    await frame.sdk.actions.ready();
  } catch (error) {
    console.error('Error initializing frame:', error);
  }
}

// Helper functions for common frame actions
export const frameActions = {
  openUrl: async (url) => {
    await frame.sdk.actions.openUrl(url);
  }
}; 