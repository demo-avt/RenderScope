import React, { useState } from 'react';
import { Settings, Upload, Eye } from 'lucide-react';
import { Project } from '../../types';
import { useProjectEditor } from '../../hooks/useProjectEditor';
import { ProjectHeader } from './ProjectHeader';
import { CameraTable } from './CameraTable';
import { BulkImportModal } from './BulkImportModal';
import { FolderTreePreview } from './FolderTreePreview';
import { BulkImportData } from '../../types/editor';

interface FolderEditorProps {
  project: Project;
  onClose: () => void;
}

export const FolderEditor: React.FC<FolderEditorProps> = ({ project, onClose }) => {
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showFolderPreview, setShowFolderPreview] = useState(false);

  const {
    editorState,
    cameras,
    validationResults,
    updateProject,
    updateCamera,
    addCamera,
    removeCamera,
    reorderCameras,
    validateCamera,
    saveProject,
    resetProject
  } = useProjectEditor(project);

  const handleBulkImport = (data: BulkImportData) => {
    data.cameras.forEach(cameraData => {
      const category = project.categories.find(cat =>
        cat.type === cameraData.category || cat.name.toLowerCase() === cameraData.category.toLowerCase()
      );

      if (category) {
        addCamera({
          name: cameraData.name,
          categoryId: category.id,
          frameStart: cameraData.frameStart,
          frameEnd: cameraData.frameEnd,
          outputPattern: cameraData.outputPattern || `${cameraData.name}_####.exr`
        });
      }
    });
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            if (editorState.hasUnsavedChanges) {
              saveProject();
            }
            break;
          case 'z':
            e.preventDefault();
            resetProject();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorState.hasUnsavedChanges, saveProject, resetProject]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-gray-950 border border-gray-700 rounded-xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Folder & Camera Editor</h2>
              <p className="text-sm text-gray-400">Configure project structure and camera settings</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFolderPreview(!showFolderPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showFolderPreview
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>

            <button
              onClick={() => setShowBulkImport(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Bulk Import
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className={`grid ${showFolderPreview ? 'grid-cols-3' : 'grid-cols-1'} h-full`}>
            {/* Main Editor */}
            <div className={`${showFolderPreview ? 'col-span-2' : 'col-span-1'} overflow-y-auto p-6 space-y-6`}>
              <ProjectHeader
                project={editorState}
                onUpdate={updateProject}
                onSave={saveProject}
                onReset={resetProject}
              />

              <CameraTable
                cameras={cameras}
                categories={project.categories}
                onUpdateCamera={updateCamera}
                onRemoveCamera={removeCamera}
                onReorderCameras={reorderCameras}
                onAddCamera={addCamera}
              />
            </div>

            {/* Folder Preview */}
            {showFolderPreview && (
              <div className="border-l border-gray-700 p-6 overflow-y-auto">
                <FolderTreePreview
                  rootPath={editorState.rootPath}
                  cameras={cameras}
                  categories={project.categories}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 bg-gray-900 px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6 text-gray-400">
              <span>{cameras.length} cameras configured</span>
              <span>•</span>
              <span>{project.categories.length} categories</span>
              <span>•</span>
              <span>Ctrl+S to save, Ctrl+Z to reset</span>
            </div>

            <div className="flex items-center gap-4">
              {editorState.hasUnsavedChanges && (
                <div className="flex items-center gap-2 text-orange-400">
                  <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse" />
                  Unsaved changes
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BulkImportModal
        isOpen={showBulkImport}
        onClose={() => setShowBulkImport(false)}
        categories={project.categories}
        onImport={handleBulkImport}
      />
    </div>
  );
};