import React from 'react';
import { Activity, Server, AlertTriangle, CheckCircle } from 'lucide-react';
import { ProjectStats } from '../types';
import { formatTime } from '../utils/formatters';

interface GlobalStatsProps {
  stats: ProjectStats;
  isConnected: boolean;
}

export const GlobalStats: React.FC<GlobalStatsProps> = ({ stats, isConnected }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl md:text-2xl font-bold text-white">{stats.activeProjects}</div>
            <div className="text-xs md:text-sm text-gray-400">Active Projects</div>
          </div>
          <Activity className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {stats.totalProjects} total projects
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl md:text-2xl font-bold text-green-400">{stats.completedFrames.toLocaleString()}</div>
            <div className="text-xs md:text-sm text-gray-400">Frames Rendered</div>
          </div>
          <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-400" />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {stats.totalFrames.toLocaleString()} total frames
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl md:text-2xl font-bold text-red-400">{stats.errorFrames}</div>
            <div className="text-xs md:text-sm text-gray-400">Error Frames</div>
          </div>
          <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-red-400" />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Requires attention
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl md:text-2xl font-bold text-blue-400">{formatTime(stats.globalETA)}</div>
            <div className="text-xs md:text-sm text-gray-400">Global ETA</div>
          </div>
          <Server className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-xs text-gray-500">
            {isConnected ? 'Live Updates' : 'Disconnected'}
          </span>
        </div>
      </div>
    </div>
  );
};