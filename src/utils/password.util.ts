import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'
import envConfig from '../config/env.config'

const algorithm = 'aes-256-cbc'

const encryptionIV = createHash('sha512')
  .update(envConfig.get('accountSecret') || 'default_pw_secret')
  .digest('hex')
  .substring(0, 16)

export class Password {
  static encrypt(text: string): { key: string; encryptedData: string } {
    const key = randomBytes(16).toString('hex')
    const cipher = createCipheriv(algorithm, key, encryptionIV)
    return {
      key: key,
      encryptedData: Buffer.from(cipher.update(text, 'utf8', 'hex') + cipher.final('hex')).toString('base64')
    }
  }

  static decrypt(key: string, encryptedData: string): string {
    const buff = Buffer.from(encryptedData, 'base64')
    const decipher = createDecipheriv(algorithm, key, encryptionIV)
    return decipher.update(buff.toString('utf8'), 'hex', 'utf8') + decipher.final('utf8')
  }

  static compare(encryptedData: string, key: string, providePassword: string): boolean {
    const buff = Buffer.from(encryptedData, 'base64')
    const decipher = createDecipheriv(algorithm, key, encryptionIV)
    const res = decipher.update(buff.toString('utf8'), 'hex', 'utf8') + decipher.final('utf8')
    return res === providePassword
  }
}
