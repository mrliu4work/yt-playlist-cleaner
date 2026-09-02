/**
 * Parses ISO 8601 duration (e.g. "PT42M15S", "PT1H5M") into total seconds.
 */
export function parseISODurationToSeconds(durationStr?: string): number {
  if (!durationStr) return 0;
  
  const regex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = durationStr.match(regex);
  if (!matches) return 0;

  const days = parseInt(matches[1] || '0', 10);
  const hours = parseInt(matches[2] || '0', 10);
  const minutes = parseInt(matches[3] || '0', 10);
  const seconds = parseInt(matches[4] || '0', 10);

  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

/**
 * Formats seconds into "HH:MM:SS" or "MM:SS"
 */
export function formatSecondsToTime(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds <= 0) return '00:00';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Formats seconds into human readable text (e.g., "5 小時 30 分")
 */
export function formatSecondsToHumanReadable(totalSeconds: number): string {
  if (totalSeconds <= 0) return '0 分鐘';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} 小時 ${minutes > 0 ? `${minutes} 分` : ''}`;
  }
  return `${minutes} 分鐘`;
}
