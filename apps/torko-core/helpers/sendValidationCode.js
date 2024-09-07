const nodemailer = require("nodemailer");
const { generateCode } = require("./generateCode");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASS,
    },
});

// Function to send HTML email
async function sendVerificationEmail(recipientEmail) {
    code = generateCode()
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: "Torko BracU email verification code",
        html: `
      <p>Hi!</p>
      <p>Please enter the following code to verify your account</p>
      <p>
        Password: <strong>${code}</strong>
      </p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <p>
        Best regards, <br />
        Torko Dev team.
      </p>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("HTML email sent:", info.response);
        return code;
    } catch (error) {
        console.error("HTML email sending error:", error);
        return false;
    }
}

module.exports = { sendVerificationEmail };
