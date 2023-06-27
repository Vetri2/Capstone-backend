function sendJsonResponse(res, status, message) {
    res.status(status).json({ message });
}

module.exports = { sendJsonResponse };
