
const express = require("express");
const router = express.Router();

const Message = require("../models/Message");

// Admin authentication
const adminAuth = (req, res, next) => {
    const apiKey = req.headers["x-admin-key"];

    if (!process.env.ADMIN_API_KEY || apiKey !== process.env.ADMIN_API_KEY) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access."
        });
    }

    next();
};

// CREATE: Save a new contact message
router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });
        }

        // Save message to MongoDB
        const newMessage = await Message.create({
            name,
            email,
            subject,
            message
        });

        // Send email notification using Resend
try {
    const result = await req.app.locals.resend.emails.send({
        from: "Portfolio <onboarding@resend.dev>",
        to: [process.env.EMAIL_USER],
        replyTo: email,
        subject: `New Portfolio Message: ${subject}`,
        text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
        `
    });

    if (result.error) {
        console.error("Email notification failed:", result.error);
    } else {
        console.log("Email notification sent successfully!");
    }

} catch (emailError) {
    console.error("Email notification failed:", emailError.message);
}

        res.status(201).json({
            success: true,
            message: "Your message has been received!",
            data: newMessage
        });

    } catch (error) {
        console.error("Contact error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to send your message."
        });
    }
});

module.exports = router;

// UPDATE: Mark a contact message as read or unread
router.patch("/:id", adminAuth, async (req, res) => {
    try {
        const { status } = req.body;

        if (!["read", "unread"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be read or unread."
            });
        }

        const updatedMessage = await Message.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({
                success: false,
                message: "Message not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Message status updated successfully.",
            data: updatedMessage
        });

    } catch (error) {
        console.error("Update message error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update message."
        });
    }
});

// DELETE: Remove a contact message (Admin only)
router.delete("/:id", adminAuth, async (req, res) => {
    try {
        const deletedMessage = await Message.findByIdAndDelete(
            req.params.id
        );

        if (!deletedMessage) {
            return res.status(404).json({
                success: false,
                message: "Message not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact message deleted successfully."
        });

    } catch (error) {
        console.error("Delete message error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to delete message."
        });
    }
});

// READ: Get all contact messages (Admin only)
router.get("/", adminAuth, async (req, res) => {
    try {
        const messages = await Message.find().sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });

    } catch (error) {
        console.error("Read messages error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve messages."
        });
    }
});