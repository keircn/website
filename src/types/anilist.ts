export interface MediaTitle {
  english?: string;
  romaji?: string;
  native?: string;
}

export interface CoverImage {
  large?: string;
  medium?: string;
}

export interface Media {
  id: number;
  title: MediaTitle;
  format?: string;
  status?: string;
  episodes?: number;
  chapters?: number;
  volumes?: number;
  averageScore?: number;
  genres: string[];
  coverImage: CoverImage | null;
  description?: string;
}

export interface ListEntry {
  id: number;
  status?: string;
  score?: number;
  progress?: number;
  progressVolumes?: number;
  updatedAt?: number;
  media: Media;
}

export interface User {
  id: number;
  name: string;
  avatar: {
    large?: string;
  };
}

export interface ListGroup {
  name: string;
  entries: ListEntry[];
}

export interface AniListResponse {
  user: User | null;
  listsByStatus: Record<string, ListGroup>;
  totalEntries: number;
  perChunk: number;
  episodeCounts: Record<string, number>;
}

export type AniListStatus =
  | "CURRENT"
  | "PLANNING"
  | "COMPLETED"
  | "REPEATING"
  | "PAUSED"
  | "DROPPED"
  | "OTHER";

export interface UserProgress {
  status?: string;
  score?: number;
  progress?: number;
  progressVolumes?: number;
  updatedAt?: number;
}

export interface ReadingResponse {
  media: Media;
  userProgress: UserProgress | null;
  message?: string;
}
