import React from 'react';
import { extractPlaylistId, isValidYoutubeUrl } from '../utils/helpers';

export const PlaylistInput = ({ value, onChange, onSubmit, loading }) => {
  const [error, setError] = React.useState('');

  const handleChange = (e) => {
    onChange(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!value.trim()) {
      setError('Please enter a YouTube playlist URL');
      return;
    }

    if (!isValidYoutubeUrl(value)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    const playlistId = extractPlaylistId(value);
    if (!playlistId) {
      setError('Could not extract playlist ID. Make sure URL contains "list=PLxxxxx"');
      return;
    }

    onSubmit(playlistId);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Paste YouTube playlist URL here..."
            className="flex-1 px-4 py-3 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-slate-500 dark:placeholder-slate-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-lg transition-all duration-200 transform disabled:scale-100 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Calculating...
              </>
            ) : (
              'Calculate'
            )}
          </button>
        </div>
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
        )}
      </div>
    </form>
  );
};
