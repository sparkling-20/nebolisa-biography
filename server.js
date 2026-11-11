
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

// Protect admin routes
const adminAuth = (req, res, next) => {
    const apiKey = req.headers["x-admin-key"];

    if (apiKey !== process.env.ADMIN_API_KEY) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access."
        });
    }

    next();
};

const PORT = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.locals.transporter = transporter;

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
    