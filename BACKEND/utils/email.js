const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS, 
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}:`, info);
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error response data:', error.response?.data);
  }
}


module.exports = sendEmail;
