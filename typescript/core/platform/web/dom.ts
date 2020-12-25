import { Widget } from "../../../core/widget";


export type _DOM = {
  ready: (fn: Function) => void

  // TODO:  引入jquery描述后处理
  patchProps: (fromElement: any, toElement: any) => void

  hang: (doms: Widget[]) => DocumentFragment
  isExist: (obj: Widget) => boolean
  preloadImages: (srcArray: string[], onload: Function) => void
  getTextSizeWidth: (text: string, fontSize?: number) => number
  getTextSizeHeight: (text: string, fontSize?: number) => number
  getScrollWidth: () => number
  getImage: (param: string, fillStyle?: string, backgroundColor?: string) => { width: number, height: number, src: string, style: string, param: string }
  
  isColor: (color: string) => boolean
  isRGBColor: (color: string) => boolean
  isHexColor: (color: string) => boolean
  isDarkColor: (hex: string) => boolean
  getContrastColor: (color: string) => string
  rgb2hex: (rgbColour: string) => string
  rgb2json: (rgbColour: string) => { r: number, g: number, b: number }
  rgba2json: (rgbColour: string) => { r: number, g: number, b: number, a:number }
  json2rgb: (rgb: { r: number, g: number, b: number }) => string
  json2rgba: (rgba: { r: number, g: number, b: number, a:number }) => string
  int2hex: (strNum: number) => string
  hex2rgb: (color: string) => string
  rgba2rgb: (rgbColor: string, bgColor?:string) => string

  getLeftPosition: (combo: Widget, popup: Widget, extraWidth?: number) => { left: number}
  getInnerLeftPosition: (combo: Widget, popup?: Widget, extraWidth?: number) => { left: number}
  getRightPosition: (combo: Widget, popup?: Widget, extraWidth?: number) => { left: number}
  getInnerRightPosition: (combo: Widget, popup: Widget, extraWidth?: number) => { left: number}
  getTopPosition: (combo: Widget, popup: Widget, extraHeight?: number) => { top: number}
  getBottomPosition: (combo: Widget, popup?: Widget, extraHeight?: number) => { top: number}
  isLeftSpaceEnough: (combo: Widget, popup: Widget, extraWidth?: number) => boolean
  isInnerLeftSpaceEnough: (combo: Widget, popup: Widget, extraWidth?: number) => boolean
  isRightSpaceEnough: (combo: Widget, popup: Widget, extraWidth?: number) => boolean
  isInnerRightSpaceEnough: (combo: Widget, popup: Widget, extraWidth?: number) => boolean
  isTopSpaceEnough: (combo: Widget, popup?: Widget, extraHeight?: number) => boolean
  isBottomSpaceEnough: (combo: Widget, popup?: Widget, extraHeight?: number) => boolean
  isRightSpaceLarger: (combo: Widget) => boolean
  isBottomSpaceLarger: (combo: Widget) => boolean
  getLeftAlignPosition: (combo: Widget, popup: Widget, extraWidth?: number) => { left: number}
  getLeftAdaptPosition: (combo: Widget, popup: Widget, extraWidth?: number) => { left: number}
  getRightAlignPosition: (combo: Widget, popup: Widget, extraWidth?: number) => { left: number}
  getRightAdaptPosition: (combo: Widget, popup: Widget, extraWidth?: number) => { left: number}
  getTopAlignPosition: (combo: Widget, popup: Widget, extraHeight?:number, needAdaptHeight?:boolean) => { top: number, adaptHeight?: number}
  getTopAdaptPosition: (combo: Widget, popup: Widget, extraHeight?:number, needAdaptHeight?:boolean) => { top: number, adaptHeight?: number}
  getBottomAlignPosition: (combo: Widget, popup: Widget, extraHeight?:number, needAdaptHeight?:boolean) => { top: number, adaptHeight?: number}
  getBottomAdaptPosition: (combo: Widget, popup: Widget, extraHeight?:number, needAdaptHeight?:boolean) => { top: number, adaptHeight?: number}
  getCenterAdaptPosition: (combo: Widget, popup: Widget) => { left: number }
  getMiddleAdaptPosition: (combo: Widget, popup: Widget) => { top: number }
  getComboPositionByDirections: (combo: Widget, popup: Widget, extraWidth?:number, extraHeight?:number, needAdaptHeight?:number, directions?:number) => { dir: string, left?: number, top?: number, change?: string}
  getComboPosition: (combo: Widget, popup: Widget, extraWidth?:number, extraHeight?:number, needAdaptHeight?:number, directions?:number) => { dir: string, left?: number, top?: number, change?: string}
}