const { hostFeedRouter } = require("../api/v1/hostfeed");
const { scanFeedRouter } = require("../api/v1/scanfeed");
const { scansRouter } = require("../api/v1/scans");

const setupRoutesV1 = (app) => {
    app.use("/api/v1/hostfeed", hostFeedRouter);
    app.use("/api/v1/scanfeed", scanFeedRouter);
    app.use("/api/v1/", scansRouter);
    app.use("/api/v1/", scansRouter);
};

module.exports = {
    setupRoutesV1
}