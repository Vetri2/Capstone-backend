const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
    validateSignupUserDetails,
    validateSigninUserDetails,
} = require("../middlewares/request-validation");
const { requireRole, authenticate } = require("../middlewares/auth");
const { sendJsonResponse } = require("../lib/utils");
const { logger, requestLogger } = require("../lib/logger");

const router = express.Router();
router.use(requestLogger);

function createToken(user) {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 86400,
    });
}

router.post("/signup", validateSignupUserDetails, async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = new User({ email, role, password });
        await user.save();
        const token = createToken(user);
        logger.info(
            `User signed up successfully with email: ${email} and role: ${role}`
        );
        res.status(201).json({ token });
    } catch (err) {
        logger.error(
            `Error signing up user with email: ${req.body.email}. Error: ${err.message}`
        );
        return sendJsonResponse(res, 500, "Server error");
    }
});

router.post("/signin", validateSigninUserDetails, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = createToken(user);
            logger.info(`User signed in successfully with email: ${email}`);
            res.json({ token });
        } else {
            logger.warn(
                `Invalid credentials provided for user with email: ${email}`
            );
            return sendJsonResponse(res, 401, "Invalid credentials");
        }
    } catch (err) {
        logger.error(
            `Error signing in user with email: ${req.body.email}. Error: ${err.message}`
        );
        return sendJsonResponse(res, 500, "Server error");
    }
});

router.post("/signout", authenticate, async (req, res) => {
    try {
        req.user.role = "STUDENT";
        await req.user.save();
        logger.info(`User logout successful: ${req.user.email}`);
        res.json({ message: "Logged out" });
    } catch (err) {
        logger.error(`User logout error: ${err}`);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
