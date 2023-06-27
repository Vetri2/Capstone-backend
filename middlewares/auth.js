const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function authenticate(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "llUnauthorized" });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "kkUnauthorized" });
    }
}

function requireRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}

module.exports = { authenticate, requireRole };
