import React from 'react';
import { getProgressBarColor } from '../utils/formatters';

interface ProgressBarProps {
  type: 'progress' | 'time' | 'error';
  percentage: number;
  label: string;
  sublabel?: string;
  errorFrames?: number[];
  maxFrames?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  type,
  percentage,
  label,
  sublabel,
  errorFrames = [],
  maxFrames = 1000
}) => {
  const colorClass = getProgressBarColor(type, percentage);
  const displayPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="relative mb-2">
      <div className="flex flex-col xs:flex-row xs:items-center justify-between text-xs mb-1 gap-1">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="text-gray-400 text-[10px] xs:text-xs truncate">{sublabel}</span>
      </div>

      <div className="relative h-5 md:h-6 bg-gray-800 rounded-md overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${displayPercentage}%` }}
        />

        {/* Error frame indicators */}
        {type === 'error' && errorFrames.length > 0 && (
          <div className="absolute inset-0 flex items-center px-1 md:px-2">
            <div className="flex flex-wrap gap-1 max-w-full overflow-hidden">
              {errorFrames.slice(0, 4).map((frameNum, index) => (
                <span
                  key={frameNum}
                  className="inline-block px-1 py-0.5 text-[9px] md:text-xs font-mono bg-red-800/80 text-red-200 rounded"
                >
                  {frameNum}
                </span>
              ))}
              {errorFrames.length > 4 && (
                <span className="inline-block px-1 py-0.5 text-[9px] md:text-xs font-mono bg-red-800/80 text-red-200 rounded">
                  +{errorFrames.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Progress text overlay */}
        {type !== 'error' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] md:text-xs font-semibold text-white mix-blend-difference">
              {displayPercentage.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};