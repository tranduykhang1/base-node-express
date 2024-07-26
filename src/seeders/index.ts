import mongoose from 'mongoose'
import envConfig from '../config/env.config'
import { UserSeeder } from './user.seeder'

class Seeder {
  #seeders = [UserSeeder]

  constructor() {
    this.run()
  }

  async run() {
    if (this.shouldRefresh()) {
      await this.dropAndSeed()
      return
    }
    await this.seed()
  }

  async seed() {
    for (const SeederClass of this.#seeders) {
      const seeder = new SeederClass()
      await seeder.seed()
      console.log(`${SeederClass.name} completed`)
    }

    process.exit(0)
  }

  async dropAndSeed() {
    for await (const SeederClass of this.#seeders) {
      const seeder = new SeederClass()
      await seeder.drop()
      await seeder.seed()
      console.log(`${SeederClass.name} completed`)
    }

    process.exit(0)
  }

  shouldRefresh(): boolean {
    const argv = process.argv
    return argv.includes('-r') || argv.includes('--refresh')
  }
}

const start = async () => {
  try {
    await mongoose.connect(envConfig.get('mongoUri'), {})
    new Seeder()
  } catch (error) {
    console.error('Error connecting to MongoDB', error)
    process.exit(1)
  }
}

start()
