const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/contact');

router.get('/', (req, res) => {
    res.render('contact', { title: 'Contact Us' });
});
// POST /contact
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'All fields are required' 
            });
        }

        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();

        // Send email notification (optional)
        await sendEmailNotification(name, email, subject, message);

        res.json({ 
            success: true,
            message: 'Message received successfully!'
        });
    } catch (err) {
        console.error('Error saving contact:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to save message' 
        });
    }
});

// Email notification function
async function sendEmailNotification(name, email, subject, message) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New Contact Form: ${subject}`,
            text: `
                Name: ${name}
                Email: ${email}
                Subject: ${subject}
                Message: ${message}
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (emailErr) {
        console.error('Error sending email notification:', emailErr);
    }
}

module.exports = router;