import React, { useRef } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import Header from './Header';

const Whiteboard: React.FC = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const {
    canvasRef,
    currentTool,
    setCurrentTool,
    currentColor,
    setCurrentColor,
    strokeWidth,
    setStrokeWidth,
    startDrawing,
    draw,
    stopDrawing,
    undo,
    redo,
    clearCanvas,
    canUndo,
    canRedo,
  } = useCanvas();

  const handleExport = () => {
    // This will be handled by the ExportModal
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <Header
        roomCode="ABC123"
        participantCount={1}
        onCanvasRef={(canvas) => {
          // Handle canvas ref if needed
        }}
      />
      
      <div className="flex-1 flex flex-col gap-6 p-8">
        <Toolbar
          currentTool={currentTool}
          onToolChange={setCurrentTool}
          currentColor={currentColor}
          onColorChange={setCurrentColor}
          strokeWidth={strokeWidth}
          onStrokeWidthChange={setStrokeWidth}
          onUndo={undo}
          onRedo={redo}
          onClear={clearCanvas}
          onExport={handleExport}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        
        <div ref={canvasContainerRef} className="flex-1 min-h-0">
          <Canvas 
            width={1200} 
            height={600}
            canvasRef={canvasRef}
            startDrawing={startDrawing}
            draw={draw}
            stopDrawing={stopDrawing}
            currentTool={currentTool}
          />
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;