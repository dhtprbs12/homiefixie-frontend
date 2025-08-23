export interface Material {
  name: string;
  spec?: string;
  qty?: string;
  description?: string;
  alt?: string[];
  image_url?: string;
  product_url?: string;
  store_price?: string;
  store_name?: string;
}

export interface Tool {
  name: string;
  purpose?: string;
  description?: string;
  image_url?: string;
  product_url?: string;
  store_price?: string;
  store_name?: string;
}

export interface YouTubeVideo {
  url: string;
  title: string;
  channel?: string;
  views?: string;
  duration?: string;
}

export interface AnalysisResult {
  materials: Material[];
  tools: Tool[];
  steps: string[];
  likelihood?: Record<string, number>;
  safety?: string[];
  youtube_url?: string;
  youtube_videos?: YouTubeVideo[];
}

export interface AnalyzeResponse extends AnalysisResult {
  ticketId: number;
}

export interface Ticket {
  id: number;
  created_at: string;
  status: string;
  user_email?: string;
  description: string;
  latest_analysis?: {
    id: number;
    ticket_id: number;
    materials: Material[];
    tools: Tool[];
    steps: string[];
    likelihood?: Record<string, number>;
    safety?: string[];
    youtube_url?: string;
    created_at: string;
  };
}