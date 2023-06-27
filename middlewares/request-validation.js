function validateSignupUserDetails(req, res, next) {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ message: "Invalid request" });
    }
    next();
}

function validateSigninUserDetails(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Invalid request" });
    }
    next();
}

module.exports = { validateSignupUserDetails, validateSigninUserDetails };
