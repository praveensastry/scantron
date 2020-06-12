const express = require("express");
const { getFeed } = require("./controller");

const router = express.Router();

router.get("/", getFeed);

module.exports = {
    scanFeedRouter: router
};