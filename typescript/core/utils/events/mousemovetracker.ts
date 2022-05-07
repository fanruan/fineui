export declare class MouseMoveTracker {
  constructor(...args: any[]);
  captureMouseMoves(event: MouseEvent): void;
  releaseMouseMoves(): void;
  isDragging(): boolean;
  _onMouseMove(event: MouseEvent): void;
  _didMouseMove(): void;
  _onMouseUp(): void;
}