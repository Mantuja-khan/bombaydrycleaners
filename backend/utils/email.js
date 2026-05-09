require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Bombay Dry Cleaners OTP Verification',
        text: `Your OTP for verification is: ${otp}. It will expire in 10 minutes.`,
        html: `<div style="font-family: Arial, sans-serif; text-align: center;">
                 <h2>Bombay Dry Cleaners</h2>
                 <p>Your one-time verification code is:</p>
                 <h1 style="color: #4F46E5;">${otp}</h1>
                 <p>This code will expire in 10 minutes.</p>
               </div>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email}`);
    } catch (err) {
        console.error('Email sending failed. Please check EMAIL_USER and EMAIL_PASS config.', err.message);
    }
};
const sendWelcomeEmail = async (toEmail, name) => {
    const mailOptions = {
        from: `"Bombay Dry Cleaners" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Welcome to Bombay Dry Cleaners!',
        text: `Hi ${name},\n\nWelcome to Bombay Dry Cleaners! We're thrilled to have you.\n\nYour premier garment care journey starts here.\n\nBest,\nBombay Dry Cleaners Team`,
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                 <div style="background-color: #0F172A; padding: 30px; text-align: center;">
                   <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt3AbM85cVzKjBDKpwEqkd388Aj-07rQynKQ&s" alt="Bombay Dry Cleaners Logo" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 2px solid #F8C463; background-color: white; padding: 2px; margin-bottom: 10px;" />
                   <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">Welcome to Bombay Dry Cleaners</h2>
                 </div>
                 <div style="padding: 30px; background-color: #ffffff; color: #333333; line-height: 1.6;">
                   <p style="font-size: 16px; margin-top: 0;">Hi <strong>${name}</strong>,</p>
                   <p style="font-size: 15px;">Thank you for joining <strong>Bombay Dry Cleaners</strong>! We are absolutely thrilled to have you on board with us.</p>
                   <p style="font-size: 15px;">Whether it's your everyday laundry, delicate dry cleaning, or professional steam ironing, we are committed to delivering the highest level of care and freshness directly to your doorstep.</p>
                   <div style="margin: 30px 0; text-align: center;">
                     <a href="https://bombaydrycleaners.com/booking" style="background-color: #F8C463; color: #0F172A; text-decoration: none; padding: 12px 28px; font-weight: bold; border-radius: 30px; font-size: 15px; display: inline-block; box-shadow: 0 4px 6px rgba(248, 196, 99, 0.2);">Book Your First Order</a>
                   </div>
                   <p style="font-size: 14px; color: #666666; border-top: 1px solid #eeeeee; padding-top: 20px; margin-bottom: 0;">
                     Freshness & Care Delivered,<br />
                     <strong>The Bombay Dry Cleaners Team</strong>
                   </p>
                 </div>
                 <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee;">
                   © ${new Date().getFullYear()} Bombay Dry Cleaners. All rights reserved.
                 </div>
               </div>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${toEmail}`);
    } catch (err) {
        console.error('Error sending welcome email:', err);
    }
};

module.exports = { sendOTP, sendWelcomeEmail };
