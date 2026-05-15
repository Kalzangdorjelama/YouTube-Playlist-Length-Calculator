/**
 * Parse duration from seconds to human-readable format
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted duration like "1h 20m 33s"
 */
export const parseDurationFromSeconds = (seconds) => {
  if (seconds === 0) return '0s';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.join(' ');
};

/**
 * Convert ISO 8601 duration to seconds
 * Example: PT1H20M33S => 4833
 */
export const convertISO8601ToSeconds = (isoDuration) => {
  const regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/;
  const matches = isoDuration.match(regex);

  if (!matches) return 0;

  const hours = parseInt(matches[1] || 0, 10);
  const minutes = parseInt(matches[2] || 0, 10);
  const seconds = parseFloat(matches[3] || 0);

  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Convert seconds to ISO 8601 duration format
 */
export const secondsToISO8601 = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  let duration = 'PT';
  if (hours > 0) duration += `${hours}H`;
  if (minutes > 0) duration += `${minutes}M`;
  if (seconds > 0 || duration === 'PT') duration += `${seconds}S`;

  return duration;
};
