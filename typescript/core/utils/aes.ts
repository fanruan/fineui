export type _aes = {
  aesEncrypt: (text: string, key:string) => string
  aesDecrypt: (text: string, key:string) => string
}