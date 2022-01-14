import { createLogger as createWinstonLogger, transports, format, Logger } from 'winston'

export const createLogger = (label = '*'): Logger =>
  createWinstonLogger({
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      format.label({ label }),
      format.printf(
        (lgr) =>
          `${lgr.timestamp} - ${lgr.level} - [${lgr.label}]: ${lgr.message}`,
      ),
    ),
    transports: [
      new transports.Console({ level: process.env.LOG_LEVEL || 'http' }),
    ],
  })
