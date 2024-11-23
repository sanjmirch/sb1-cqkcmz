export interface Platform {
  id: string;
  name: string;
  icon: string;
  maxLength?: number;
}

export interface GeneratedContent {
  platform: string;
  content: string;
  status: 'generating' | 'ready' | 'error';
}

export interface NewsArticle {
  title: string;
  source: string;
  description: string;
  lastUpdated: string;
  dateCreated: string;
  url?: string;
}

export interface KeywordSearch {
  keyword: string;
  searchDate: string;
}