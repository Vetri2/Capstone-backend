const winston = require("winston");

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.printf(
                    (info) =>
                        `[${info.timestamp}] [${info.level}] [${info.message}] [${info.origin}]`
                )
            ),
        }),
        new winston.transports.File({
            filename: "logs/app.log",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),
    ],
});

const requestLogger = (req, res, next) => {
    logger.info("Incoming request", {
        method: req.method,
        url: req.url,
        headers: req.headers,
    });
    next();
};

module.exports = {
    logger,
    requestLogger,
};
