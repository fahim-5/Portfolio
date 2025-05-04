import React, { useState, useRef } from 'react';

const ImageUpload = ({ onImageSelect, initialImage, label = "Upload Image" }) => {
  const [preview, setPreview] = useState(initialImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        if (onImageSelect) {
          onImageSelect(file, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setPreview(reader.result);
        if (onImageSelect) {
          onImageSelect(file, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div 
      style={{
        border: `2px dashed ${isDragging ? '#4299e1' : '#e2e8f0'}`,
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isDragging ? 'rgba(66, 153, 225, 0.1)' : 'transparent',
        transition: 'all 0.3s ease',
        marginBottom: '15px'
      }}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {preview ? (
        <div style={{ position: 'relative' }}>
          <img 
            src={preview} 
            alt="Preview" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '200px', 
              borderRadius: '4px',
              objectFit: 'cover'
            }} 
          />
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              opacity: 0,
              transition: 'opacity 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              borderRadius: '4px',
            }}
            className="hover-overlay"
            onMouseOver={(e) => e.currentTarget.style.opacity = 1}
            onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
          >
            Click to change
          </div>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: '10px' }}>{label}</p>
          <p style={{ fontSize: '0.8rem', color: '#718096' }}>
            Drag & drop an image here, or click to select
          </p>
        </div>
      )}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUpload; 