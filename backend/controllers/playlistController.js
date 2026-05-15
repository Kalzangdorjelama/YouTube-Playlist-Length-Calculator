import { fetchChannelPlaylists, fetchPlaylistDetails } from '../services/youtubeService.js';

/**
 * Controller to handle playlist details request
 */
export const getPlaylistDetails = async (req, res, next) => {
  try {
    const { playlistId } = req.params;

    if (!playlistId || playlistId.trim() === '') {
      const error = new Error('Playlist ID is required');
      error.status = 400;
      throw error;
    }

    const playlistData = await fetchPlaylistDetails(playlistId);
    
    res.json({
      success: true,
      data: playlistData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to handle channel playlists request
 */
export const getChannelPlaylists = async (req, res, next) => {
  try {
    const { channelId } = req.params;

    if (!channelId || channelId.trim() === '') {
      const error = new Error('Channel ID is required');
      error.status = 400;
      throw error;
    }

    const channelData = await fetchChannelPlaylists(channelId);
    
    res.json({
      success: true,
      data: channelData
    });
  } catch (error) {
    next(error);
  }
};
