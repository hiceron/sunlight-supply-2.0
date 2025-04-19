import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

// Configure email sender
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const ADMIN_EMAIL = 'sunlightsupplythailand@gmail.com';

export const sendContactNotification = functions.database
  .ref('/contact_submissions/{pushId}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.val();
    const mailOptions = {
      from: `Sunlight Supply Website <${gmailEmail}>`,
      to: ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${data.subject || 'No Subject'}`,
      text: `New contact form submission:\n\nName: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\nMessage: ${data.message}\nTimestamp: ${data.timestamp}`,
    };
    try {
      await mailTransport.sendMail(mailOptions);
      console.log('Contact notification email sent to admin.');
    } catch (error) {
      console.error('Error sending contact notification email:', error);
    }
    return null;
  });
