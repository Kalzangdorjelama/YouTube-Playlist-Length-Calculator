import axios from 'axios';
import { parseDurationFromSeconds } from '../utils/durationParser.js';
import { batchArray } from '../utils/helpers.js';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const MAX_RESULTS_PER_REQUEST = 50;
const VIDEO_BATCH_SIZE = 50; // YouTube API max 50 items per request

// Helper to get API key dynamically
const getApiKey = () => {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    throw new Error('YOUTUBE_API_KEY environment variable is not set');
  }
  return key;
};

/**
 * Fetch all videos in a playlist with their durations
 */
export const fetchPlaylistDetails = async (playlistId) => {
  try {
    // Step 1: Fetch playlist metadata
    const playlistData = await fetchPlaylistMetadata(playlistId);

    // Step 2: Fetch all video IDs from playlist
    const videoIds = await fetchAllPlaylistItems(playlistId);

    // Step 3: Fetch video durations in batches
    const videoDurations = await fetchVideoDurations(videoIds);

    // Step 4: Calculate statistics
    const stats = calculateDurationStats(videoDurations);

    return {
      playlist: playlistData,
      videos: videoDurations,
      statistics: stats
    };
  } catch (error) {
    console.error('Error fetching playlist details:', error.message);
    const err = new Error(error.response?.data?.error?.message || error.message);
    err.status = error.response?.status || 500;
    throw err;
  }
};

/**
 * Fetch playlist metadata (title, thumbnail, etc.)
 */
