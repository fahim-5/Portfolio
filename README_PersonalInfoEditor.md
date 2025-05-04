# PersonalInfoEditor Integration with MySQL Database and File Upload

This README explains how the PersonalInfoEditor component has been integrated with a MySQL database and file upload functionality.

## Architecture Overview

The system uses:
1. **MySQL Database**: Stores all user profile data, including personal info, education, skills, etc.
2. **Express.js Backend**: Provides API endpoints to interact with the database
3. **Multer**: Handles file uploads for profile images
4. **React Frontend**: Uses APIs to fetch and update user data

## Database Tables

The database includes the following tables for user profile data:

1. **users**: Basic user information (id, username, email, etc.)
2. **user_profiles**: Extended profile information including bio, location, etc.
3. **user_social_links**: Social media links
4. **user_hero_stats**: Statistics shown in the hero section

## API Endpoints

### Profile Data Endpoints

- `GET /api/profile/:id`: Get user profile
- `PUT /api/profile/:id`: Update user profile
- `POST /api/profile/avatar/:id`: Upload profile image
- `POST /api/profile/about-image/:id`: Upload about section image

### File Upload Endpoints

- `POST /api/upload/image`: Upload a single image
- `POST /api/upload/images`: Upload multiple images
- `DELETE /api/upload/:filename`: Delete an uploaded file

## How It Works

### Data Flow

1. When the PersonalInfoEditor loads, it fetches user profile data from the database
2. The component displays this data to the user
3. When the user makes changes and saves, the data is sent to the database via API
4. When the user uploads images, they're stored in the `uploads` directory and the file paths are stored in the database

### File Upload Implementation

Images are handled through the file upload system:
1. Profile and about images are uploaded using multipart form data
2. Files are saved with unique names using UUID
3. The database stores the relative path to the image file
4. When displaying images, the frontend concatenates the API URL with the relative path

## Frontend Integration

The PersonalInfoEditor component:
1. Uses axios to communicate with the API
2. Maintains its own loading and error states
3. Provides proper feedback to the user through notifications
4. Properly handles image uploads with progress indicators

## How to Run

### 1. Set up the database

Run the database setup script:
```
cd backend
npm run setup-db
```

or for Windows users:
```
cd backend
.\setup-db.ps1
```

### 2. Start the backend server

```
cd backend
npm start
```

### 3. Start the frontend development server

```
cd frontend
npm start
```

## Testing the Integration

1. Navigate to the Admin Dashboard
2. Go to the "Personal Information" section
3. Try updating your information and uploading images
4. Check the database to verify the data is being saved correctly

## Troubleshooting

- If images don't appear, check that the uploads directory exists and has proper permissions
- If you encounter API errors, verify the backend server is running
- If database errors occur, check the database connection settings in the backend 