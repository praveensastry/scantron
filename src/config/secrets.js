const dotenv = require( "dotenv");
const fs = require( "fs");
const { NODE_ENV, TEST, PRODUCTION } = require( "./settings");
const logger = require( "../util/logger");

if (!fs.existsSync(".env")) {
    logger.info("No .env file found, looking for variables in environment.");
}

if (NODE_ENV !== TEST) dotenv.config();

const requiredSecrets = [
    "CORS_REGEX"
];

const missingSecrets = requiredSecrets.filter(s => !process.env[s]);
if (missingSecrets.length > 0) {
    missingSecrets.forEach(ms =>
        logger.error(`Env variable ${ms} is missing.`)
    );
    process.exit(1);
}

const CORS_REGEX = process.env["CORS_REGEX"];

module.exports = {
    CORS_REGEX
}