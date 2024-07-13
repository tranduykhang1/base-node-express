import * as fs from 'fs'
import * as path from 'path'
import { Logger, createLogger, format, transports } from 'winston'

const { combine, timestamp } = format

const dir = 'logs'

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

const currentDate = new Date()
const year = currentDate.getFullYear()
const month = String(currentDate.getMonth() + 1).padStart(2, '0')
const day = String(currentDate.getDate()).padStart(2, '0')

const formattedDate = `${year}-${month}-${day}`

// Logger options
const options = {
  error: {
    level: 'error',
    filename: path.join(dir, `error-${formattedDate}.log`),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m'
  },
  combine: {
    level: 'verbose',
    filename: path.join(dir, `info-${formattedDate}.log`),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m'
  }
}

export class AppLogger {
  logger: Logger
  name: string
  constructor(name: string) {
    const customFormat = format.printf(({ timestamp, level, message, stack }): string => {
      let logMessage = `[${name}]::: ${timestamp} - [${level.toUpperCase()}] - ${message}`

      if (stack) {
        logMessage += `\n${stack}`
      }

      return logMessage
    })

    this.logger = createLogger({
      format: format.combine(format.timestamp(), format.errors({ stack: true }), customFormat),
      transports: [
        new transports.Console(),
        new transports.File({
          ...options.error,
          format: combine(timestamp(), format.json())
        }),
        new transports.File({
          ...options.combine,
          format: combine(timestamp(), format.json())
        })
      ]
    })

    this.name = name
  }

  info(message: string | object | unknown) {
    this.logger.info(`[${this.name}]:::: ${JSON.stringify(message)}`)
  }

  error(message: string | object | unknown) {
    this.logger.error(`[${this.name}]:::: ${JSON.stringify(message)}`)
  }

  debug(message: string | object | unknown) {
    this.logger.debug(`[${this.name}]:::: ${JSON.stringify(message)}`)
  }

  warn(message: string | object | unknown) {
    this.logger.warn(`[${this.name}]:::: ${JSON.stringify(message)}`)
  }
}
