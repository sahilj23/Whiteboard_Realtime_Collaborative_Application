export interface Point {
  x: number;
  y: number;
}

export interface DrawingPath {
  id: string;
  tool: string;
  points: Point[];
  color: string;
  strokeWidth: number;
  opacity: number;
}

export interface Shape {
  id: string;
  type: 'rectangle' | 'circle' | 'line';
  startPoint: Point;
  endPoint: Point;
  color: string;
  strokeWidth: number;
  opacity: number;
}

export interface TextElement {
  id: string;
  content: string;
  position: Point;
  color: string;
  fontSize: number;
  fontFamily: string;
}

export interface CanvasElement {
  id: string;
  type: 'path' | 'shape' | 'text';
  data: DrawingPath | Shape | TextElement;
  timestamp: number;
}

export interface Room {
  id: string;
  name: string;
  isPrivate: boolean;
  createdAt: Date;
  participants: number;
}

export type Tool = 'pen' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'text' | 'select';

export interface CanvasState {
  elements: CanvasElement[];
  history: CanvasElement[][];
  historyIndex: number;
}