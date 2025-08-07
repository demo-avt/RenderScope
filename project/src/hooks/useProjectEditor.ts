import { useState, useCallback } from 'react';
import { ProjectEditor, CameraEditor, ValidationResult } from '../types/editor';
import { Project, Category } from '../types';

export const useProjectEditor = (project: Project) => {
  const [editorState, setEditorState] = useState<ProjectEditor>({
    id: project.id,
    name: project.name,
    rootPath: `/mnt/render/${project.name}`,
    isEditing: false,
    hasUnsavedChanges: false
  });

  const [cameras, setCameras] = useState<CameraEditor[]>(() => {
    return project.categories.flatMap(category =>
      category.cameras.map(camera => ({
        id: camera.id,
        name: camera.name,
        categoryId: category.id,
        frameStart: camera.frameRange.start,
        frameEnd: camera.frameRange.end,
        outputPattern: `${camera.name}_####.exr`,
        status: 'ready' as const,
        isEditing: false
      }))
    );
  });

  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({});

  const updateProject = useCallback((updates: Partial<ProjectEditor>) => {
    setEditorState(prev => ({
      ...prev,
      ...updates,
      hasUnsavedChanges: true
    }));
  }, []);

  const updateCamera = useCallback((cameraId: string, updates: Partial<CameraEditor>) => {
    setCameras(prev => prev.map(cam =>
      cam.id === cameraId
        ? { ...cam, ...updates }
        : cam
    ));
    setEditorState(prev => ({ ...prev, hasUnsavedChanges: true }));
  }, []);

  const addCamera = useCallback((camera: Omit<CameraEditor, 'id' | 'status' | 'isEditing'>) => {
    const newCamera: CameraEditor = {
      ...camera,
      id: `cam_${Date.now()}`,
      status: 'ready',
      isEditing: false
    };
    setCameras(prev => [...prev, newCamera]);
    setEditorState(prev => ({ ...prev, hasUnsavedChanges: true }));
  }, []);

  const removeCamera = useCallback((cameraId: string) => {
    setCameras(prev => prev.filter(cam => cam.id !== cameraId));
    setEditorState(prev => ({ ...prev, hasUnsavedChanges: true }));
  }, []);

  const reorderCameras = useCallback((cameraIds: string[]) => {
    const cameraMap = new Map(cameras.map(cam => [cam.id, cam]));
    const reorderedCameras = cameraIds.map(id => cameraMap.get(id)!).filter(Boolean);
    setCameras(reorderedCameras);
    setEditorState(prev => ({ ...prev, hasUnsavedChanges: true }));
  }, [cameras]);

  const validateCamera = useCallback(async (camera: CameraEditor): Promise<ValidationResult> => {
    // Simulate validation
    await new Promise(resolve => setTimeout(resolve, 100));

    const conflicts: string[] = [];
    const warnings: string[] = [];

    if (camera.frameStart >= camera.frameEnd) {
      conflicts.push('Start frame must be less than end frame');
    }

    if (camera.frameEnd - camera.frameStart > 10000) {
      warnings.push('Large frame range may impact performance');
    }

    const result = {
      valid: conflicts.length === 0,
      conflicts,
      warnings
    };

    setValidationResults(prev => ({
      ...prev,
      [camera.id]: result
    }));

    return result;
  }, []);

  const saveProject = useCallback(async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    setEditorState(prev => ({
      ...prev,
      hasUnsavedChanges: false,
      isEditing: false
    }));

    // Update camera statuses
    setCameras(prev => prev.map(cam => ({
      ...cam,
      status: validationResults[cam.id]?.valid !== false ? 'ready' : 'validation_error',
      isEditing: false
    })));
  }, [validationResults]);

  const resetProject = useCallback(() => {
    setEditorState({
      id: project.id,
      name: project.name,
      rootPath: `/mnt/render/${project.name}`,
      isEditing: false,
      hasUnsavedChanges: false
    });

    setCameras(project.categories.flatMap(category =>
      category.cameras.map(camera => ({
        id: camera.id,
        name: camera.name,
        categoryId: category.id,
        frameStart: camera.frameRange.start,
        frameEnd: camera.frameRange.end,
        outputPattern: `${camera.name}_####.exr`,
        status: 'ready' as const,
        isEditing: false
      }))
    ));

    setValidationResults({});
  }, [project]);

  return {
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
  };
};