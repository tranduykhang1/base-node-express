import { configure, getLogger, Logger } from 'log4js'

configure({
  appenders: {
    console: { type: 'console' },
    stdout: { type: 'stdout' },
    file: {
      type: 'dateFile',
      filename: process.env.LOG_FILE || './log/index.out',
      maxLogSize: parseInt(process.env.LOG_MAX_SIZE || '10000000', 10),
      backups: parseInt(process.env.LOG_BACKUPS || '10', 10)
    }
  },
  categories: {
    default: {
      appenders: ['console', 'file'],
      level: process.env.LOG_LEVEL || 'info'
    },
    errors: {
      appenders: ['file'],
      level: 'error'
    }
  }
})

const LogConfig: Logger = getLogger('Config')
LogConfig.level = 'info'

export default LogConfig
