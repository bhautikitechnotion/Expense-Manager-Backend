import moment from 'moment';
import winston, { format } from 'winston';

const { combine, colorize, timestamp, label, printf } = format;

const prodCustomFormat = printf(({ level, message, label, timestamp }) => {
    return `${moment(timestamp)} | [${label}] | ${level}: ${message}`;
});

const transports: any = [
    new winston.transports.File({ filename: 'error.log', level: 'error'}),
    new winston.transports.File({ filename: 'info.log', level: 'info'}),
]

const newTransports = new winston.transports.Console({
    format: combine(
        timestamp(),
        // colorize(),
        prodCustomFormat,
    )
})


export const logger: any = winston.createLogger({
    level: 'info',
    format: combine(
        label({label: 'expense-manager'}),
        timestamp(),
        prodCustomFormat
    ),
    transports: [...transports],
});