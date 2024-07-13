import { MongoMemoryReplSet, MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { Mongoose } from 'mongoose'
import envConfig from '../../config/env.config'
import { AppLogger } from '../../config/log.config'

class MongoSetup {
  log = new AppLogger('MongoSetup')
  private mongoServer: MongoMemoryServer | undefined
  public conn: Mongoose
  private repliset: MongoMemoryReplSet

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
    if (!this.conn) {
      await this.connectForTesting()
    }
    return this.conn.startSession()
  }

  async connectForTesting(): Promise<void> {
    try {
      this.repliset = await MongoMemoryReplSet.create({ replSet: { count: 2 } })
      const mongoUri = this.repliset.getUri()
      this.conn = await mongoose.connect(mongoUri)
      this.log.info('Connected to the Testing MongoDB')
    } catch (err) {
      this.log.error(err)
      return
    }
  }

  async close(): Promise<void> {
    await mongoose.disconnect()
    if (this.mongoServer) {
      await this.repliset!.stop()
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
