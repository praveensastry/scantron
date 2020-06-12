const logger = require("../util/logger");
const { formatError } = require("../util/error");
const { isvalidHostRange, isvalidHost } = require('../util/validators');

const handleErrors = (
    error,
    _req,
    res,
    _next
) => {
    logger.error(error.stack);
    res.status(500).json(formatError("Server Error"));
};

const handleInvalidHosts = (req, res, next) => {
    const hostIdentifier = req.query.hostIdentifier;
    if (!isvalidHost(hostIdentifier)) {
        res.status(400).json(formatError("Invalid Host Identifier"));
    } else {
        next();
    }
}

const handleInvalidHostRange = (req, res, next) => {
    const { range } = req.body
    if (!isvalidHostRange(range)) {
        res.status(400).json(formatError("Invalid Host range. Range must contain valid hostname / IP Address/ IP Range"));
    } else {
        next();
    }
}

const handleMissing = (_req, res) => {
    res.sendStatus(404);
};

module.exports = {
    handleMissing,
    handleInvalidHostRange,
    handleInvalidHosts,
    handleErrors
}