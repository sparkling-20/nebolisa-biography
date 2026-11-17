
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { Resend } = require("resend");
const path = require("path");

const helmet = require("helmet");

const app = express();

const PORT = process.env.PORT || 3000;

const resend = new Resend(process.env.RESEND_API_KEY);

app.locals.resend = resend;

app.use(helmet({ contentSecurityPolicy: false }));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Contact API route
app.use("/api/contact", require("./routes/contact"));

// Test route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Portfolio backend is running!"
    });
});

// Centralised error handler
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);


// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    });
    