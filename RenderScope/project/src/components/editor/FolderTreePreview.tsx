import React from 'react';
import { Folder, FolderOpen, File } from 'lucide-react';
import { FolderTreeNode } from '../../types/editor';

interface FolderTreePreviewProps {
  rootPath: string;
  cameras: Array<{
    id: string;
    name: string;
    categoryId: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

export const FolderTreePreview: React.FC<FolderTreePreviewProps> = ({
  rootPath,
  cameras,
  categories
}) => {
  const generateTree = (): FolderTreeNode => {
    const root: FolderTreeNode = {
      name: rootPath.split('/').pop() || 'project',
      path: rootPath,
      type: 'folder',
      children: []
    };

    // Group cameras by category
    const camerasByCategory = cameras.reduce((acc, camera) => {
      if (!acc[camera.categoryId]) {
        acc[camera.categoryId] = [];
      }
      acc[camera.categoryId].push(camera);
      return acc;
    }, {} as Record<string, typeof cameras>);

    // Create category folders
    categories.forEach(category => {
      const categoryFolder: FolderTreeNode = {
        name: category.type,
        path: `${rootPath}/${category.type}`,
        type: 'folder',
        children: [],
        isNew: true
      };

      // Add camera folders
      const categoryCameras = camerasByCategory[category.id] || [];
      categoryCameras.forEach(camera => {
        const cameraFolder: FolderTreeNode = {
          name: camera.name,
          path: `${rootPath}/${category.type}/${camera.name}`,
          type: 'folder',
          children: [
            {
              name: 'frames',
              path: `${rootPath}/${category.type}/${camera.name}/frames`,
              type: 'folder',
              isNew: true
            }
          ],
          isNew: true
        };
        categoryFolder.children!.push(cameraFolder);
      });

      if (categoryFolder.children!.length > 0) {
        root.children!.push(categoryFolder);
      }
    });

    return root;
  };

  const renderNode = (node: FolderTreeNode, depth: number = 0): React.ReactNode => {
    const indent = depth * 20;

    return (
      <div key={node.path}>
        <div
          className={`flex items-center gap-2 py-1 px-2 rounded transition-colors ${
            node.isNew ? 'bg-lime-900/30 text-lime-300' :
            node.isChanged ? 'bg-orange-900/30 text-orange-300' :
            'text-gray-300'
          }`}
          style={{ marginLeft: indent }}
        >
          {node.type === 'folder' ? (
            node.children && node.children.length > 0 ? (
              <FolderOpen className="h-4 w-4" />
            ) : (
              <Folder className="h-4 w-4" />
            )
          ) : (
            <File className="h-4 w-4" />
          )}
          <span className="text-sm font-mono">{node.name}</span>
          {node.isNew && (
            <span className="text-xs bg-lime-600 text-white px-1 rounded">NEW</span>
          )}
          {node.isChanged && (
            <span className="text-xs bg-orange-600 text-white px-1 rounded">CHANGED</span>
          )}
        </div>
        {node.children?.map(child => renderNode(child, depth + 1))}
      </div>
    );
  };

  const tree = generateTree();

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Folder Structure Preview</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-lime-400 rounded-full"></div>
            <span className="text-gray-400">New</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-orange-400 rounded-full"></div>
            <span className="text-gray-400">Changed</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded p-3 max-h-80 overflow-y-auto">
        {tree.children && tree.children.length > 0 ? (
          <div className="space-y-1">
            {renderNode(tree)}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <div>No cameras configured</div>
            <div className="text-sm">Add cameras to see folder structure</div>
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-400">
        <div className="font-medium mb-1">Root Path:</div>
        <div className="font-mono bg-gray-800 px-2 py-1 rounded">{rootPath}</div>
      </div>
    </div>
  );
};