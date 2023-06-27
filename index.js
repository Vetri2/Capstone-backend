require("dotenv").config();

// Author : Vetrivel Annadurai
// Project: Event Management - Backend API App

const express = require("express");
const { connectToDatabase } = require("./lib/db");
const routes = require("./routes");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const app = express();
const port = process.env.PORT || 3000;

// Connect to database
connectToDatabase();

// Middleware to parse JSON request body
app.use(express.json());

// Rate limiter middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Content Security Policy middleware
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
        },
    })
);

// Mount routes
app.use("/api", routes);

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`));
