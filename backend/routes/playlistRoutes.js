import express from 'express';
import { getChannelPlaylists, getPlaylistDetails } from '../controllers/playlistController.js';

const router = express.Router();

/**
 * GET /api/playlist/:playlistId
 * Fetch playlist details including all videos and their durations
 */
router.get('/playlist/:playlistId', getPlaylistDetails);

/**
 * GET /api/channel/:channelId/playlists
 * Fetch all playlists from a channel
 */
router.get('/channel/:channelId/playlists', getChannelPlaylists);

export default router;
