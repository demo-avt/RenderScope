import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Edit3, Trash2, Plus } from 'lucide-react';
import { CameraEditor } from '../../types/editor';
import { CameraRow } from './CameraRow';
import { QuickAddDrawer } from './QuickAddDrawer';

interface CameraTableProps {
  cameras: CameraEditor[];
  categories: Array<{ id: string; name: string; type: string }>;
  onUpdateCamera: (cameraId: string, updates: Partial<CameraEditor>) => void;
  onRemoveCamera: (cameraId: string) => void;
  onReorderCameras: (cameraIds: string[]) => void;
  onAddCamera: (camera: Omit<CameraEditor, 'id' | 'status' | 'isEditing'>) => void;
}

export const CameraTable: React.FC<CameraTableProps> = ({
  cameras,
  categories,
  onUpdateCamera,
  onRemoveCamera,
  onReorderCameras,
  onAddCamera
}) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cameras.findIndex(cam => cam.id === active.id);
      const newIndex = cameras.findIndex(cam => cam.id === over.id);

      const newOrder = arrayMove(cameras, oldIndex, newIndex);
      onReorderCameras(newOrder.map(cam => cam.id));
    }
  };

  const getNextFrameRange = () => {
    if (cameras.length === 0) return { start: 1001, end: 1200 };

    const lastCamera = cameras[cameras.length - 1];
    return {
      start: lastCamera.frameEnd + 1,
      end: lastCamera.frameEnd + 200
    };
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Cameras & Frame Ranges</h2>
        <button
          onClick={() => setShowQuickAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Quick Add
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Camera Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Frame Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Output Pattern
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={cameras.map(cam => cam.id)} strategy={verticalListSortingStrategy}>
                {cameras.map((camera) => (
                  <CameraRow
                    key={camera.id}
                    camera={camera}
                    categories={categories}
                    onUpdate={(updates) => onUpdateCamera(camera.id, updates)}
                    onRemove={() => onRemoveCamera(camera.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </tbody>
        </table>
      </div>

      {cameras.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="text-gray-400 text-lg mb-2">No cameras configured</div>
          <div className="text-gray-500 text-sm mb-4">
            Add cameras to start tracking render progress
          </div>
          <button
            onClick={() => setShowQuickAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add First Camera
          </button>
        </div>
      )}

      <QuickAddDrawer
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        categories={categories}
        suggestedFrameRange={getNextFrameRange()}
        onAdd={onAddCamera}
      />
    </div>
  );
};