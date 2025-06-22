import { useRef, useCallback, useState, useEffect } from 'react';
import { Point, DrawingPath, Shape, TextElement, CanvasElement, Tool, CanvasState } from '../types';
import { generateId } from '../utils/helpers';

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>('pen');
  const [currentColor, setCurrentColor] = useState('#2563EB');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    elements: [],
    history: [[]],
    historyIndex: 0,
  });

  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [previewElement, setPreviewElement] = useState<CanvasElement | null>(null);

  const addToHistory = useCallback((newElements: CanvasElement[]) => {
    setCanvasState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push([...newElements]);
      
      return {
        elements: newElements,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const startDrawing = useCallback((point: Point) => {
    console.log('Starting to draw with tool:', currentTool, 'color:', currentColor);
    setIsDrawing(true);
    setStartPoint(point);

    if (currentTool === 'pen' || currentTool === 'eraser') {
      setCurrentPath([point]);
    } else if (['rectangle', 'circle', 'line'].includes(currentTool)) {
      // Create preview element for shapes
      const previewId = generateId();
      const shapeData: Shape = {
        id: previewId,
        type: currentTool as 'rectangle' | 'circle' | 'line',
        startPoint: point,
        endPoint: point,
        color: currentColor,
        strokeWidth,
        opacity: 0.7,
      };
      
      setPreviewElement({
        id: previewId,
        type: 'shape',
        data: shapeData,
        timestamp: Date.now(),
      });
    }
  }, [currentTool, currentColor, strokeWidth]);

  const draw = useCallback((point: Point) => {
    if (!isDrawing || !startPoint) return;

    if (currentTool === 'pen' || currentTool === 'eraser') {
      setCurrentPath(prev => [...prev, point]);
    } else if (['rectangle', 'circle', 'line'].includes(currentTool) && previewElement) {
      // Update preview element
      const updatedShape = {
        ...previewElement.data as Shape,
        endPoint: point,
      };
      
      setPreviewElement({
        ...previewElement,
        data: updatedShape,
      });
    }
  }, [isDrawing, startPoint, currentTool, previewElement]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing || !startPoint) return;

    console.log('Stopping drawing with tool:', currentTool, 'color:', currentColor);
    let newElement: CanvasElement | null = null;

    if (currentTool === 'pen' || currentTool === 'eraser') {
      if (currentPath.length > 1) {
        const pathData: DrawingPath = {
          id: generateId(),
          tool: currentTool,
          points: currentPath,
          color: currentTool === 'eraser' ? '#FFFFFF' : currentColor,
          strokeWidth: currentTool === 'eraser' ? strokeWidth * 2 : strokeWidth,
          opacity: 1,
        };
        
        newElement = {
          id: pathData.id,
          type: 'path',
          data: pathData,
          timestamp: Date.now(),
        };
        console.log('Created path element:', newElement);
      }
    } else if (['rectangle', 'circle', 'line'].includes(currentTool) && previewElement) {
      // Finalize the shape
      const finalShape = {
        ...previewElement.data as Shape,
        opacity: 1,
      };
      
      newElement = {
        ...previewElement,
        data: finalShape,
      };
      console.log('Created shape element:', newElement);
    }

    if (newElement) {
      const newElements = [...canvasState.elements, newElement];
      addToHistory(newElements);
    }

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPath([]);
    setPreviewElement(null);
  }, [isDrawing, startPoint, currentPath, currentTool, currentColor, strokeWidth, canvasState.elements, addToHistory, previewElement]);

  const undo = useCallback(() => {
    setCanvasState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        return {
          ...prev,
          elements: prev.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setCanvasState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        return {
          ...prev,
          elements: prev.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);

  const clearCanvas = useCallback(() => {
    addToHistory([]);
  }, [addToHistory]);

  const drawElement = useCallback((ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    if (element.type === 'path') {
      const path = element.data as DrawingPath;
      if (path.points.length < 2) return;

      ctx.save();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = path.opacity;
      ctx.globalCompositeOperation = path.tool === 'eraser' ? 'destination-out' : 'source-over';

      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    } else if (element.type === 'shape') {
      const shape = element.data as Shape;
      ctx.save();
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = shape.strokeWidth;
      ctx.globalAlpha = shape.opacity;
      ctx.globalCompositeOperation = 'source-over';

      const width = shape.endPoint.x - shape.startPoint.x;
      const height = shape.endPoint.y - shape.startPoint.y;

      ctx.beginPath();
      if (shape.type === 'rectangle') {
        ctx.rect(shape.startPoint.x, shape.startPoint.y, width, height);
      } else if (shape.type === 'circle') {
        const centerX = shape.startPoint.x + width / 2;
        const centerY = shape.startPoint.y + height / 2;
        const radius = Math.sqrt(width * width + height * height) / 2;
        ctx.arc(centerX, centerY, Math.abs(radius), 0, 2 * Math.PI);
      } else if (shape.type === 'line') {
        ctx.moveTo(shape.startPoint.x, shape.startPoint.y);
        ctx.lineTo(shape.endPoint.x, shape.endPoint.y);
      }
      ctx.stroke();
      ctx.restore();
    }
  }, []);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and set background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all elements
    canvasState.elements.forEach(element => {
      drawElement(ctx, element);
    });

    // Draw current path while drawing
    if (isDrawing && (currentTool === 'pen' || currentTool === 'eraser') && currentPath.length > 1) {
      ctx.save();
      ctx.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
      ctx.lineWidth = currentTool === 'eraser' ? strokeWidth * 2 : strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over';

      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Draw preview element
    if (previewElement) {
      drawElement(ctx, previewElement);
    }
  }, [canvasState.elements, isDrawing, currentPath, currentTool, currentColor, strokeWidth, previewElement, drawElement]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Debug effect to log state changes
  useEffect(() => {
    console.log('Canvas state updated:', {
      currentTool,
      currentColor,
      strokeWidth,
      elementsCount: canvasState.elements.length
    });
  }, [currentTool, currentColor, strokeWidth, canvasState.elements.length]);

  return {
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
    canUndo: canvasState.historyIndex > 0,
    canRedo: canvasState.historyIndex < canvasState.history.length - 1,
  };
};