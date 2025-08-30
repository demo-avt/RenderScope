import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit3, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import { CameraEditor } from '../../types/editor';

interface CameraRowProps {
  camera: CameraEditor;
  categories: Array<{ id: string; name: string; type: string }>;
  onUpdate: (updates: Partial<CameraEditor>) => void;
  onRemove: () => void;
}

export const CameraRow: React.FC<CameraRowProps> = ({
  camera,
  categories,
  onUpdate,
  onRemove
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, any>>({});

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: camera.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const startEdit = (field: string, value: any) => {
    setEditingField(field);
    setTempValues({ [field]: value });
  };

  const saveEdit = (field: string) => {
    onUpdate({ [field]: tempValues[field] });
    setEditingField(null);
    setTempValues({});
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValues({});
  };

  const getStatusIndicator = () => {
    switch (camera.status) {
      case 'ready':
        return <div className="h-3 w-3 bg-green-400 rounded-full" title="Ready" />;
      case 'missing_folder':
        return <div className="h-3 w-3 bg-orange-400 rounded-full" title="Missing folder" />;
      case 'validation_error':
        return <div className="h-3 w-3 bg-red-400 rounded-full" title="Validation error" />;
      default:
        return <div className="h-3 w-3 bg-gray-400 rounded-full" />;
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown';
  };

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-gray-800 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="text-gray-400 hover:text-gray-300 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {editingField === 'name' ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempValues.name}
                onChange={(e) => setTempValues({ name: e.target.value })}
                className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit('name');
                  if (e.key === 'Escape') cancelEdit();
                }}
                autoFocus
              />
              <button
                onClick={() => saveEdit('name')}
                className="text-green-400 hover:text-green-300"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={cancelEdit}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{camera.name}</span>
              <button
                onClick={() => startEdit('name', camera.name)}
                className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit3 className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {editingField === 'categoryId' ? (
          <div className="flex items-center gap-2">
            <select
              value={tempValues.categoryId}
              onChange={(e) => setTempValues({ categoryId: e.target.value })}
              className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit('categoryId');
                if (e.key === 'Escape') cancelEdit();
              }}
              autoFocus
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button
              onClick={() => saveEdit('categoryId')}
              className="text-green-400 hover:text-green-300"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={cancelEdit}
              className="text-red-400 hover:text-red-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <span className="text-gray-300">{getCategoryName(camera.categoryId)}</span>
            <button
              onClick={() => startEdit('categoryId', camera.categoryId)}
              className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit3 className="h-3 w-3" />
            </button>
          </div>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {editingField === 'frameRange' ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={tempValues.frameStart}
              onChange={(e) => setTempValues(prev => ({ ...prev, frameStart: parseInt(e.target.value) }))}
              className="w-20 bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              value={tempValues.frameEnd}
              onChange={(e) => setTempValues(prev => ({ ...prev, frameEnd: parseInt(e.target.value) }))}
              className="w-20 bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={() => saveEdit('frameRange')}
              className="text-green-400 hover:text-green-300"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={cancelEdit}
              className="text-red-400 hover:text-red-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <span className="text-gray-300 font-mono">
              {camera.frameStart}-{camera.frameEnd}
            </span>
            <span className="text-gray-500 text-sm">
              ({camera.frameEnd - camera.frameStart + 1} frames)
            </span>
            <button
              onClick={() => startEdit('frameRange', { frameStart: camera.frameStart, frameEnd: camera.frameEnd })}
              className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit3 className="h-3 w-3" />
            </button>
          </div>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {editingField === 'outputPattern' ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tempValues.outputPattern}
              onChange={(e) => setTempValues({ outputPattern: e.target.value })}
              className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit('outputPattern');
                if (e.key === 'Escape') cancelEdit();
              }}
              autoFocus
            />
            <button
              onClick={() => saveEdit('outputPattern')}
              className="text-green-400 hover:text-green-300"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={cancelEdit}
              className="text-red-400 hover:text-red-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <span className="text-gray-300 font-mono text-sm">{camera.outputPattern}</span>
            <button
              onClick={() => startEdit('outputPattern', camera.outputPattern)}
              className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit3 className="h-3 w-3" />
            </button>
          </div>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {getStatusIndicator()}
          <span className="text-sm text-gray-300 capitalize">
            {camera.status.replace('_', ' ')}
          </span>
          {camera.validationMessage && (
            <div className="group relative">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {camera.validationMessage}
              </div>
            </div>
          )}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={onRemove}
          className="text-red-400 hover:text-red-300 transition-colors"
          title="Delete camera"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
};