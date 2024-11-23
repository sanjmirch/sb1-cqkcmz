import OpenAI from 'openai';
import type { Platform } from '../types';
import type { NewsArticle } from './newsService';

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  throw new Error('OpenAI API key is required');
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const PLATFORM_PROMPTS: Record<string, string> = {
  tiktok: 'Create a short, engaging TikTok caption with trending hashtags.',
  pinterest: 'Write a Pinterest description that\'s SEO-friendly and inspiring.',
  facebook: 'Write an engaging Facebook post that encourages discussion.',
  youtube: 'Create an engaging YouTube video description with proper tags.',
  instagram: 'Write an Instagram caption with relevant hashtags.'
};

export async function generateSocialContent(
  keywords: string,
  platform: Platform,
  newsArticles?: NewsArticle[]
): Promise<string> {
  const prompt = PLATFORM_PROMPTS[platform.id];
  
  try {
    const newsContext = newsArticles 
      ? `Based on these news articles:\n${newsArticles.map(article => 
          `Title: ${article.title}\nDescription: ${article.description}\n`
        ).join('\n')}`
      : '';

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional social media content creator. ${prompt} Keep the content within ${platform.maxLength} characters if specified.`
        },
        {
          role: "user",
          content: `${newsContext}Create content about: ${keywords}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate content');
  }
}