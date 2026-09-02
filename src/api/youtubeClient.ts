import { YouTubePlaylist, YouTubePlaylistItem } from '../types/youtube';
import { parseISODurationToSeconds, formatSecondsToTime } from '../utils/duration';

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export class YouTubeClient {
  /**
   * Fetches user's custom playlists
   */
  static async fetchUserPlaylists(accessToken: string): Promise<YouTubePlaylist[]> {
    const url = `${YOUTUBE_BASE_URL}/playlists?mine=true&part=snippet,contentDetails&maxResults=50`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to fetch playlists (${res.status})`);
    }

    const data = await res.json();
    return data.items || [];
  }

  /**
   * Fetches items for a specific playlist
   */
  static async fetchPlaylistItems(
    playlistId: string,
    accessToken: string,
    maxItems = 50
  ): Promise<YouTubePlaylistItem[]> {
    const url = `${YOUTUBE_BASE_URL}/playlistItems?playlistId=${playlistId}&part=snippet,contentDetails,status&maxResults=${Math.min(maxItems, 50)}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to fetch playlist items (${res.status})`);
    }

    const data = await res.json();
    const items: YouTubePlaylistItem[] = data.items || [];

    // Optionally fetch video details for durations if contentDetails.duration is missing
    return items;
  }

  /**
   * Automatic Pruner Engine:
   * Categorizes items into Active Deck, Auto-Deleted (Unplayable/Private), and Auto-Kept (Live streams).
   */
  static processPlaylistItems(rawItems: YouTubePlaylistItem[]): {
    activeDeck: YouTubePlaylistItem[];
    autoDeletedQueue: YouTubePlaylistItem[];
    autoKeptQueue: YouTubePlaylistItem[];
  } {
    const activeDeck: YouTubePlaylistItem[] = [];
    const autoDeletedQueue: YouTubePlaylistItem[] = [];
    const autoKeptQueue: YouTubePlaylistItem[] = [];

    for (const item of rawItems) {
      const title = item.snippet?.title || '';
      const isUnplayable =
        title === 'Private video' ||
        title === 'Deleted video' ||
        !item.snippet?.thumbnails?.default;

      if (isUnplayable) {
        autoDeletedQueue.push({ ...item, isUnplayable: true });
        continue;
      }

      // Check if Live stream or upcoming
      const isLive = item.snippet?.title?.toLowerCase().includes('live stream') || false;
      if (isLive) {
        autoKeptQueue.push({ ...item, isLiveStream: true });
        continue;
      }

      // Compute parsed duration
      const durationStr = item.contentDetails?.duration;
      const parsedDurationSeconds = parseISODurationToSeconds(durationStr);
      const formattedDuration = formatSecondsToTime(parsedDurationSeconds);

      activeDeck.push({
        ...item,
        parsedDurationSeconds,
        formattedDuration,
      });
    }

    return { activeDeck, autoDeletedQueue, autoKeptQueue };
  }

  /**
   * Deletes a single item by playlistItemId
   * Treats 404 as successful deletion
   */
  static async deletePlaylistItem(playlistItemId: string, accessToken: string): Promise<boolean> {
    const url = `${YOUTUBE_BASE_URL}/playlistItems?id=${playlistItemId}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.status === 204 || res.status === 404) {
      return true; // 204 No Content or 404 Already Deleted
    }

    if (!res.ok) {
      console.warn(`Failed to delete item ${playlistItemId}: status ${res.status}`);
      return false;
    }

    return true;
  }

  /**
   * Batch deletes items with concurrency limit
   */
  static async batchDeletePlaylistItems(
    items: YouTubePlaylistItem[],
    accessToken: string,
    onProgress?: (completed: number, total: number) => void
  ): Promise<{ successCount: number; failedCount: number }> {
    let successCount = 0;
    let failedCount = 0;
    const total = items.length;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const ok = await this.deletePlaylistItem(item.id, accessToken);
      if (ok) {
        successCount++;
      } else {
        failedCount++;
      }
      if (onProgress) {
        onProgress(i + 1, total);
      }
    }

    return { successCount, failedCount };
  }
}
