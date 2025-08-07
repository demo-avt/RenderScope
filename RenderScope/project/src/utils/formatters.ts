export const formatTime = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'complete': return 'text-green-400';
    case 'rendering': case 'active': return 'text-blue-400';
    case 'error': case 'corrupt': return 'text-red-400';
    case 'delayed': case 'missing': return 'text-orange-400';
    case 'paused': case 'idle': return 'text-gray-400';
    default: return 'text-gray-400';
  }
};

export const getProgressBarColor = (type: 'progress' | 'time' | 'error', percentage: number = 0): string => {
  switch (type) {
    case 'progress':
      if (percentage >= 90) return 'bg-green-500';
      if (percentage >= 70) return 'bg-green-400';
      return 'bg-green-300';
    case 'time':
      return 'bg-blue-400';
    case 'error':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
};