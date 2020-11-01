import { createLogger, format, transports } from 'winston';

const formatter = format.printf(
  (info) => `[${info.timestamp}][${info.level}] -- ${info.message}`,
);

export const logger = createLogger({
  format: format.combine(format.timestamp(), formatter),
  transports: [
    new transports.Console({
      level: process.env.LOG_LEVEL,
    }),
  ],
});
