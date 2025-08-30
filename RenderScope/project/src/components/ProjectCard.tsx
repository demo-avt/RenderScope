import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, Activity, Settings } from 'lucide-react';
import { Project } from '../types';
import { formatDateTime, formatTime, getStatusColor } from '../utils/formatters';
import { CategorySection } from './CategorySection';
import { FolderEditor } from './editor/FolderEditor';
import { ExportButton } from './ExportButton';
import { useNotificationContext } from '../contexts/NotificationContext';

interface ProjectCardProps {
  project: Project;
  isPremium?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, isPremium = false }) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [showEditor, setShowEditor] = useState(false);
  const { info } = useNotificationContext();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const totalErrorFrames = project.categories.reduce((sum, cat) =>
    sum + cat.cameras.reduce((camSum, cam) =>
      camSum + cam.errors.corrupt.length + cam.errors.missing.length, 0
    ), 0
  );

  const activeCameras = project.categories.reduce((sum, cat) =>
    sum + cat.cameras.filter(cam => cam.status === 'rendering').length, 0
  );

  const totalCameras = project.categories.reduce((sum, cat) => sum + cat.cameras.length, 0);

  const avgETA = project.categories.reduce((sum, cat) => {
    const activeETAs = cat.cameras.filter(cam => cam.status === 'rendering').map(cam => cam.timing.eta);
    return sum + (activeETAs.length > 0 ? Math.max(...activeETAs) : 0);
  }, 0) / Math.max(project.categories.length, 1);

  const ProjectStatusIcon = () => {
    switch (project.status) {
      case 'complete': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'delayed': return <AlertCircle className="h-5 w-5 text-orange-400" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-400" />;
      default: return <Activity className="h-5 w-5 text-blue-400" />;
    }
  };

  const handleOpenEditor = () => {
    setShowEditor(true);
    info('Project Editor', 'You can now edit project structure and camera settings.');
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
      {/* Project Header */}
      <div className="px-6 py-5 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ProjectStatusIcon />
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                <button
                  onClick={handleOpenEditor}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  title="Edit project structure"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Deadline: {formatDateTime(project.deadline)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Started: {formatDateTime(project.startTime)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ExportButton project={project} />

            <div className="text-right">
              <div className="text-3xl font-bold text-white">{project.globalProgress.toFixed(1)}%</div>
              <div className={`text-sm font-medium ${getStatusColor(project.status)}`}>
                {project.status.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-300">Global Progress</span>
            <span className="text-gray-400">
              {project.completedFrames}/{project.totalFrames} frames | ETA: {formatTime(avgETA)}
            </span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
              style={{ width: `${Math.min(project.globalProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="p-6 space-y-4">
        {project.categories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            expanded={expandedCategories[category.id] || false}
            onToggle={() => toggleCategory(category.id)}
            isPremium={isPremium}
          />
        ))}
      </div>

      {/* Project Footer */}
      <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">{activeCameras}</div>
            <div className="text-xs text-gray-400">Active Cameras</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">{project.completedFrames}</div>
            <div className="text-xs text-gray-400">Completed Frames</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-400">{totalErrorFrames}</div>
            <div className="text-xs text-gray-400">Error Frames</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-400">{formatTime(avgETA)}</div>
            <div className="text-xs text-gray-400">Est. Completion</div>
          </div>
        </div>
      </div>

      {/* Folder Editor Modal */}
      {showEditor && (
        <FolderEditor
          project={project}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};