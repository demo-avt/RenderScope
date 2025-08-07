import React, { useState, useRef } from 'react';
import { Save, RotateCcw, FolderOpen, Edit3, Check, X } from 'lucide-react';
import { ProjectEditor } from '../../types/editor';

interface ProjectHeaderProps {
  project: ProjectEditor;
  onUpdate: (updates: Partial<ProjectEditor>) => void;
  onSave: () => Promise<void>;
  onReset: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  onUpdate,
  onSave,
  onReset
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(project.name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  const handleNameEdit = () => {
    if (isEditingName) {
      onUpdate({ name: tempName });
      setIsEditingName(false);
    } else {
      setTempName(project.name);
      setIsEditingName(true);
    }
  };

  const handleNameCancel = () => {
    setTempName(project.name);
    setIsEditingName(false);
  };

  const handleFolderSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const path = files[0].webkitRelativePath.split('/')[0];
      onUpdate({ rootPath: `/mnt/render/${path}` });
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="text-2xl font-bold bg-gray-800 text-white border border-gray-600 rounded px-3 py-1 focus:outline-none focus:border-blue-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameEdit();
                  if (e.key === 'Escape') handleNameCancel();
                }}
                autoFocus
              />
              <button
                onClick={handleNameEdit}
                className="p-1 text-green-400 hover:text-green-300 transition-colors"
              >
                <Check className="h-5 w-5" />
              </button>
              <button
                onClick={handleNameCancel}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              <button
                onClick={handleNameEdit}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={!project.hasUnsavedChanges || isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Apply'}
          </button>

          <button
            onClick={onReset}
            disabled={!project.hasUnsavedChanges}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Render Root Path
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={project.rootPath}
              onChange={(e) => onUpdate({ rootPath: e.target.value })}
              className="flex-1 bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              placeholder="/mnt/render/project_name"
            />
            <button
              onClick={handleFolderSelect}
              className="px-3 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
            >
              <FolderOpen className="h-5 w-5" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            webkitdirectory=""
            directory=""
            multiple
            onChange={handleFolderChange}
            className="hidden"
          />
        </div>

        <div className="flex items-end">
          {project.hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-orange-400 text-sm">
              <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse" />
              Unsaved changes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};