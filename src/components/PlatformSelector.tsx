import React from 'react';
import { Check } from 'lucide-react';
import type { Platform } from '../types';

interface PlatformSelectorProps {
  platforms: Platform[];
  selectedPlatforms: string[];
  onTogglePlatform: (platformId: string) => void;
}

export function PlatformSelector({
  platforms,
  selectedPlatforms,
  onTogglePlatform,
}: PlatformSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {platforms.map((platform) => (
        <button
          key={platform.id}
          onClick={() => onTogglePlatform(platform.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            selectedPlatforms.includes(platform.id)
              ? 'bg-indigo-600 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-300'
          }`}
        >
          <span className={platform.icon} />
          {platform.name}
          {selectedPlatforms.includes(platform.id) && (
            <Check className="w-4 h-4" />
          )}
        </button>
      ))}
    </div>
  );
}