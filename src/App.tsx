import React, { useState } from 'react';
import { Search, Loader2, Newspaper } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { PlatformSelector } from './components/PlatformSelector';
import { ContentCard } from './components/ContentCard';
import { generateSocialContent } from './lib/openai';
import { fetchGoogleNews } from './lib/newsService';
import type { Platform, GeneratedContent } from './types';
import type { NewsArticle } from './lib/newsService';

const PLATFORMS: Platform[] = [
  { id: 'tiktok', name: 'TikTok', icon: '📱', maxLength: 150 },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', maxLength: 500 },
  { id: 'facebook', name: 'Facebook', icon: '👥', maxLength: 63206 },
  { id: 'youtube', name: 'YouTube', icon: '🎥', maxLength: 5000 },
  { id: 'instagram', name: 'Instagram', icon: '📸', maxLength: 2200 },
];

function App() {
  const [keywords, setKeywords] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['tiktok', 'instagram']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);

  const handleTogglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywords.trim() || selectedPlatforms.length === 0) return;

    setIsGenerating(true);
    setGeneratedContent(selectedPlatforms.map(platform => ({
      platform,
      content: '',
      status: 'generating'
    })));

    try {
      // Fetch news articles first
      const articles = await fetchGoogleNews(keywords);
      setNewsArticles(articles);

      // Generate content using the articles
      const results = await Promise.all(
        selectedPlatforms.map(async platformId => {
          try {
            const platform = PLATFORMS.find(p => p.id === platformId)!;
            const content = await generateSocialContent(keywords, platform, articles);
            return { platform: platformId, content, status: 'ready' as const };
          } catch (error) {
            console.error(`Error generating content for ${platformId}:`, error);
            return { platform: platformId, content: '', status: 'error' as const };
          }
        })
      );
      setGeneratedContent(results);
    } catch (error) {
      console.error('Error in content generation:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Content Creator Assistant
          </h1>
          <p className="text-lg text-gray-600">
            Transform your ideas into engaging social media content
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label
                htmlFor="keywords"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter Keywords
              </label>
              <div className="relative">
                <input
                  id="keywords"
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Enter keywords or phrases..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  disabled={isGenerating}
                />
                <Search className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Platforms
              </label>
              <PlatformSelector
                platforms={PLATFORMS}
                selectedPlatforms={selectedPlatforms}
                onTogglePlatform={handleTogglePlatform}
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating || !keywords.trim() || selectedPlatforms.length === 0}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Content'
              )}
            </button>
          </form>
        </div>

        {newsArticles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              Related News Articles
            </h2>
            <div className="space-y-4">
              {newsArticles.map((article, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-md">
                  <h3 className="font-semibold text-gray-800">{article.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{article.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span>{article.source}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(article.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {generatedContent.length > 0 && (
          <div className="space-y-6">
            {generatedContent.map((content) => (
              <ContentCard key={content.platform} content={content} />
            ))}
          </div>
        )}
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;