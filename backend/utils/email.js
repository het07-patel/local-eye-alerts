
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send OTP email
const sendOtpEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'StreetSense - Your OTP for Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">StreetSense Registration</h2>
          <p>Thank you for registering with StreetSense. To complete your registration, please use the following OTP:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <h1 style="font-size: 36px; margin: 0; color: #333;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p style="margin-top: 20px; color: #777; font-size: 14px;">
            &copy; ${new Date().getFullYear()} StreetSense. All rights reserved.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = { sendOtpEmail };
