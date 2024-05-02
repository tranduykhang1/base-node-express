import dotenv from 'dotenv'
import envConfig from './config/env.config'
import ExpressConfig from './config/express.config'
import { AppLogger } from './config/log.config'

dotenv.config()
envConfig.init()

const app = ExpressConfig()
const PORT = envConfig.get('port') || 3030

app.listen(PORT, () => new AppLogger('App').info('Server Running on Port:::' + PORT))
