import sendMail from "../mail.js";

export const sendWelcomeMessage = async (to, name) => {
    const welcome = {
        subject: 'Welcome to TuneStream! 🎶',
        message: `
        <p style="color: #000;">Dear <strong>${name}</strong>,</p>

        <p style="color: #000;">Welcome to <strong>TuneStream</strong>!</p>

        <p style="color: #000;">We're thrilled to have you as part of our community of music lovers. Your journey to endless tunes and exciting discoveries starts now.</p>

        <p style="color: #000;">With TuneStream, you can:</p>
        <ul style="color: #000;">
            <li>Explore and stream your favorite music.</li>
            <li>Create personalized playlists.</li>
            <li>Discover new tracks and artists that resonate with you.</li>
        </ul>

        <p style="color: #000;">We're here to make sure your experience is nothing short of amazing. If you have any questions or need assistance, feel free to reach out to us anytime.</p>

        <p style="color: #000;">Let’s make every moment a musical one! 🎧</p>

        <p style="color: #000;">Happy streaming!<br>
        <strong>The TuneStream Team</strong></p>

        <p style="color: #000;"><em>P.S. Stay tuned for exciting updates and features coming your way.</em></p>
        `
    };

    try {
        await sendMail(to, welcome.subject, welcome.message);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

