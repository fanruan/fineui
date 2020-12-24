import { Widget } from "typescript/core/widget";

export type _DetectElementResize = {
  addResizeListener: (widget: Widget, fn: Function) => Function
  removeResizeListener: (widget: Widget, fn: Function) => void
}