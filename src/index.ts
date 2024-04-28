import dotenv from 'dotenv'
import ExpressConfig from './config/express.config'
import LogConfig from './config/log.config'

dotenv.config()
LogConfig
const app = ExpressConfig()
const PORT = process.env.PORT || 3030

app.listen(PORT, () => console.log('Server Running on Port:::' + PORT))
