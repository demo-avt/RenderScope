import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Category } from '../types';
import { CameraCard } from './CameraCard';

interface CategorySectionProps {
  category: Category;
  expanded: boolean;
  onToggle: () => void;
  isPremium?: boolean;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  expanded,
  onToggle,
  isPremium = false
}) => {
  const totalFrames = category.cameras.reduce((sum, cam) => sum + cam.progress.total, 0);
  const completedFrames = category.cameras.reduce((sum, cam) => sum + cam.progress.completed, 0);
  const errorFrames = category.cameras.reduce((sum, cam) =>
    sum + cam.errors.corrupt.length + cam.errors.missing.length, 0
  );

  const avgProgress = totalFrames > 0 ? (completedFrames / totalFrames) * 100 : 0;

  const getCategoryIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      interior: '🏠',
      exterior: '🌲',
      animation: '🎬',
      vr_360: '🥽'
    };
    return iconMap[type] || '📹';
  };

  return (
    <div className="bg-gray-800/30 border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {expanded ? (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            )}
            <span className="text-2xl">{getCategoryIcon(category.type)}</span>
            <h3 className="text-xl font-bold text-white">{category.name}</h3>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">{category.cameras.length} cameras</span>
            <span className="text-green-400">{completedFrames}/{totalFrames} frames</span>
            {errorFrames > 0 && (
              <span className="text-red-400">{errorFrames} errors</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-bold text-white">{avgProgress.toFixed(1)}%</div>
            <div className="text-xs text-gray-400">Average Progress</div>
          </div>
          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 transition-all duration-500"
              style={{ width: `${Math.min(avgProgress, 100)}%` }}
            />
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {category.cameras.map((camera) => (
              <CameraCard key={camera.id} camera={camera} isPremium={isPremium} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};