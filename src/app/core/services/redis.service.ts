import { Redis } from 'ioredis'
import { Nullable } from '../../../common/types/common.type'
import envConfig from '../../../config/env.config'
import { AppLogger } from '../../../config/log.config'

class RedisServices {
  private logger = new AppLogger(RedisServices.name)
  private client: Redis | undefined

  async connect(): Promise<void> {
    try {
      this.client = new Redis({
        port: +envConfig.get('redisPort'),
        host: envConfig.get('redisHost'),
        username: 'default',
        password: envConfig.get('redisPass'),
        db: +envConfig.get('redisDB')
      })
      this.logger.info(`Connected to REDIS DB ${envConfig.get('redisDB')}`)
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

  async clear(): Promise<void> {
    try {
      await this.client!.flushall()
    } catch (err) {
      this.logger.error(`Clear error ${err}`)
      throw err
    }
  }
}

export const redisServices = new RedisServices()
