import { Redis, RedisOptions } from 'ioredis'
import { Nullable, Optional } from '../../../common/types/common.type'
import envConfig from '../../../config/env.config'
import { AppLogger } from '../../../config/log.config'

class RedisServices {
  #logger = new AppLogger(RedisServices.name)
  #client: Optional<Redis>

  #_connectOpts = {
    port: +envConfig.get('redisPort'),
    host: envConfig.get('redisHost'),
    username: 'default',
    password: envConfig.get('redisPass'),
    db: +envConfig.get('redisDB')
  }

  async connect(): Promise<void> {
    try {
      this.#client = new Redis(this.#_connectOpts)
      this.#logger.info(`Connected to REDIS DB ${envConfig.get('redisDB')}`)
    } catch (err) {
      this.#logger.error(`✨ Cannot connect to redis: ${err}`)
    }
  }

  get connectOpts(): RedisOptions {
    return this.#_connectOpts
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    try {
      await this.#client!.set(key, JSON.stringify(value), 'EX', ttl)
      return
    } catch (err) {
      this.#logger.error(`Set error: ${err}`)
      throw err
    }
  }

  async get<T>(key: string): Promise<Nullable<T>> {
    try {
      const result = await this.#client!.get(key)
      if (result) {
        return JSON.parse(result)
      }
      return null
    } catch (err) {
      this.#logger.error(`Get error: ${err}`)
      throw err
    }
  }

  async clear(): Promise<void> {
    try {
      await this.#client!.flushall()
    } catch (err) {
      this.#logger.error(`Clear error ${err}`)
      throw err
    }
  }
}

export const redisServices = new RedisServices()
