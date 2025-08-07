import { Project, Camera, Category } from '../types/index';

// Helper to convert object to CSV
const objectToCSV = (data: any[]): string => {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle special cases (null, undefined, objects, etc.)
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""');
      if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
      return value;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

// Helper to download data as a file
const downloadFile = (data: string, fileName: string, fileType: string): void => {
  const blob = new Blob([data], { type: fileType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Export project to CSV
export const exportProjectToCSV = (project: Project): void => {
  // Flatten project data for CSV
  const projectData = project.categories.flatMap(category => {
    return category.cameras.map(camera => {
      return {
        project_id: project.id,
        project_name: project.name,
        project_status: project.status,
        project_progress: project.globalProgress,
        category_id: category.id,
        category_name: category.name,
        category_type: category.type,
        camera_id: camera.id,
        camera_name: camera.name,
        camera_status: camera.status,
        camera_progress: camera.progress.percentage,
        frame_start: camera.frameRange.start,
        frame_end: camera.frameRange.end,
        frames_completed: camera.progress.completed,
        frames_total: camera.progress.total,
        corrupt_frames: camera.errors.corrupt.length,
        missing_frames: camera.errors.missing.length,
        eta_seconds: camera.timing.eta
      };
    });
  });

  const csv = objectToCSV(projectData);
  downloadFile(csv, `${project.name}_export_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
};

// Export project to JSON
export const exportProjectToJSON = (project: Project): void => {
  const json = JSON.stringify(project, null, 2);
  downloadFile(json, `${project.name}_export_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
};

// Export camera data to CSV
export const exportCameraToCSV = (camera: Camera, projectName: string, categoryName: string): void => {
  // Convert frames to flat data
  const frameData = camera.frames.map(frame => {
    return {
      project_name: projectName,
      category_name: categoryName,
      camera_name: camera.name,
      frame_number: frame.number,
      frame_status: frame.status,
      frame_path: frame.path || '',
      frame_timestamp: frame.timestamp ? frame.timestamp.toISOString() : ''
    };
  });

  const csv = objectToCSV(frameData);
  downloadFile(csv, `${camera.name}_frames_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
};

// Export all project data (multiple formats)
export const exportAllProjectData = (project: Project): void => {
  // Export main project data
  exportProjectToJSON(project);

  // Export frame data for each camera
  project.categories.forEach(category => {
    category.cameras.forEach(camera => {
      exportCameraToCSV(camera, project.name, category.name);
    });
  });
};