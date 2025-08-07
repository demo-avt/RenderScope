export interface Frame {
  number: number;
  status: 'complete' | 'corrupt' | 'missing' | 'rendering';
  path?: string;
  timestamp?: Date;
}

export interface Camera {
  id: string;
  name: string;
  frameRange: {
    start: number;
    end: number;
  };
  frames: Frame[];
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  timing: {
    startTime: Date;
    elapsed: number;
    eta: number;
    expectedTotal: number;
  };
  errors: {
    corrupt: number[];
    missing: number[];
  };
  status: 'idle' | 'rendering' | 'complete' | 'error' | 'paused';
}

export interface Category {
  id: string;
  name: string;
  type: 'interior' | 'exterior' | 'animation' | 'vr_360';
  cameras: Camera[];
}

export interface Project {
  id: string;
  name: string;
  categories: Category[];
  totalFrames: number;
  completedFrames: number;
  globalProgress: number;
  startTime: Date;
  deadline: Date;
  status: 'active' | 'complete' | 'delayed' | 'error';
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  totalFrames: number;
  completedFrames: number;
  errorFrames: number;
  globalETA: number;
}