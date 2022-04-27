export type _msg = {
  alert: (title: string, message?: string | {[key: string]: any}, callback?: (result?: boolean)=>void) => void
  confirm: (title: string, message?: string | {[key: string]: any}, callback?: (result: boolean)=>void) => void
  prompt: (title: string, message?: string, value?: any, callback?: (result: string) => void, minWidth?: number) => void
  toast: (message: string, options?: object, context?: HTMLElement) => void
}
