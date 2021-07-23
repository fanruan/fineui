export type _EventListener = {
  listen: (target: EventTarget, eventType: string, callback: Function) => { remove: () => void }
  capture: (target: EventTarget, eventType: string, callback: Function) => { remove: () => void }
  registerDefault: () => void
}