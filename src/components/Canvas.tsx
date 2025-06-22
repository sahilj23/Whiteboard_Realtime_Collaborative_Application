import React, { useRef, useEffect } from 'react';

interface CanvasProps {
  width?: number;
  height?: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  startDrawing: (point: { x: number; y: number }) => void;
  draw: (point: { x: number; y: number }) => void;
  stopDrawing: () => void;
  currentTool: string;
}

const Canvas: React.FC<CanvasProps> = ({ 
  width = 1200, 
  height = 800, 
  canvasRef, 
  startDrawing, 
  draw, 
  stopDrawing, 
  currentTool 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set initial background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }, [width, height, canvasRef]);

  const getCanvasPoint = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const point = getCanvasPoint(e);
    startDrawing(point);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    const point = getCanvasPoint(e);
    draw(point);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    stopDrawing();
  };

  const getCursor = () => {
    switch (currentTool) {
      case 'pen':
        return 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23000\' stroke-width=\'2\'%3E%3Cpath d=\'m12 19 7-7 3 3-7 7-3-3z\'/%3E%3Cpath d=\'m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z\'/%3E%3Cpath d=\'m2 2 7.586 7.586\'/%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'2\'/%3E%3C/svg%3E") 2 22, auto';
      case 'eraser':
        return 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23000\' stroke-width=\'2\'%3E%3Cpath d=\'m7 21-4.3-4.3c-1-1-1-2.5 0-3.5l9.6-9.6c1-1 2.5-1 3.5 0l5.2 5.2c1 1 1 2.5 0 3.5L13 21\'/%3E%3Cpath d=\'M22 21H7\'/%3E%3Cpath d=\'m5 11 9 9\'/%3E%3C/svg%3E") 12 12, auto';
      case 'rectangle':
      case 'circle':
      case 'line':
        return 'crosshair';
      case 'text':
        return 'text';
      case 'select':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center bg-slate-50 rounded-3xl p-6 shadow-inner"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={stopDrawing}
        className="border-2 border-slate-200 rounded-2xl shadow-2xl bg-white"
        style={{ 
          maxWidth: '100%', 
          maxHeight: '100%',
          cursor: getCursor()
        }}
      />
    </div>
  );
};

export default Canvas;