export declare class Section {
  height: number;
  width: number;
  x: number;
  y: number;
  constructor(height: number, width: number, x: number, y: number);
  addCellIndex(index: any): void;
  getCellIndices(): any[];
  getSections(height: number, width: number, x: number, y: number): Section[];
  getTotalSectionCount(): number;
  registerCell(cellMetadatum: { height: number, width: number, x: number, y: number }, index: any): void;
}