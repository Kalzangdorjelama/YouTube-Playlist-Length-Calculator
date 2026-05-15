import { useState } from 'react';
import { useToast } from '../hooks/useCustom.js';
import { fetchChannelPlaylists } from '../services/api.js';
import { LoadingSpinner } from './Loading.jsx';
import { ToastContainer } from './Toast.jsx';

/**
 * ChannelBrowser - Component to browse and display playlists from a YouTube channel
 */
const ChannelBrowser = ({ onPlaylistSelect }) => {
  const [channelId, setChannelId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [channelData, setChannelData] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!channelId.trim()) {
      addToast('Please enter a channel ID', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchChannelPlaylists(channelId.trim());
      setChannelData(data);
      addToast(`Found ${data.playlists.length} playlists in this channel`, 'success');
    } catch (error) {
      addToast(error.message || 'Failed to fetch channel playlists', 'error');
      setChannelData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaylistClick = (playlistId) => {
    onPlaylistSelect(playlistId);
  };
  
//   console.log(channelData.channel.thumbnail)

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter YouTube Channel ID (e.g., UCxxxxx)"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Searching...' : 'Search Channel'}
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          💡 Tip: Find channel ID in the YouTube URL: youtube.com/channel/<strong>UCxxxxx</strong>
        </p>
      </form>

      {/* Loading State */}
      {isLoading && <LoadingSpinner size="lg" />}

      {/* Channel Info & Playlists */}
      {channelData && !isLoading && (
        <div className="space-y-6">
          {/* Channel Header */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 border border-dark-700">
            <div className="flex gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">{channelData.channel.title}</h2>
                <p className="text-gray-300 text-sm mt-1">{channelData.channel.description}</p>
                <div className="mt-3 text-sm">
                  <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full">
                    📁 {channelData.channel.playlistCount} Playlists
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Playlists Grid */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Playlists ({channelData.playlists.length})</h3>
            {channelData.playlists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {channelData.playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    onClick={() => handlePlaylistClick(playlist.id)}
                    className="bg-dark-800 rounded-lg overflow-hidden border border-dark-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer transform hover:scale-105"
                  >
                    {/* Thumbnail */}
                    {playlist.thumbnail && (
                      <div className="relative">
                        <img
                          src={playlist.thumbnail}
                          alt={playlist.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          📹 {playlist.itemCount} videos
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-4">
                      <h4 className="font-bold text-white line-clamp-2 mb-2">{playlist.title}</h4>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">{playlist.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>📅 {new Date(playlist.publishedAt).toLocaleDateString()}</span>
                        <span className="text-blue-400">View Details →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No playlists found in this channel
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!channelData && !isLoading && (
        <div className="text-center py-12 text-gray-400">
          Enter a channel ID to browse and view all playlists
        </div>
      )}
    </div>
  );
};

export default ChannelBrowser;
