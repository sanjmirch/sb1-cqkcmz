import React from 'react';
import { Copy, Share2, ExternalLink } from 'lucide-react';
import type { GeneratedContent, NewsArticle } from '../types';
import { toast } from 'react-hot-toast';

interface ContentCardProps {
  content: GeneratedContent | NewsArticle;
  type?: 'content' | 'news';
}

export function ContentCard({ content, type = 'content' }: ContentCardProps) {
  const copyToClipboard = async () => {
    try {
      const textToCopy = type === 'content' 
        ? (content as GeneratedContent).content 
        : (content as NewsArticle).description;
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy content');
    }
  };

  if (type === 'content') {
    const contentData = content as GeneratedContent;
    
    if (contentData.status === 'generating') {
      return (
        <div className="bg-white rounded-lg p-6 shadow-md animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      );
    }

    if (contentData.status === 'error') {
      return (
        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <p className="text-red-600">Failed to generate content</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{contentData.platform}</h3>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-5 h-5 text-gray-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        <p className="text-gray-600 whitespace-pre-wrap">{contentData.content}</p>
      </div>
    );
  }

  // News article card
  const newsData = content as NewsArticle;
  return (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{newsData.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="w-5 h-5 text-gray-600" />
          </button>
          {newsData.url && (
            <a
              href={newsData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Open article"
            >
              <ExternalLink className="w-5 h-5 text-gray-600" />
            </a>
          )}
        </div>
      </div>
      <p className="text-gray-600 mb-4">{newsData.description}</p>
      <div className="text-sm text-gray-500">
        <span>{newsData.source}</span>
        <span className="mx-2">•</span>
        <span>{new Date(newsData.lastUpdated).toLocaleDateString()}</span>
      </div>
    </div>
  );
}