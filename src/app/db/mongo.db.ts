import log4js, { Logger } from 'log4js'
import mongoose, { Mongoose } from 'mongoose'
import { EnvConfig } from '../../config/env.config'

export class MongoSetup {
  private readonly log: Logger = log4js.getLogger(MongoSetup.name)

  async connect(): Promise<Mongoose | undefined> {
    try {
      const conn = await mongoose.connect(EnvConfig.mongoUri)
      this.log.info('Connected to MongoDB')
      return conn
    } catch (err) {
      this.log.error(err)
      return
    }
  }
}
