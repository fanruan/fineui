export type _function = {
  isIE: () => boolean;
  getIEVersion: () => number;
  isEdge: () => boolean;
  isChrome: () => boolean;
  isFireFox: () => boolean;
  isOpera: () => boolean;
  isSafari: () => boolean;
  isMac: () => boolean;
  isWindows: () => boolean;
  isSupportCss3: (style: any) => boolean;
}