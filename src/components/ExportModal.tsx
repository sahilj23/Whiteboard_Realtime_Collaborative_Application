import React, { useState } from 'react';
import { X, Download, FileImage, FileText, Image } from 'lucide-react';
import { exportCanvasAsPNG, exportCanvasAsPDF, exportCanvasAsJPG } from '../utils/export';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCanvasRef?: (canvas: HTMLCanvasElement | null) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onCanvasRef }) => {
  const [filename, setFilename] = useState('whiteboard');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async (format: 'png' | 'pdf' | 'jpg') => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) {
      alert('No canvas found to export');
      return;
    }

    setIsExporting(true);
    try {
      let success = false;
      switch (format) {
        case 'png':
          success = await exportCanvasAsPNG(canvas, filename);
          break;
        case 'pdf':
          success = await exportCanvasAsPDF(canvas, filename);
          break;
        case 'jpg':
          success = await exportCanvasAsJPG(canvas, filename);
          break;
      }

      if (success) {
        onClose();
      } else {
        alert('Failed to export. Please try again.');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      format: 'png' as const,
      icon: FileImage,
      title: 'PNG Image',
      description: 'High quality with transparency support',
      color: 'blue',
    },
    {
      format: 'jpg' as const,
      icon: Image,
      title: 'JPG Image',
      description: 'Smaller file size, white background',
      color: 'green',
    },
    {
      format: 'pdf' as const,
      icon: FileText,
      title: 'PDF Document',
      description: 'Vector format, perfect for printing',
      color: 'red',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Export Whiteboard</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filename
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="whiteboard"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Export Format
            </label>
            {exportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.format}
                  onClick={() => handleExport(option.format)}
                  disabled={isExporting}
                  className={`w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-${option.color}-300 hover:bg-${option.color}-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className={`p-3 bg-${option.color}-100 rounded-xl`}>
                    <Icon size={24} className={`text-${option.color}-600`} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{option.title}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                  <Download size={20} className="text-gray-400 ml-auto" />
                </button>
              );
            })}
          </div>

          {isExporting && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Exporting...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportModal;