export type _cache = {
  setUsername: (username: string) => void
  getUsername: () => string
  _getKeyPrefix: () => string
  _generateKey: (key?: string) => void
  getItem: (key?: string) => string
  setItem: (key: string, value: any) => void
  removeItem: (key: string) => void
  clear: () => void
  keys: () => string[]
  addCookie: (name: string, value: any, path?: string, expiresHours?: number) => void
  getCookie: (name: string) => string
  deleteCookie: (name: string, path?: string) => void
}