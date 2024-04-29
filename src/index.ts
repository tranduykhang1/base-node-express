import dotenv from 'dotenv'
import { EnvConfig } from './config/env.config'
import ExpressConfig from './config/express.config'
import { AppLogger } from './config/log.config'

dotenv.config()

const app = ExpressConfig()
const PORT = EnvConfig.port || 3030

app.listen(PORT, () => new AppLogger('App').info('Server Running on Port:::' + PORT))
