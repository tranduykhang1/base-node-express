import dotenv from 'dotenv'
import envConfig from './config/env.config'
import { ExpressConfig } from './config/express.config'
import { AppLogger } from './config/log.config'

dotenv.config()
envConfig.init()

const app = new ExpressConfig().app
const PORT = envConfig.get('port') || 3030
const server = app.listen(PORT, () => new AppLogger('App').info('✨ Server Running on Port:::' + PORT))

export { app, server }
