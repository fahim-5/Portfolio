# Portfolio App - Password Reset Instructions

## Development Mode Instructions

In the development environment, the password reset feature works as follows:

### How to Reset Your Password

1. Navigate to the Admin Login page
2. Click on "Forgot password?"
3. Enter your admin email address and click "Send Verification Code"
4. **IMPORTANT:** The verification code is NOT sent via email in development mode
5. Instead, look at your backend terminal/console where you started the server
6. You will see a message like:
   ```
   ==================================================
   🔑 PASSWORD RESET CODE FOR admin@example.com: 123456
   ==================================================
   ```
7. Copy the 6-digit code from the console
8. Enter this code in the verification form
9. Once verified, you can set your new password

### Setting Up Real Email Sending

To enable actual email sending:

1. Open `backend/controllers/authController.js`
2. Find the commented line: `// await transporter.sendMail(mailOptions);`
3. Uncomment this line
4. Create a `.env` file in your backend directory with the following:

   ```
   EMAIL_USER=your-gmail-address@gmail.com
   EMAIL_PASS=your-app-password
   ```

   Note: For Gmail, you'll need to use an "App Password" rather than your regular password

5. Restart your backend server

## Production Mode

In production, make sure to:

1. Configure proper email credentials
2. Uncomment the email sending code
3. Use environment variables for sensitive information
4. Test the email delivery before deploying
