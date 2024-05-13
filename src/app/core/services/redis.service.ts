import { Redis } from 'ioredis'
import { Nullable } from '../../../common/types/common.type'
import envConfig from '../../../config/env.config'
import { AppLogger } from '../../../config/log.config'

export class RedisServices {
  private logger = new AppLogger(RedisServices.name)
  private client: Redis | undefined

  async connect(): Promise<void> {
    try {
      this.client = new Redis({
        port: +envConfig.get('redisPort'),
        host: envConfig.get('redisHost'),
        username: 'default',
        password: envConfig.get('redisPass')
      })
      this.logger.info(`Connected to REDIS`)
    } catch (err) {
      this.logger.error(`Cannot connect to redis: ${err}`)
    }
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    try {
      await this.client!.set(key, JSON.stringify(value), 'EX', ttl)
      return
    } catch (err) {
      this.logger.error(`Set error: ${err}`)
      throw err
    }
  }

  async get<T>(key: string): Promise<Nullable<T>> {
    try {
      const result = await this.client!.get(key)
      if (result) {
        return JSON.parse(result)
      }
      return null
    } catch (err) {
      this.logger.error(`Get error: ${err}`)
      throw err
    }
  }
}