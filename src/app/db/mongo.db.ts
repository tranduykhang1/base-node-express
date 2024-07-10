import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { Mongoose } from 'mongoose'
import envConfig from '../../config/env.config'
import { AppLogger } from '../../config/log.config'

class MongoSetup {
  log = new AppLogger('MongoSetup')
  private mongoServer: MongoMemoryServer | undefined
  public conn: Mongoose

  async connect(): Promise<Mongoose | undefined> {
    if (envConfig.get('isTestEnv') === 'true') {
      await this.connectForTesting()
      return
    }
    return await this.connectForUse()
  }

  async connectForUse(): Promise<Mongoose | undefined> {
    try {
      this.conn = await mongoose.connect(envConfig.get('mongoUri'))
      this.log.info('Connected to MongoDB')
      return this.conn
    } catch (err) {
      this.log.error(err)
      return
    }
  }

  async startSession(): Promise<mongoose.ClientSession> {
    return this.conn.startSession()
  }

  async connectForTesting(): Promise<void> {
    try {
      this.mongoServer = await MongoMemoryServer.create()
      const mongoUri = await this.mongoServer.getUri()
      await mongoose.connect(mongoUri)
      this.log.info('Connected to the Testing MongoDB')
    } catch (err) {
      this.log.error(err)
      return
    }
  }

  async close(): Promise<void> {
    await mongoose.disconnect()
    if (this.mongoServer) {
      await this.mongoServer!.stop()
    }
  }

  async clear(): Promise<void> {
    const collections = mongoose.connection.collections

    for (const key in collections) {
      await collections[key].deleteMany()
    }
  }
}

export const mongoSetup = new MongoSetup()
