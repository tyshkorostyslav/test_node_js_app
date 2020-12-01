'use strict'

const { addColors, createLogger, format, transports } = require('winston');

const transportsList = [
  new transports.File({
    filename: __dirname + '/logs/error.log',
    level: 'error',
  }),
  new transports.File({ filename: __dirname + '/logs/combined.log' }),
];

const colorsLogger = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  debug: 'green',
};

addColors(colorsLogger);

transportsList.push(
  new transports.Console({
    colorize: true,
    prettyPrint: true,
    format: format.combine(
      format.colorize(), // see this
      format.printf(
        info => `[${info.timestamp}] ${info.level}: ${info.message}`,
      ),
    ),
  }),
);

const logger = createLogger({
  level: 'info',
  defaultMeta: { service: 'user-service' },
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json()),
  transports: transportsList,
});

module.exports = logger;
