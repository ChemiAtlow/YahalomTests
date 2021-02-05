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
                    error: 'bold redBG white',
                    warn: 'bold yellow',
                    info: 'blue',
                    verbose: 'cyan',
                    debug: 'gray',
                },
            }).colorize(
                msg.level,
                `${msg.timestamp} - [${msg.level.toUpperCase()}]: ${msg.message}`
            )
        )
    ),
    transports: [
        new transports.File({
            level: 'verbose',
            filename: 'info.log',
            dirname: logDirectory,
            handleExceptions: true,
            format: combine(uncolorize()),
            maxsize: 5242880,
            maxFiles: 25,
        }),
    ],
    exitOnError: false,
});
if (process.env.NODE_ENV !== "production") {
    appLogger.add( new transports.Console({
        level: 'debug',
        handleExceptions: true,
    }));
}

export const debug = appLogger.debug.bind(appLogger); // level 5
export const verbose =  appLogger.verbose.bind(appLogger); // level 4
export const info = appLogger.info.bind(appLogger); // level 2
export const warn = appLogger.warn.bind(appLogger); // level 1
export const error = appLogger.error.bind(appLogger); // level 0

export class LogStream {
    write(text: string) {
        appLogger.info(text);
    }
}