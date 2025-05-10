/**
 * Handle file uploads to Cloudinary
 */
const HandleUpload = async (event) => {
    try {
        const file = event.target.files[0];
        if (!file) {
            console.error('No file selected for upload');
            return { error: 'No file selected' };
        }
        
        console.log('File to upload:', {
            name: file.name,
            type: file.type,
            size: `${(file.size / 1024).toFixed(2)} KB`
        });
        
        // Validate file type and size
        if (!file.type.startsWith('image/')) {
            console.error('File is not an image:', file.type);
            return { error: 'Only image files are allowed' };
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            console.error('File is too large:', file.size);
            return { error: 'Image is too large (max 10MB)' };
        }
        
        // Create form data for upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'Portfolio-picture');
        formData.append('cloud_name', 'do1vi5vfa');
        
        // Make the upload request
        const response = await fetch('https://api.cloudinary.com/v1_1/do1vi5vfa/image/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Cloudinary upload error:', errorText);
            return { error: `Upload failed: ${response.status} ${response.statusText}` };
        }
        
        // Parse response data
        const data = await response.json();
        console.log('Cloudinary upload successful:', data.secure_url);
        
        return data;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return { error: 'Upload failed: ' + error.message };
    }
};

/**
 * Directly download an image from URL and then upload it to Cloudinary
 * This helps bypass CORS issues by handling the file download on the client
 */
const downloadAndUpload = async (imageUrl) => {
    try {
        console.log('Attempting to download and upload image:', imageUrl);
        
        // Create a temporary link to download the image
        const link = document.createElement('a');
        link.href = imageUrl;
        
        // Extract filename from URL or generate a random one
        let filename = 'image';
        try {
            const url = new URL(imageUrl);
            const pathname = url.pathname;
            const lastSegment = pathname.split('/').pop();
            if (lastSegment && lastSegment.includes('.')) {
                filename = lastSegment;
            } else {
                filename = `image_${Date.now()}.jpg`;
            }
        } catch (e) {
            console.error('Error parsing URL:', e);
            filename = `image_${Date.now()}.jpg`;
        }
        
        link.download = filename;
        
        // For CORS restricted images, we need to try a different approach
        try {
            // Fetch the image and convert to blob
            const response = await fetch(imageUrl, { mode: 'cors' });
            if (!response.ok) {
                console.error('Failed to fetch image:', response.status);
                return null;
            }
            
            const blob = await response.blob();
            
            // Create a File object from the blob
            const imageFile = new File([blob], filename, { type: blob.type });
            
            // Create form data for upload
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('upload_preset', 'Portfolio-picture');
            formData.append('cloud_name', 'do1vi5vfa');
            
            // Upload the file to Cloudinary
            const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/do1vi5vfa/image/upload', {
                method: 'POST',
                body: formData
            });
            
            if (!uploadResponse.ok) {
                console.error('Failed to upload downloaded image:', uploadResponse.status);
                return null;
            }
            
            const data = await uploadResponse.json();
            console.log('Downloaded and uploaded successfully:', data.secure_url);
            
            return {
                secure_url: data.secure_url,
                url: data.url,
                resource_type: data.resource_type,
                public_id: data.public_id,
                format: data.format,
                source: 'download_and_upload'
            };
        } catch (fetchError) {
            console.error('Error in fetch and upload:', fetchError);
            return null;
        }
    } catch (error) {
        console.error('Error in download and upload:', error);
        return null;
    }
};

/**
 * Enhanced URL upload function that tries multiple approaches
 */
