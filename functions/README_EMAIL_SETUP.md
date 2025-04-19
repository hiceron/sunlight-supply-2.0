# Email Notification Setup for Contact Form

This project uses a Firebase Cloud Function to send email notifications to `sunlightsupplythailand@gmail.com` when a new contact form submission is added to the Realtime Database.

## Prerequisites
- A Gmail account (already provided: sunlightsupplythailand@gmail.com)
- [Enable 2-Step Verification](https://myaccount.google.com/security) on your Gmail account
- [Generate an App Password](https://support.google.com/accounts/answer/185833?hl=en) for use with the Cloud Function

## Setting up Gmail credentials for Firebase Functions
1. Go to your Firebase Functions directory (usually `functions/`).
2. Use the Firebase CLI to set your Gmail email and app password as environment config variables:
   ```sh
   firebase functions:config:set gmail.email="sunlightsupplythailand@gmail.com" gmail.password="YOUR_APP_PASSWORD"
   ```
   Replace `YOUR_APP_PASSWORD` with the 16-character app password generated in your Google Account settings.
3. Deploy your functions:
   ```sh
   firebase deploy --only functions
   ```

## How it works
- When a new record is added to `/contact_submissions` in the Realtime Database, the `sendContactNotification` function triggers and sends an email to your admin address.

## Testing
- Run tests using Jest or your preferred test runner:
   ```sh
   npm run test
   ```
- Check the `functions/src/__tests__/sendContactNotification.test.ts` file for a sample test.

## Troubleshooting
- Ensure your Gmail account allows app passwords and that the credentials are correct.
- Check Firebase Functions logs for errors:
   ```sh
   firebase functions:log
   ```

---

**Security Note:** Never commit your actual app password or credentials to version control. Always use environment configuration.
