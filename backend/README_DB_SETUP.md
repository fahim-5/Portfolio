# Database Setup & File Upload Guide

This guide explains how to set up the MySQL database for your portfolio project and how to use the file upload functionality.

## Database Setup

### Prerequisites
- MySQL Server installed and running
- Node.js and npm installed

### Setting Up the Database

1. Open MySQL command line or a tool like MySQL Workbench
2. Run the SQL script from the `database.sql` file:
```
mysql -u root -p < database.sql
```
Or you can copy and paste the SQL directly into the MySQL client.

3. This will:
   - Create a new database named `portfolio`
   - Set up all required tables (users, projects, skills, education, experience, etc.)
   - Create an initial admin user
   - Create necessary indexes for performance

### Database Configuration

The database connection is configured in `config/db.js`. By default, it connects with these parameters:
- Host: `localhost`
- User: `portfolio`
- Password: `12345678`
- Database: `portfolio`

To change these settings, edit the configuration in `config/db.js`.

## File Upload System

The project includes a complete file upload system for handling images.

### How File Uploads Work

1. Images are uploaded using `multer`, a middleware for handling `multipart/form-data`
2. Files are automatically saved to the `uploads` directory with unique filenames
3. Only image files (JPEG, PNG, GIF, WebP) are allowed
4. Maximum file size is 5MB
5. Images can be accessed via the `/uploads/{filename}` URL

### API Endpoints for File Uploads

The following endpoints are available for file handling:

- **POST /api/upload/image**
  - Uploads a single image file
  - Request must include a file with the field name `image`
  - Returns the file details including path for storage in the database

- **POST /api/upload/images**
  - Uploads multiple image files (max 5)
  - Request must include files with the field name `images[]`
  - Returns an array of file details

- **DELETE /api/upload/:filename**
  - Deletes a previously uploaded file
  - Requires the filename in the URL parameter

- **PUT /api/upload/:table/:id**
  - Updates an image for a specific record in the database
  - Automatically deletes the old image if it exists
  - Required URL parameters:
    - `table`: The database table name
    - `id`: The record ID
  - Request must include a file with the field name `image`

### Example Frontend Usage

Here's an example of how to upload an image from a React component:

```javascript
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await fetch('http://localhost:5000/api/upload/image', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (data.success) {
      // Save the image path in your form or state
      setImagePath(data.file.path);
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Updating Database Records with Images

When creating or updating a record that includes an image, save the relative path returned from the upload API in your database record.

For example, after uploading a project image:

```javascript
// After successful image upload:
const createProject = async (projectData) => {
  try {
    const response = await fetch('http://localhost:5000/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...projectData,
        image: imagePath // Path from the upload response
      }),
    });
    // Handle the response...
  } catch (error) {
    console.error('Failed to create project:', error);
  }
};
``` 