import { Project, Camera, Category, Frame } from '../types';

const categoryTypes = ['interior', 'exterior', 'animation', 'vr_360'] as const;

const projectNames = [
  'Cyberpunk_Cityscape',
  'Forest_Environment',
  'Sci_Fi_Laboratory',
  'Underwater_Scene',
  'Mountain_Vista'
];

const generateFrames = (start: number, end: number): Frame[] => {
  const frames: Frame[] = [];
  for (let i = start; i <= end; i++) {
    const random = Math.random();
    let status: Frame['status'] = 'complete';

    if (random < 0.05) status = 'corrupt';
    else if (random < 0.08) status = 'missing';
    else if (random < 0.15) status = 'rendering';

    frames.push({
      number: i,
      status,
      path: status === 'complete' ? `/render/frame_${i.toString().padStart(4, '0')}.exr` : undefined,
      timestamp: status === 'complete' ? new Date(Date.now() - Math.random() * 3600000) : undefined
    });
  }
  return frames;
};

const generateCamera = (index: number): Camera => {
  const frameStart = 1;
  const frameEnd = Math.floor(Math.random() * 500) + 100;
  const frames = generateFrames(frameStart, frameEnd);

  const completedFrames = frames.filter(f => f.status === 'complete').length;
  const corruptFrames = frames.filter(f => f.status === 'corrupt').map(f => f.number);
  const missingFrames = frames.filter(f => f.status === 'missing').map(f => f.number);

  const total = frameEnd - frameStart + 1;
  const percentage = (completedFrames / total) * 100;

  const startTime = new Date(Date.now() - Math.random() * 86400000);
  const elapsed = Date.now() - startTime.getTime();
  const expectedTotal = total * 120000; // 2 minutes per frame average
  const eta = percentage > 0 ? (elapsed / percentage) * (100 - percentage) : expectedTotal;

  return {
    id: `cam_${(index + 1).toString().padStart(2, '0')}`,
    name: `Camera_${(index + 1).toString().padStart(2, '0')}`,
    frameRange: { start: frameStart, end: frameEnd },
    frames,
    progress: {
      completed: completedFrames,
      total,
      percentage: Math.round(percentage * 100) / 100
    },
    timing: {
      startTime,
      elapsed,
      eta,
      expectedTotal
    },
    errors: {
      corrupt: corruptFrames,
      missing: missingFrames
    },
    status: percentage >= 100 ? 'complete' : corruptFrames.length > 0 || missingFrames.length > 0 ? 'error' : 'rendering'
  };
};

const generateCategory = (type: typeof categoryTypes[number], cameraCount: number): Category => {
  const cameras = Array.from({ length: cameraCount }, (_, i) => generateCamera(i));

  return {
    id: `cat_${type}`,
    name: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    type,
    cameras
  };
};

export const generateMockProjects = (): Project[] => {
  return projectNames.slice(0, 3).map((name, projectIndex) => {
    const categories = categoryTypes.slice(0, Math.floor(Math.random() * 3) + 2).map(type => {
      const cameraCount = Math.floor(Math.random() * 4) + 2;
      return generateCategory(type, cameraCount);
    });

    const totalFrames = categories.reduce((sum, cat) =>
      sum + cat.cameras.reduce((camSum, cam) => camSum + cam.progress.total, 0), 0
    );

    const completedFrames = categories.reduce((sum, cat) =>
      sum + cat.cameras.reduce((camSum, cam) => camSum + cam.progress.completed, 0), 0
    );

    const globalProgress = totalFrames > 0 ? (completedFrames / totalFrames) * 100 : 0;

    const startTime = new Date(Date.now() - Math.random() * 172800000); // Random start within 2 days
    const deadline = new Date(startTime.getTime() + 604800000); // 7 days from start

    return {
      id: `proj_${projectIndex + 1}`,
      name,
      categories,
      totalFrames,
      completedFrames,
      globalProgress: Math.round(globalProgress * 100) / 100,
      startTime,
      deadline,
      status: globalProgress >= 100 ? 'complete' : globalProgress < 50 && Date.now() > deadline.getTime() ? 'delayed' : 'active'
    };
  });
};

export const updateProjectProgress = (project: Project): Project => {
  const updatedCategories = project.categories.map(category => ({
    ...category,
    cameras: category.cameras.map(camera => {
      if (camera.status === 'complete') return camera;

      // Simulate progress
      const shouldProgress = Math.random() < 0.3;
      if (!shouldProgress) return camera;

      const newFrames = camera.frames.map(frame => {
        if (frame.status === 'rendering' && Math.random() < 0.4) {
          return {
            ...frame,
            status: Math.random() < 0.95 ? 'complete' as const : 'corrupt' as const,
            timestamp: new Date(),
            path: `/render/frame_${frame.number.toString().padStart(4, '0')}.exr`
          };
        }
        return frame;
      });

      const completedFrames = newFrames.filter(f => f.status === 'complete').length;
      const corruptFrames = newFrames.filter(f => f.status === 'corrupt').map(f => f.number);
      const missingFrames = newFrames.filter(f => f.status === 'missing').map(f => f.number);

      const percentage = (completedFrames / camera.progress.total) * 100;
      const elapsed = Date.now() - camera.timing.startTime.getTime();
      const eta = percentage > 0 && percentage < 100 ? (elapsed / percentage) * (100 - percentage) : 0;

      return {
        ...camera,
        frames: newFrames,
        progress: {
          ...camera.progress,
          completed: completedFrames,
          percentage: Math.round(percentage * 100) / 100
        },
        timing: {
          ...camera.timing,
          elapsed,
          eta
        },
        errors: {
          corrupt: corruptFrames,
          missing: missingFrames
        },
        status: percentage >= 100 ? 'complete' : corruptFrames.length > 0 || missingFrames.length > 0 ? 'error' : 'rendering'
      };
    })
  }));

  const totalFrames = updatedCategories.reduce((sum, cat) =>
    sum + cat.cameras.reduce((camSum, cam) => camSum + cam.progress.total, 0), 0
  );

  const completedFrames = updatedCategories.reduce((sum, cat) =>
    sum + cat.cameras.reduce((camSum, cam) => camSum + cam.progress.completed, 0), 0
  );

  const globalProgress = totalFrames > 0 ? (completedFrames / totalFrames) * 100 : 0;

  return {
    ...project,
    categories: updatedCategories,
    totalFrames,
    completedFrames,
    globalProgress: Math.round(globalProgress * 100) / 100,
    status: globalProgress >= 100 ? 'complete' : globalProgress < 50 && Date.now() > project.deadline.getTime() ? 'delayed' : 'active'
  };
};