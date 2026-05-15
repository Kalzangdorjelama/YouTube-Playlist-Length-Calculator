import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch playlist details
 */
export const fetchPlaylistDetails = async (playlistId) => {
  try {
    const response = await apiClient.get(`/playlist/${playlistId}`);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Failed to fetch playlist';
    throw new Error(message);
  }
};

/**
 * Fetch all playlists from a channel
 */
export const fetchChannelPlaylists = async (channelId) => {
  try {
    const response = await apiClient.get(`/channel/${channelId}/playlists`);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Failed to fetch channel playlists';
    throw new Error(message);
  }
};

/**
 * Health check
 */
export const healthCheck = async () => {
  try {
    const response = await axios.get('http://localhost:5000/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not running');
  }
};

export default apiClient;
