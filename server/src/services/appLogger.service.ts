import { join } from 'path';
import { createLogger, transports, format } from 'winston';

const { combine, timestamp, printf, uncolorize, colorize } = format;

const logDirectory = join(__dirname, '../../logs');

// app loger config
export const appLogger = createLogger({
    silent: process.env.NODE_ENV === 'test',
    format: combine(
        timestamp(),
        printf((msg) =>
            colorize({
                colors: {
                    error: 'bold red',
                    debug: 'blue',
                },
            }).colorize(
                msg.level,
                `${msg.timestamp} - [${msg.level.toUpperCase()}]: ${msg.message}`
            )
        )
    ),
    transports: [
        new transports.File({
            level: 'info',
            filename: 'info.log',
            dirname: logDirectory,
            handleExceptions: true,
            format: combine(uncolorize()),
            maxsize: 5242880,
            maxFiles: 25,
        }),
        new transports.Console({
            level: 'error',
            handleExceptions: true,
        }),
        new transports.Console({
            level: 'warn',
            handleExceptions: true,
        }),
        new transports.Console({
            level: 'debug',
            handleExceptions: true,
        }),
    ],
    exitOnError: false,
});

export const info = appLogger.info.bind(appLogger);
export const debug = appLogger.debug.bind(appLogger);
export const warn = appLogger.warn.bind(appLogger);
export const error = appLogger.error.bind(appLogger);

export class LogStream {
    write(text: string) {
        appLogger.info(text);
    }
}