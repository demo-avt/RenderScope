import React from 'react';
import { Camera as CameraIcon, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Camera } from '../types';
import { formatTime, getStatusColor } from '../utils/formatters';
import { ProgressBar } from './ProgressBar';
import { AdBanner } from './ads/AdBanner';

interface CameraCardProps {
  camera: Camera;
  isPremium?: boolean;
}

export const CameraCard: React.FC<CameraCardProps> = ({ camera, isPremium = false }) => {
  const timePercentage = camera.timing.expectedTotal > 0
    ? Math.min((camera.timing.elapsed / camera.timing.expectedTotal) * 100, 100)
    : 0;

  const errorPercentage = camera.progress.total > 0
    ? ((camera.errors.corrupt.length + camera.errors.missing.length) / camera.progress.total) * 100
    : 0;

  const allErrorFrames = [...camera.errors.corrupt, ...camera.errors.missing].sort((a, b) => a - b);

  const StatusIcon = () => {
    switch (camera.status) {
      case 'complete': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'rendering': return <Clock className="h-4 w-4 text-blue-400 animate-spin" />;
      default: return <CameraIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-3 md:p-4 hover:bg-gray-800/50 transition-all duration-200">
      <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusIcon />
          <h4 className="text-base md:text-lg font-semibold text-white truncate max-w-[150px] md:max-w-none">{camera.name}</h4>
          <span className="text-xs md:text-sm text-gray-400">
            [{camera.frameRange.start}-{camera.frameRange.end}]
          </span>
        </div>
        <div className={`text-xs md:text-sm font-medium ${getStatusColor(camera.status)}`}>
          {camera.status.toUpperCase()}
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        type="progress"
        percentage={camera.progress.percentage}
        label="Render Progress"
        sublabel={`${camera.progress.completed}/${camera.progress.total} frames | ETA: ${formatTime(camera.timing.eta)}`}
      />

      {/* Time Bar */}
      <ProgressBar
        type="time"
        percentage={timePercentage}
        label="Time Elapsed"
        sublabel={`${formatTime(camera.timing.elapsed)} / ${formatTime(camera.timing.expectedTotal)}`}
      />

      {/* Error Bar */}
      <ProgressBar
        type="error"
        percentage={errorPercentage}
        label="Errors & Issues"
        sublabel={`${allErrorFrames.length} problematic frames`}
        errorFrames={allErrorFrames}
        maxFrames={camera.progress.total}
      />

      {/* Frame Statistics */}
      <div className="mt-3 grid grid-cols-2 gap-2 md:gap-4 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Start Time:</span>
          <span className="text-gray-300 font-mono">{camera.timing.startTime.toLocaleTimeString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Frame Rate:</span>
          <span className="text-gray-300 font-mono">
            {camera.timing.elapsed > 0 ? (camera.progress.completed / (camera.timing.elapsed / 60000)).toFixed(1) : '0.0'} f/min
          </span>
        </div>
      </div>

      {/* Ad Banner */}
      <AdBanner cameraId={camera.id} isPremium={isPremium} />
    </div>
  );
};