import { useCallback, useState } from 'react';
import ChannelBrowser from '../components/ChannelBrowser.jsx';
import { CardSkeleton } from '../components/Loading';
import { PlaylistInput } from '../components/PlaylistInput';
import { ResultsGrid } from '../components/Results';
import { ToastContainer } from '../components/Toast';
import { PlaylistHistory } from '../components/Utils';
import { usePlaylistHistory, useToast } from '../hooks/useCustom';
import { fetchPlaylistDetails } from '../services/api';

export const Dashboard = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('playlist'); // 'playlist' or 'channel'
  const { toasts, addToast, removeToast } = useToast();
  const { history, addToHistory, clearHistory } = usePlaylistHistory();

  const handleCalculate = useCallback(async (playlistId) => {
    setLoading(true);
    setResults(null);

    try {
      const data = await fetchPlaylistDetails(playlistId);
      setResults(data);
      setUrl('');

      // Add to history
      addToHistory({
        playlistId,
        title: data.playlist.title,
        videoCount: data.statistics.totalVideos,
        totalDurationSeconds: data.statistics.totalDurationSeconds,
        thumbnail: data.playlist.thumbnail
      });

      addToast('Playlist calculated successfully!', 'success');
    } catch (error) {
      console.error('Error:', error);
      addToast(error.message || 'Failed to fetch playlist', 'error');
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [addToast, addToHistory]);

  const handleHistorySelect = useCallback((item) => {
    handleCalculate(item.playlistId);
  }, [handleCalculate]);

  return (
    <div className="space-y-8 py-12">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-dark-700">
        <button
          onClick={() => setActiveTab('playlist')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'playlist'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          📊 Calculate Playlist Length
        </button>
        <button
          onClick={() => setActiveTab('channel')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'channel'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          📁 Browse Channel Playlists
        </button>
      </div>

      {/* Playlist Tab */}
      {activeTab === 'playlist' && (
        <>
          {/* Main Input Section */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Calculate Your Playlist Length
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Paste a YouTube playlist URL and instantly see the total duration at different playback speeds
              </p>
            </div>
            <PlaylistInput
              value={url}
              onChange={setUrl}
              onSubmit={handleCalculate}
              loading={loading}
            />
          </div>

          {/* Results Section */}
          {results ? (
            <div>
              <ResultsGrid
                playlist={results.playlist}
                statistics={results.statistics}
              />
            </div>
          ) : loading ? (
            <div className="space-y-4">
              <CardSkeleton />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            </div>
          ) : null}

          {/* History Section */}
          {history.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-4">Quick Access</h3>
              <PlaylistHistory
                history={history}
                onSelect={handleHistorySelect}
                onClear={clearHistory}
              />
            </div>
          )}
        </>
      )}

      {/* Channel Browser Tab */}
      {activeTab === 'channel' && (
        <ChannelBrowser onPlaylistSelect={handleCalculate} />
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};
