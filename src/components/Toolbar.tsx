import React from 'react';
import {
  Pen,
  Eraser,
  Square,
  Circle,
  Minus,
  Type,
  MousePointer,
  Undo,
  Redo,
  Trash2,
  Download,
  Palette,
} from 'lucide-react';
import { Tool } from '../types';
import { colors } from '../utils/helpers';

interface ToolbarProps {
  currentTool: Tool;
  onToolChange: (tool: Tool) => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  currentTool,
  onToolChange,
  currentColor,
  onColorChange,
  strokeWidth,
  onStrokeWidthChange,
  onUndo,
  onRedo,
  onClear,
  onExport,
  canUndo,
  canRedo,
}) => {
  const tools = [
    { id: 'select' as Tool, icon: MousePointer, label: 'Select', color: 'slate' },
    { id: 'pen' as Tool, icon: Pen, label: 'Pen', color: 'blue' },
    { id: 'eraser' as Tool, icon: Eraser, label: 'Eraser', color: 'pink' },
    { id: 'rectangle' as Tool, icon: Square, label: 'Rectangle', color: 'green' },
    { id: 'circle' as Tool, icon: Circle, label: 'Circle', color: 'purple' },
    { id: 'line' as Tool, icon: Minus, label: 'Line', color: 'orange' },
    { id: 'text' as Tool, icon: Type, label: 'Text', color: 'indigo' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-3xl shadow-2xl p-6">
      <div className="flex flex-wrap gap-6 items-center">
        {/* Drawing Tools */}
        <div className="flex gap-3 items-center bg-slate-50 rounded-2xl p-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = currentTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => onToolChange(tool.id)}
                className={`relative p-3 rounded-xl transition-all duration-300 hover:scale-110 group ${
                  isActive
                    ? `bg-${tool.color}-500 text-white shadow-lg shadow-${tool.color}-500/30 scale-105`
                    : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm'
                }`}
                title={tool.label}
              >
                <Icon size={20} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-current rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        <div className="w-px h-12 bg-slate-300"></div>

        {/* Stroke Width */}
        <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-3">
          <span className="text-sm font-semibold text-slate-700">Size</span>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="50"
              value={strokeWidth}
              onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
              className="w-24 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(strokeWidth / 50) * 100}%, #e2e8f0 ${(strokeWidth / 50) * 100}%, #e2e8f0 100%)`
              }}
            />
            <div className="w-8 h-8 bg-white rounded-lg border-2 border-slate-200 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-700">{strokeWidth}</span>
            </div>
          </div>
        </div>

        <div className="w-px h-12 bg-slate-300"></div>

        {/* Color Picker */}
        <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-3">
          <Palette size={20} className="text-slate-700" />
          <div className="flex gap-2">
            {colors.slice(0, 8).map((color) => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={`w-8 h-8 rounded-xl border-3 transition-all duration-200 hover:scale-110 ${
                  currentColor === color 
                    ? 'border-slate-800 shadow-lg scale-110' 
                    : 'border-slate-300 hover:border-slate-400'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            <div className="relative">
              <input
                type="color"
                value={currentColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-8 h-8 rounded-xl border-3 border-slate-300 cursor-pointer opacity-0 absolute inset-0"
              />
              <div 
                className="w-8 h-8 rounded-xl border-3 border-slate-300 hover:border-slate-400 transition-all duration-200 hover:scale-110 flex items-center justify-center"
                style={{ backgroundColor: currentColor }}
              >
                <div className="w-3 h-3 border border-white rounded-full bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-px h-12 bg-slate-300"></div>

        {/* Action Buttons */}
        <div className="flex gap-3 bg-slate-50 rounded-2xl p-3">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-3 rounded-xl transition-all duration-200 ${
              canUndo
                ? 'bg-white text-slate-700 hover:bg-slate-100 hover:scale-110 shadow-sm'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <Undo size={20} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-3 rounded-xl transition-all duration-200 ${
              canRedo
                ? 'bg-white text-slate-700 hover:bg-slate-100 hover:scale-110 shadow-sm'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <Redo size={20} />
          </button>
          <button
            onClick={onClear}
            className="p-3 rounded-xl bg-red-500 text-white hover:bg-red-600 hover:scale-110 transition-all duration-200 shadow-lg shadow-red-500/30"
            title="Clear Canvas"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={onExport}
            className="p-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-110 transition-all duration-200 shadow-lg shadow-emerald-500/30"
            title="Export"
          >
            <Download size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;