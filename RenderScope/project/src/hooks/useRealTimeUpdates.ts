import { useState, useEffect, useCallback } from 'react';
import { Project, ProjectStats } from '../types';
import { generateMockProjects, updateProjectProgress } from '../utils/mockData';

export const useRealTimeUpdates = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalFrames: 0,
    completedFrames: 0,
    errorFrames: 0,
    globalETA: 0
  });
  const [isConnected, setIsConnected] = useState(false);

  const calculateStats = useCallback((projectList: Project[]): ProjectStats => {
    const totalProjects = projectList.length;
    const activeProjects = projectList.filter(p => p.status === 'active').length;
    const totalFrames = projectList.reduce((sum, p) => sum + p.totalFrames, 0);
    const completedFrames = projectList.reduce((sum, p) => sum + p.completedFrames, 0);
    const errorFrames = projectList.reduce((sum, p) => {
      return sum + p.categories.reduce((catSum, cat) => {
        return catSum + cat.cameras.reduce((camSum, cam) => {
          return camSum + cam.errors.corrupt.length + cam.errors.missing.length;
        }, 0);
      }, 0);
    }, 0);

    const activeProjectsWithETA = projectList.filter(p => p.status === 'active');
    const globalETA = activeProjectsWithETA.length > 0
      ? Math.max(...activeProjectsWithETA.map(p => {
          const avgCameraETA = p.categories.reduce((sum, cat) => {
            const cameraETAs = cat.cameras.filter(cam => cam.status === 'rendering').map(cam => cam.timing.eta);
            return sum + (cameraETAs.length > 0 ? Math.max(...cameraETAs) : 0);
          }, 0) / Math.max(p.categories.length, 1);
          return avgCameraETA;
        }))
      : 0;

    return {
      totalProjects,
      activeProjects,
      totalFrames,
      completedFrames,
      errorFrames,
      globalETA
    };
  }, []);

  useEffect(() => {
    // Simulate WebSocket connection
    setIsConnected(true);

    // Initialize with mock projects
    const initialProjects = generateMockProjects();
    setProjects(initialProjects);
    setStats(calculateStats(initialProjects));

    // Simulate real-time updates
    const interval = setInterval(() => {
      setProjects(currentProjects => {
        const updatedProjects = currentProjects.map(updateProjectProgress);
        setStats(calculateStats(updatedProjects));
        return updatedProjects;
      });
    }, 2000); // Update every 2 seconds

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [calculateStats]);

  return {
    projects,
    stats,
    isConnected
  };
};