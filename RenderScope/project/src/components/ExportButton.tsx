import React, { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, X } from 'lucide-react';
import { Project } from '../types';
import { exportProjectToCSV, exportProjectToJSON, exportAllProjectData } from '../utils/exportUtils';
import { useNotificationContext } from '../contexts/NotificationContext';

interface ExportButtonProps {
  project: Project;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ project }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { success, error } = useNotificationContext();

  const handleExport = (type: 'csv' | 'json' | 'all') => {
    try {
      switch (type) {
        case 'csv':
          exportProjectToCSV(project);
          success('Export Successful', `Project "${project.name}" exported to CSV successfully.`);
          break;
        case 'json':
          exportProjectToJSON(project);
          success('Export Successful', `Project "${project.name}" exported to JSON successfully.`);
          break;
        case 'all':
          exportAllProjectData(project);
          success('Export Successful', `All data for project "${project.name}" exported successfully.`);
          break;
      }
    } catch (err) {
      console.error('Export error:', err);
      error('Export Failed', `Failed to export project "${project.name}". Please try again.`);
    }

    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
        aria-label="Export project data"
      >
        <Download className="h-4 w-4" />
        <span>Export</span>
      </button>

      {showDropdown && (
        <>
          {/* Backdrop for closing the dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 border border-gray-700 z-20">
            <div className="py-1">
              <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                <span>Export Options</span>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => handleExport('csv')}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4 text-green-400" />
                Export as CSV
              </button>

              <button
                onClick={() => handleExport('json')}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
              >
                <FileJson className="h-4 w-4 text-blue-400" />
                Export as JSON
              </button>

              <div className="border-t border-gray-700 my-1"></div>

              <button
                onClick={() => handleExport('all')}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4 text-purple-400" />
                Export All Data
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};