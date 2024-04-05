import {
  createLogger as createWinstonLogger,
  format,
  transports,
} from 'winston'

const { combine, timestamp, printf } = format

const customFormat = (label: string) =>
  printf(({ level, message, timestamp, stack }) => {
    const stackTrace = stack ? `\n${stack}` : ''
    return `${timestamp} [${label}] ${level}: ${message} ${
      stackTrace ? `\nStacktrace: ${stackTrace}` : ''
    }`
  })

export const createLogger = (label: string) => {
  const logger = createWinstonLogger({
    level: 'info',
    format: combine(
      timestamp(),
      format.errors({ stack: true }),
      format.colorize(),
      customFormat(label)
    ),
    transports: [new transports.Console()],
  })

  return logger
}
