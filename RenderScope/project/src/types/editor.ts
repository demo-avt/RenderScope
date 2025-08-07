export interface ProjectEditor {
  id: string;
  name: string;
  rootPath: string;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
}

export interface CameraEditor {
  id: string;
  name: string;
  categoryId: string;
  frameStart: number;
  frameEnd: number;
  outputPattern: string;
  status: 'ready' | 'missing_folder' | 'validation_error';
  validationMessage?: string;
  isEditing: boolean;
}

export interface BulkImportData {
  cameras: Array<{
    name: string;
    category: string;
    frameStart: number;
    frameEnd: number;
    outputPattern?: string;
  }>;
}

export interface FolderTreeNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: FolderTreeNode[];
  isNew?: boolean;
  isChanged?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  conflicts: string[];
  warnings: string[];
}