export declare class WheelHandler {
  constructor(
      onWheel: (deltaX: number, deltaY: number) => void,
      handleScrollX?: boolean | ((deltaX: number, deltaY: number) => boolean),
      handleScrollY?: boolean | ((deltaY: number, deltaX: number) => boolean),
      stopPropagation?: boolean | (() => void)
  );
  onWheel(event: WheelEvent): void
  _didWheel(): void
}