# Email Setup for Password Reset

To enable email sending for password reset functionality, follow these steps:

## 1. Create a .env file in your backend directory

Create a file named `.env` in the `backend` directory with the following content:

```
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=portfolio

# JWT Secret
JWT_SECRET=your_secret_jwt_key_for_portfolio

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server Port
PORT=5000
```

## 2. Set up Gmail App Password

If you're using Gmail for sending emails, you'll need to create an App Password:

1. Go to your Google Account at https://myaccount.google.com/
2. Select "Security" from the left menu
3. Under "Signing in to Google," select "2-Step Verification" and make sure it's enabled
4. Go back to the Security page and select "App passwords"
5. Create a new app password for "Mail" and "Other (Custom name)" - name it "Portfolio"
6. Copy the generated 16-character password
7. Paste this password as the `EMAIL_PASS` value in your .env file

## 3. Update the Email Address

Replace `your_email@gmail.com` in the .env file with your actual Gmail address.

## 4. Restart the Backend Server

After making these changes, restart your backend server for the changes to take effect.

## Troubleshooting

If emails are not being sent:

1. Check your server logs for any error messages
2. Verify that your Gmail account allows less secure apps or that you're using an App Password
3. Make sure your .env file is in the correct location and has the correct format
4. Test with a different email provider if Gmail continues to have issues