const UploadFromUrl = async (imageUrl) => {
    try {
        console.log('Starting URL upload to Cloudinary:', imageUrl);
        
        if (!imageUrl || !imageUrl.trim()) {
            return { error: 'No URL provided' };
        }
        
        // Store the original URL
        const originalUrl = imageUrl;
        
        // For Unsplash URLs
        if (imageUrl.includes('unsplash.com')) {
            // Try to directly fetch the image from Unsplash using their API format
            try {
                const unsplashId = extractUnsplashId(imageUrl);
                if (unsplashId) {
                    // Construct a direct download URL
                    imageUrl = `https://unsplash.com/photos/${unsplashId}/download?force=true`;
                    console.log('Converted Unsplash URL to download URL:', imageUrl);
                }
            } catch (error) {
                console.log('Error processing Unsplash URL:', error);
            }
        }
        
        // Try all possible approaches in sequence
        
        // 1. Try direct upload
        try {
            console.log('Trying direct upload approach...');
            const directResult = await directUpload(imageUrl);
            if (directResult && directResult.secure_url) {
                console.log('Direct upload successful!');
                return {
                    ...directResult,
                    original_url: originalUrl,
                    source: 'direct_upload'
                };
            }
        } catch (directError) {
            console.error('Direct upload failed:', directError);
        }
        
        // 2. Try download and upload approach
        try {
            console.log('Trying download and upload approach...');
            const downloadResult = await downloadAndUpload(imageUrl);
            if (downloadResult && downloadResult.secure_url) {
                console.log('Download and upload successful!');
                return {
                    ...downloadResult,
                    original_url: originalUrl
                };
            }
        } catch (downloadError) {
            console.error('Download and upload failed:', downloadError);
        }
        
        // 3. Last resort: return original URL
        console.log('All upload methods failed, returning original URL');
        return createFetchUrl(imageUrl, originalUrl);
        
    } catch (error) {
        console.error('Error in URL upload process:', error);
        return {
            error: 'URL upload failed',
            message: error.message,
            // Return the original URL as fallback
            secure_url: imageUrl,
            url: imageUrl
        };
    }
};

/**
 * Attempt direct upload to Cloudinary
 */
const directUpload = async (imageUrl) => {
    try {
        console.log('Attempting direct upload to Cloudinary for:', imageUrl);
        
        // Create form data for the upload
        const formData = new FormData();
        formData.append('file', imageUrl);
        formData.append('upload_preset', 'Portfolio-picture');
        formData.append('cloud_name', 'do1vi5vfa');
        
        // Make the request
        const response = await fetch('https://api.cloudinary.com/v1_1/do1vi5vfa/auto/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Direct upload failed:', errorText);
            return null;
        }
        
        const data = await response.json();
        console.log('Direct upload successful:', data.secure_url);
        
        // Return a clean URL without fetch prefix
        return {
            secure_url: data.secure_url,
            url: data.url,
            resource_type: data.resource_type,
            public_id: data.public_id,
            format: data.format
        };
    } catch (error) {
        console.error('Error in direct upload:', error);
        return null;
    }
};

/**
 * Create a clean Cloudinary fetch URL
 */
const createFetchUrl = async (imageUrl, originalUrl) => {
    try {
        console.log('Using fetch URL approach for:', imageUrl);
        
        // Just return the original URL since it's likely to work better with the database
        return {
            secure_url: originalUrl || imageUrl,
            url: originalUrl || imageUrl,
            resource_type: 'image',
            format: 'auto',
            type: 'fetch',
            source: 'original_url'
        };
    } catch (error) {
        console.error('Error creating fetch URL:', error);
        return {
            error: 'Failed to create fetch URL',
            message: error.message
        };
    }
};

/**
 * Extract Unsplash photo ID from a URL
 */
const extractUnsplashId = (url) => {
    // Handle different Unsplash URL formats
    
    // Format: https://unsplash.com/photos/PHOTO_ID
    const photoMatch = url.match(/unsplash\.com\/photos\/([^/?#]+)/);
    if (photoMatch && photoMatch[1]) {
        return photoMatch[1];
    }
    
    // Format: https://unsplash.com/photos/PHOTO_ID/download
    const downloadMatch = url.match(/unsplash\.com\/photos\/([^/?#]+)\/download/);
    if (downloadMatch && downloadMatch[1]) {
        return downloadMatch[1];
    }
    
    return null;
};

// Export functions
export { HandleUpload, UploadFromUrl };
