const express = require('express')
const { setupExpress } = require("./config/express");
const { handleMissing, handleErrors } = require("./middleware");
const { setupRoutesV1 } = require("./config/routes");

const app = express();

setupExpress(app);
setupRoutesV1(app);

app.use(handleMissing);
app.use(handleErrors);

module.exports = app;
