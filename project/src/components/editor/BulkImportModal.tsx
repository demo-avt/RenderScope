import React, { useState } from 'react';
import { X, Upload, FileText, Download } from 'lucide-react';
import Papa from 'papaparse';
import { BulkImportData } from '../../types/editor';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{ id: string; name: string; type: string }>;
  onImport: (data: BulkImportData) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  categories,
  onImport
}) => {
  const [importData, setImportData] = useState<BulkImportData>({ cameras: [] });
  const [jsonInput, setJsonInput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'csv' | 'json'>('csv');

  const sampleCSV = `name,category,frameStart,frameEnd,outputPattern
Lobby_Main,interior,1001,1200,Lobby_Main_####.exr
Lobby_Wide,interior,1001,1200,Lobby_Wide_####.exr
Exterior_Day,exterior,2001,2400,Exterior_Day_####.exr`;

  const sampleJSON = `{
  "cameras": [
    {
      "name": "Lobby_Main",
      "category": "interior",
      "frameStart": 1001,
      "frameEnd": 1200,
      "outputPattern": "Lobby_Main_####.exr"
    },
    {
      "name": "Exterior_Day",
      "category": "exterior",
      "frameStart": 2001,
      "frameEnd": 2400,
      "outputPattern": "Exterior_Day_####.exr"
    }
  ]
}`;

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const cameras = results.data
          .filter((row: any) => row.name && row.category)
          .map((row: any) => ({
            name: row.name,
            category: row.category,
            frameStart: parseInt(row.frameStart) || 1001,
            frameEnd: parseInt(row.frameEnd) || 1200,
            outputPattern: row.outputPattern || `${row.name}_####.exr`
          }));

        setImportData({ cameras });
        validateImportData({ cameras });
      },
      error: (error) => {
        setErrors([`CSV parsing error: ${error.message}`]);
      }
    });
  };

  const handleJSONInput = () => {
    try {
      const data = JSON.parse(jsonInput);
      if (!data.cameras || !Array.isArray(data.cameras)) {
        throw new Error('JSON must contain a "cameras" array');
      }

      setImportData(data);
      validateImportData(data);
    } catch (error) {
      setErrors([`JSON parsing error: ${(error as Error).message}`]);
    }
  };

  const validateImportData = (data: BulkImportData) => {
    const newErrors: string[] = [];
    const categoryIds = categories.map(cat => cat.id);

    data.cameras.forEach((camera, index) => {
      if (!camera.name) {
        newErrors.push(`Camera ${index + 1}: Name is required`);
      }
      if (!categoryIds.includes(camera.category)) {
        newErrors.push(`Camera ${index + 1}: Invalid category "${camera.category}"`);
      }
      if (camera.frameStart >= camera.frameEnd) {
        newErrors.push(`Camera ${index + 1}: Start frame must be less than end frame`);
      }
    });

    setErrors(newErrors);
  };

  const handleImport = () => {
    if (errors.length === 0 && importData.cameras.length > 0) {
      onImport(importData);
      onClose();
      resetModal();
    }
  };

  const resetModal = () => {
    setImportData({ cameras: [] });
    setJsonInput('');
    setErrors([]);
    setActiveTab('csv');
  };

  const downloadSample = (type: 'csv' | 'json') => {
    const content = type === 'csv' ? sampleCSV : sampleJSON;
    const blob = new Blob([content], { type: type === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample_cameras.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">Bulk Import Cameras</h3>
          <button
            onClick={() => { onClose(); resetModal(); }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('csv')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'csv'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              CSV Upload
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'json'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Upload className="h-4 w-4 inline mr-2" />
              JSON Paste
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div>
              {activeTab === 'csv' ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">Upload CSV File</h4>
                    <button
                      onClick={() => downloadSample('csv')}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Sample CSV
                    </button>
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  />
                  <div className="mt-4 text-sm text-gray-400">
                    <div className="font-medium mb-2">Expected CSV format:</div>
                    <pre className="bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                      {sampleCSV}
                    </pre>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">Paste JSON Data</h4>
                    <button
                      onClick={() => downloadSample('json')}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Sample JSON
                    </button>
                  </div>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full h-64 bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400 font-mono text-sm"
                    placeholder="Paste your JSON data here..."
                  />
                  <button
                    onClick={handleJSONInput}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Parse JSON
                  </button>
                </div>
              )}
            </div>

            {/* Preview Section */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Preview ({importData.cameras.length} cameras)
              </h4>

              {errors.length > 0 && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded">
                  <div className="text-red-400 font-medium mb-2">Validation Errors:</div>
                  <ul className="text-red-300 text-sm space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-gray-800 rounded max-h-80 overflow-y-auto">
                {importData.cameras.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-700 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-gray-300">Name</th>
                        <th className="px-3 py-2 text-left text-gray-300">Category</th>
                        <th className="px-3 py-2 text-left text-gray-300">Frames</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {importData.cameras.map((camera, index) => (
                        <tr key={index} className="hover:bg-gray-700">
                          <td className="px-3 py-2 text-white">{camera.name}</td>
                          <td className="px-3 py-2 text-gray-300">{camera.category}</td>
                          <td className="px-3 py-2 text-gray-300 font-mono">
                            {camera.frameStart}-{camera.frameEnd}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    No cameras to preview
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-700">
            <button
              onClick={() => { onClose(); resetModal(); }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={errors.length > 0 || importData.cameras.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Import {importData.cameras.length} Cameras
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};