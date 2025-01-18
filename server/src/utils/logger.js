import fs from 'fs';
import path from 'path';
import pino from 'pino';
import pretty from 'pino-pretty';

const logDir = path.join(process.cwd(), 'logs');

fs.existsSync(logDir) || fs.mkdirSync(logDir);

// Using pino to log all requests
const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), {
    flags: 'a',
});
const errorLogStream = fs.createWriteStream(path.join(logDir, 'error.log'), {
    flags: 'a',
});

// Stream for prettier logging (stdout)
const prettyStream = pretty({ colorize: true });

// Separate loggers for access and error logs
const accessLogger = pino(
    { level: 'info' },
    pino.multistream([{ stream: prettyStream }, { stream: accessLogStream }]),
);

const errorLogger = pino(
    { level: 'error' },
    pino.multistream([{ stream: prettyStream }, { stream: errorLogStream }]),
);

// Custom middleware to log access logs using pino
const accessLogMiddleware = (req, res, next) => {
    const { method, url, headers } = req;
    const startTime = Date.now();
    const ip = headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Listen for when the response is finished to log the status and response time
    res.on('finish', () => {
        const elapsedTime = Date.now() - startTime;
        const { statusCode } = res;
        accessLogger.info({
            method: method,
            url: url,
            statusCode: statusCode,
            ip: ip,
            elapsedTime: elapsedTime + 'ms',
        });
    });
    next();
};

// Error handling middleware using pino
// Need to pass all 4 parameters to make express recognize it as an error handling middleware
// eslint-disable-next-line no-unused-vars
const errorLogMiddleware = (err, req, res, next) => {
    const { method, url, headers } = req;
    const startTime = Date.now();
    const ip = headers['x-forwarded-for'] || req.connection.remoteAddress;

    res.status(500);

    res.on('finish', () => {
        const elapsedTime = Date.now() - startTime;
        const { statusCode } = res;
        errorLogger.error({
            method: method,
            url: url,
            statusCode: statusCode,
            ip: ip,
            elapsedTime: elapsedTime + 'ms',
            error: err.message,
            stack: err.stack,
        });
    });

    res.send('Internal server error');
};

export { accessLogMiddleware, errorLogMiddleware };
