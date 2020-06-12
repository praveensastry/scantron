const express = require("express");
const { getScansForHost, createScansForHosts } = require("./controller");
const { handleInvalidHosts, handleInvalidHostRange } = require("../../../middleware");


const router = express.Router();

router.get("/scans", handleInvalidHosts,getScansForHost);
router.post("/scan", handleInvalidHostRange, createScansForHosts);

module.exports = {
    scansRouter: router
}