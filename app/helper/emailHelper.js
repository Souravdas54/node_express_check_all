const emailValidate = require('nodemailer')
const OTP = require('../model/otpModel')

const transporter = emailValidate.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendOtpEmail = async (email, user) => {

    try {
        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Remove any existing OTP for this user
        await OTP.deleteMany({ userId: user._id });

        // Save OTP in database with expiry
        await new OTP({
            userId: user._id,
            otp: otp
        }).save();

        const emailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your otp verification code",
            html: ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">OTP Verification</h2>
          <p>Dear ${user.name},</p>
          <p>Your OTP code is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
          <p>This OTP will expire in 1 minute.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>`
        }

        await transporter.sendMail(emailOptions)

        console.log(`OTP sent successfully to ${email}`);

        return true;

        // Return OTP only for development/testing
        // return process.env.NODE_ENV === 'development' ? otp : true;

    } catch (error) {
        console.error('Email sending error:', error)
        return false
    }
}

module.exports = sendOtpEmail 
