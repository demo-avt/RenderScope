import React, { useState, useEffect } from 'react';
import { X, Plus, FolderPlus } from 'lucide-react';
import { CameraEditor } from '../../types/editor';

interface QuickAddDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{ id: string; name: string; type: string }>;
  suggestedFrameRange: { start: number; end: number };
  onAdd: (camera: Omit<CameraEditor, 'id' | 'status' | 'isEditing'>) => void;
}

export const QuickAddDrawer: React.FC<QuickAddDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  suggestedFrameRange,
  onAdd
}) => {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: categories[0]?.id || '',
    frameStart: suggestedFrameRange.start,
    frameEnd: suggestedFrameRange.end,
    outputPattern: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        frameStart: suggestedFrameRange.start,
        frameEnd: suggestedFrameRange.end,
        outputPattern: prev.name ? `${prev.name}_####.exr` : ''
      }));
    }
  }, [isOpen, suggestedFrameRange]);

  useEffect(() => {
    if (formData.name) {
      setFormData(prev => ({
        ...prev,
        outputPattern: `${formData.name}_####.exr`
      }));
    }
  }, [formData.name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    onAdd({
      name: formData.name.trim(),
      categoryId: formData.categoryId,
      frameStart: formData.frameStart,
      frameEnd: formData.frameEnd,
      outputPattern: formData.outputPattern
    });

    // Reset form
    setFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      frameStart: formData.frameEnd + 1,
      frameEnd: formData.frameEnd + 200,
      outputPattern: ''
    });
  };

  const handleCreateAndOpen = () => {
    handleSubmit(new Event('submit') as any);
    // Simulate opening folder
    console.log(`Opening folder for camera: ${formData.name}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">Quick Add Camera</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Camera Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              placeholder="e.g., Lobby_Main"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Frame
              </label>
              <input
                type="number"
                value={formData.frameStart}
                onChange={(e) => setFormData(prev => ({ ...prev, frameStart: parseInt(e.target.value) }))}
                className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Frame
              </label>
              <input
                type="number"
                value={formData.frameEnd}
                onChange={(e) => setFormData(prev => ({ ...prev, frameEnd: parseInt(e.target.value) }))}
                className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Output Pattern
            </label>
            <input
              type="text"
              value={formData.outputPattern}
              onChange={(e) => setFormData(prev => ({ ...prev, outputPattern: e.target.value }))}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              placeholder="camera_name_####.exr"
            />
          </div>

          <div className="text-sm text-gray-400 bg-gray-800 rounded p-3">
            <div className="font-medium mb-1">Auto-suggested range:</div>
            <div>Frames {suggestedFrameRange.start}-{suggestedFrameRange.end} ({suggestedFrameRange.end - suggestedFrameRange.start + 1} frames)</div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Camera
            </button>
            <button
              type="button"
              onClick={handleCreateAndOpen}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FolderPlus className="h-4 w-4" />
              Create & Open
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};