const fetchPlaylistMetadata = async (playlistId) => {
  const url = `${YOUTUBE_API_BASE}/playlists`;
  const API_KEY = getApiKey();
  
  try {
    console.log(`🔍 Fetching playlist metadata for: ${playlistId}`);
    console.log(`🔑 Using API Key: ${API_KEY ? 'Present' : 'MISSING'}`);
    
    const response = await axios.get(url, {
      params: {
        part: 'snippet,contentDetails',
        id: playlistId,
        key: API_KEY
      }
    });

    if (!response.data.items || response.data.items.length === 0) {
      const error = new Error('Playlist not found');
      error.status = 404;
      throw error;
    }

    const playlist = response.data.items[0];
    console.log(`✅ Playlist fetched: ${playlist.snippet.title}`);
    
    return {
      id: playlist.id,
      title: playlist.snippet.title,
      description: playlist.snippet.description || '',
      thumbnail: playlist.snippet.thumbnails.high?.url || '',
      itemCount: playlist.contentDetails.itemCount,
      publishedAt: playlist.snippet.publishedAt,
      channelTitle: playlist.snippet.channelTitle
    };
  } catch (error) {
    console.error('❌ Error fetching playlist metadata:');
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

/**
 * Fetch all video IDs from playlist (handles pagination)
 */
const fetchAllPlaylistItems = async (playlistId) => {
  const videoIds = [];
  let nextPageToken = null;
  const API_KEY = getApiKey();

  do {
    const url = `${YOUTUBE_API_BASE}/playlistItems`;
    
    const response = await axios.get(url, {
      params: {
        part: 'contentDetails,snippet',
        playlistId,
        maxResults: MAX_RESULTS_PER_REQUEST,
        pageToken: nextPageToken,
        key: API_KEY
      }
    });

    // Extract video IDs
    response.data.items?.forEach(item => {
      videoIds.push({
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high?.url || ''
      });
    });

    nextPageToken = response.data.nextPageToken;
  } while (nextPageToken);

  return videoIds;
};

/**
 * Fetch video durations in batches
 */
const fetchVideoDurations = async (videos) => {
  const batches = batchArray(videos, VIDEO_BATCH_SIZE);
  const allVideos = [];
  const API_KEY = getApiKey();

  for (const batch of batches) {
    const videoIds = batch.map(v => v.id).join(',');
    const url = `${YOUTUBE_API_BASE}/videos`;

    const response = await axios.get(url, {
      params: {
        part: 'contentDetails,statistics',
        id: videoIds,
        key: API_KEY
      }
    });

    response.data.items?.forEach(item => {
      const video = batch.find(v => v.id === item.id);
      const durationSeconds = convertISO8601ToSeconds(item.contentDetails.duration);
      
      allVideos.push({
        id: item.id,
        title: video.title,
        thumbnail: video.thumbnail,
        duration: item.contentDetails.duration,
        durationSeconds,
        formattedDuration: parseDurationFromSeconds(durationSeconds),
        viewCount: item.statistics?.viewCount || 0
      });
    });
  }

  return allVideos;
};

/**
 * Convert ISO 8601 duration to seconds
 * Example: PT1H20M33S => 4833 seconds
 */
const convertISO8601ToSeconds = (isoDuration) => {
  const regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  const matches = isoDuration.match(regex);

  if (!matches) return 0;

  const hours = parseInt(matches[1] || 0, 10);
  const minutes = parseInt(matches[2] || 0, 10);
  const seconds = parseInt(matches[3] || 0, 10);

  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Calculate playlist statistics
 */
const calculateDurationStats = (videos) => {
  const totalSeconds = videos.reduce((sum, video) => sum + video.durationSeconds, 0);
  const totalVideos = videos.length;

  return {
    totalVideos,
    totalDurationSeconds: totalSeconds,
    totalDuration: parseDurationFromSeconds(totalSeconds),
    averageDuration: totalVideos > 0 ? parseDurationFromSeconds(Math.round(totalSeconds / totalVideos)) : '0s',
    speedAdjusted: {
      '1x': parseDurationFromSeconds(totalSeconds),
      '1.25x': parseDurationFromSeconds(Math.round(totalSeconds / 1.25)),
      '1.5x': parseDurationFromSeconds(Math.round(totalSeconds / 1.5)),
      '2x': parseDurationFromSeconds(Math.round(totalSeconds / 2))
    }
  };
};

/**
 * Fetch all playlists from a channel
 */
export const fetchChannelPlaylists = async (channelId) => {
  try {
    const playlists = [];
    let nextPageToken = null;
    const API_KEY = getApiKey();

    // Fetch channel info first
    const channelUrl = `${YOUTUBE_API_BASE}/channels`;
    const channelResponse = await axios.get(channelUrl, {
      params: {
        part: 'snippet',
        id: channelId,
        key: API_KEY
      }
    });

    console.log('📺 Channel API Response:', JSON.stringify(channelResponse.data, null, 2));

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      const error = new Error('Channel not found');
      error.status = 404;
      throw error;
    }

    const channelInfo = channelResponse.data.items[0];

    // Fetch all playlists from the channel
    do {
      const url = `${YOUTUBE_API_BASE}/playlists`;
      const response = await axios.get(url, {
        params: {
          part: 'snippet,contentDetails',
          channelId,
          maxResults: MAX_RESULTS_PER_REQUEST,
          pageToken: nextPageToken,
          key: API_KEY
        }
      });

      response.data.items?.forEach(item => {
        playlists.push({
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description || '',
          thumbnail: item.snippet.thumbnails.high?.url || '',
          itemCount: item.contentDetails.itemCount,
          publishedAt: item.snippet.publishedAt
        });
      });

      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    return {
      channel: {
        id: channelInfo.id,
        title: channelInfo.snippet.title,
        description: channelInfo.snippet.description || '',
        thumbnail: channelInfo.snippet.thumbnails.high?.url || '',
        playlistCount: playlists.length
      },
      playlists
    };
  } catch (error) {
    console.error('Error fetching channel playlists:', error.message);
    console.error('YouTube API Error:', error.response?.data?.error);
    const err = new Error(error.response?.data?.error?.message || error.message);
    err.status = error.response?.status || 500;
    throw err;
  }
};
