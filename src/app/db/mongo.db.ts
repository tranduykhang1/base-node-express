import mongoose, { Mongoose } from 'mongoose'
import { EnvConfig } from '../../config/env.config'
import { AppLogger } from '../../config/log.config'

export class MongoSetup {
  log = new AppLogger('MongoSetup')

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