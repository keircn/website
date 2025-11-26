export interface VNDBTitle {
  title?: string;
  latin?: string;
  official?: string;
  main?: string;
}

export interface VNDBImage {
  url?: string;
  sexual?: number;
  violence?: number;
}

export interface VNDB {
  id: string;
  title?: string;
  titles?: VNDBTitle[];
  alttitle?: string;
  image?: VNDBImage;
  length?: number;
  description?: string;
  rating?: number;
  votecount?: number;
  released?: string;
  languages?: string[];
  platforms?: string[];
  tags?: Array<{
    id: number;
    name: string;
    rating: number;
    spoiler: number;
  }>;
}

export interface VNDBResponse {
  results: VNDB[];
  more: boolean;
}
