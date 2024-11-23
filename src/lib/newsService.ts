import axios from 'axios';
import { subDays, format } from 'date-fns';
import type { NewsArticle } from '../types';

if (!import.meta.env.VITE_EXA_API_KEY) {
  throw new Error('Exa API key is required');
}

interface ExaHighlight {
  text: string;
  score: number;
}

interface ExaResult {
  title: string;
  url: string;
  published: string;
  author: string;
  text: string;
  highlights: ExaHighlight[];
  summary: string;
}

interface ExaResponse {
  results: ExaResult[];
  status: string;
}

export async function fetchGoogleNews(keyword: string): Promise<NewsArticle[]> {
  try {
    const endDate = new Date();
    const startDate = subDays(endDate, 7); // Get news from last 7 days

    const response = await axios.post<ExaResponse>(
      'https://api.exa.ai/search',
      {
        query: keyword,
        category: 'news',
        type: 'neural',
        useAutoprompt: true,
        startPublishedDate: format(startDate, 'yyyy-MM-dd'),
        endPublishedDate: format(endDate, 'yyyy-MM-dd'),
        numResults: 3,
        contents: {
          text: true,
          highlights: true,
          summary: true
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_EXA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.results.map(result => ({
      title: result.title,
      source: result.author || 'Unknown Source',
      description: result.summary || result.highlights[0]?.text || result.text.slice(0, 200),
      lastUpdated: result.published,
      dateCreated: result.published,
      url: result.url
    }));
  } catch (error) {
    console.error('Error fetching news from Exa:', error);
    throw new Error('Failed to fetch news articles');
  }
}