const express = require("express");
const authRouter = require("./auth");
const eventRouter = require("./events");
const errorHandler = require("../middlewares/error-handler");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/events", eventRouter);

router.use(errorHandler);

module.exports = router;
