
export const PlaylistHeader = ({ playlist }) => {
  return (
    <div className="glass rounded-xl p-6 md:flex gap-6 items-center">
      {playlist.thumbnail && (
        <img
          src={playlist.thumbnail}
          alt={playlist.title}
          className="w-32 h-32 rounded-lg object-cover shadow-lg mb-4 md:mb-0"
        />
      )}
      <div className="flex-1">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 line-clamp-2">
          {playlist.title}
        </h2>
        {playlist.description && (
          <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
            {playlist.description}
          </p>
        )}
        <p className="text-sm text-slate-500 dark:text-slate-500">
          By {playlist.channelTitle}
        </p>
      </div>
    </div>
  );
};

export const StatCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="glass rounded-xl p-6 flex items-center gap-4">
      {icon && (
        <div className="text-3xl bg-blue-500/20 dark:bg-blue-400/20 p-3 rounded-lg">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
          {title}
        </p>
        <p className="text-2xl md:text-3xl font-bold">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export const DurationCard = ({ title, durations }) => {
  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {Object.entries(durations).map(([speed, duration]) => (
          <div key={speed} className="flex justify-between items-center pb-3 border-b border-white/10 dark:border-slate-600 last:border-0">
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              {speed}
            </span>
            <span className="font-semibold text-lg">
              {duration}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ResultsGrid = ({ playlist, statistics }) => {
  return (
    <div className="space-y-6">
      <PlaylistHeader playlist={playlist} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Videos"
          value={statistics.totalVideos}
          icon="🎬"
        />
        <StatCard
          title="Average Duration"
          value={statistics.averageDuration}
          icon="⏱️"
        />
        <StatCard
          title="Total Duration"
          value={statistics.totalDuration}
          subtitle={`${(statistics.totalDurationSeconds / 3600).toFixed(1)} hours`}
          icon="⏰"
        />
      </div>

      <DurationCard
        title="Watch Duration at Different Speeds"
        durations={statistics.speedAdjusted}
      />
    </div>
  );
};
