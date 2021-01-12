export declare class CellSizeAndPositionManager {
  _cellSizeGetter: (index: number) => number;
  _cellCount: number;
  _estimatedCellSize: number;
  _cellSizeAndPositionData: object;
  _lastMeasuredIndex: number;

  constructor(cellCount: number, cellSizeGetter: (index: number) => number, estimatedCellSize: number);
  
  configure(cellCount: number, estimatedCellSize: number): void;
  getCellCount(): number;
  getEstimatedCellSize(): number;
  getLastMeasuredIndex(): number;
  getSizeAndPositionOfCell(index: number): { offset: number, size: number};
  getSizeAndPositionOfLastMeasuredCell(): { offset: number, size: number};
  getTotalSize(): number;
  getUpdatedOffsetForIndex(align: string, containerSize:number, currentOffset:number, targetIndex:number): number;
  getVisibleCellRange(containerSize: number, offset: number): { start: number, stop: number};
  resetCell(index: number): void;
  _binarySearch(high: number, low: number, offset: number): number;
  _exponentialSearch(index: number, offset: number): number;
  _findNearestCell(offset: number):number;

}

export declare class ScalingCellSizeAndPositionManager {
  _cellSizeAndPositionManager: CellSizeAndPositionManager;
  _maxScrollSize: number;

  constructor(cellCount: number, cellSizeGetter: (index: number) => number, estimatedCellSize: number, maxScrollSize: number);
  
  configure(): void;
  getCellCount(): number;
  getEstimatedCellSize(): number;
  getLastMeasuredIndex(): number;
  getOffsetAdjustment(containerSize: number, offset: number):number;
  getSizeAndPositionOfCell(index: number): number;
  getSizeAndPositionOfLastMeasuredCell(): number;
  getTotalSize(): number;
  getUpdatedOffsetForIndex(align: number, containerSize: number, currentOffset: number, targetIndex: number): number;
  getVisibleCellRange(containerSize: number, offset: number): { start: number, stop: number};
  resetCell(index: number): void;
  _getOffsetPercentage(containerSize: number, offset: number, totalSize: number): number;
  _offsetToSafeOffset(containerSize: number, offset: number): number;
  _safeOffsetToOffset(containerSize: number, offset: number): number;

}