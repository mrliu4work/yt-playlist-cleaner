export interface YouTubeThumbnail {
  url: string;
  width?: number;
  height?: number;
}

export interface YouTubeThumbnails {
  default?: YouTubeThumbnail;
  medium?: YouTubeThumbnail;
  high?: YouTubeThumbnail;
  standard?: YouTubeThumbnail;
  maxres?: YouTubeThumbnail;
}

export interface YouTubePlaylist {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: YouTubeThumbnails;
    channelTitle: string;
  };
  contentDetails: {
    itemCount: number;
  };
}

export interface YouTubePlaylistItem {
  id: string; // Unique playlistItemId (CRITICAL for duplicates)
  snippet: {
    playlistId: string;
    position: number;
    title: string;
    description: string;
    publishedAt: string;
    thumbnails?: YouTubeThumbnails;
    channelTitle?: string;
    resourceId: {
      kind: string;
      videoId: string;
    };
    videoOwnerChannelTitle?: string;
  };
  contentDetails?: {
    videoId: string;
    videoPublishedAt?: string;
    duration?: string; // Standard ISO 8601 duration e.g. PT42M15S
  };
  status?: {
    privacyStatus: string;
  };
  // Extended local flags computed during auto-pruning
  parsedDurationSeconds?: number;
  formattedDuration?: string;
  addedTimeAgo?: string;
  isUnplayable?: boolean;
  isLiveStream?: boolean;
}
