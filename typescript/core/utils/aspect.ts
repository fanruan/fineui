export type _aspect = {
  before: (target: object, methodName: string, advice: Function) => { advice: Function, index: number, remove: () => void}
  after: (target: object, methodName: string, advice: Function) => { advice: Function, index: number, remove: () => void}
}