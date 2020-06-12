const { createLogger, format, transports } = require("winston");
const { PRODUCTION, NODE_ENV, TEST } = require("../config/settings");

const logLevel = () => {
    switch (NODE_ENV) {
        case PRODUCTION:
            return "info";
        case TEST:
            return "no_logging";
        default:
            return "debug";
    }
};

const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
        format.printf((info) => {
            return `[${info.timestamp}] [${info.level.toUpperCase()}] ${
                info.message
            }`;
        })
    ),
    transports: [new transports.Console({ level: logLevel() })]
});

module.exports = logger;