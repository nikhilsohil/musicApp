import sendMail from "../mail.js";

export const sendOtpMessage = async (to, otp) => {
    const otpMessage = {
        subject: 'Your One-Time Password (OTP) Code 🔒',
        message: `
        <p style="color: #000;">Dear User,</p>

        <p style="color: #000;">Your One-Time Password (OTP) is:

       <strong style="color: #1a73e8; font-size:3rem">${otp}</strong></p>

        <p style="color: #000;">Please use this OTP to proceed with your current action. The code is valid for the next 10 minutes.</p>

        <p style="color: #000;">If you did not request this OTP, please ignore this email or contact our support team for assistance.</p>

        <p style="color: #000;">Thank you for choosing our service!</p>

        <p style="color: #000;">Best regards,<br>
        <strong>The TuneStream Team</strong></p>
        `
    };

    try {
        await sendMail(to, otpMessage.subject, otpMessage.message);
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
};

