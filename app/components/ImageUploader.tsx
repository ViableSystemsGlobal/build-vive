"use client";
import { useState } from "react";

type ImageUploaderProps = {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  label?: string;
  uniqueKey?: string;
};

export default function ImageUploader({ currentImage, onImageChange, label = "Image", uniqueKey }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [imageKey, setImageKey] = useState(0);
  const [localImage, setLocalImage] = useState(currentImage);
  
  console.log(`ImageUploader rendered with uniqueKey: ${uniqueKey}, label: ${label}`);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check for unsupported formats
    const unsupportedFormats = ['image/heic', 'image/heif'];
    if (unsupportedFormats.includes(file.type.toLowerCase())) {
      alert('HEIC/HEIF files are not supported. Please convert to JPG or PNG first.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Try S3 first, then Vercel Blob, then cloud upload, then regular upload
      let response = await fetch('/api/upload-s3', {
        method: 'POST',
        body: formData,
      });

      // If S3 fails, try Vercel Blob
      if (!response.ok) {
        response = await fetch('/api/upload-vercel-blob', {
          method: 'POST',
          body: formData,
        });
      }

      // If Vercel Blob fails, try cloud upload
      if (!response.ok) {
        response = await fetch('/api/upload-cloud', {
          method: 'POST',
          body: formData,
        });
      }

      // If cloud upload fails, try regular upload
      if (!response.ok) {
        response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
      }

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        console.log('Updating ImageUploader with uniqueKey:', uniqueKey);
        setLocalImage(result.url); // Update local state first
        onImageChange(result.url);
        setImageKey(prev => prev + 1); // Force re-render
        console.log('Image URL updated to:', result.url);
      } else {
        const error = await response.json();
        console.error('Upload failed:', error);
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">{label}</label>
      
      {/* Current Image Preview */}
      {(localImage || currentImage) && (
        <div className="relative">
          <img 
            key={`${uniqueKey || 'image'}-${imageKey}`} // Force re-render when image changes
            src={`${localImage || currentImage}?t=${Date.now()}`}
            alt="Current image" 
            className="w-full max-w-md h-40 object-cover rounded-lg border"
            onError={(e) => {
              console.error('Image failed to load:', localImage || currentImage);
              e.currentTarget.style.display = 'none';
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', localImage || currentImage);
            }}
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={() => {
                // Force refresh the image by adding a timestamp
                const img = document.querySelector(`img[src*="${currentImage}"]`) as HTMLImageElement;
                if (img) {
                  img.src = `${currentImage}?t=${Date.now()}`;
                }
              }}
              className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-blue-600"
              title="Refresh image"
            >
              ↻
            </button>
            <button
              onClick={() => {
                setLocalImage('');
                onImageChange('');
              }}
              className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              title="Remove image"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileInput}
          className="hidden"
          id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          disabled={uploading}
        />
        
        <label 
          htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className="cursor-pointer"
        >
          {uploading ? (
            <div className="space-y-2">
              <div className="text-blue-600">Uploading...</div>
              <div className="w-16 h-1 bg-gray-200 rounded mx-auto overflow-hidden">
                <div className="h-full bg-blue-500 rounded animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-4xl text-gray-400">📁</div>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
              </div>
              <div className="text-xs text-gray-500">JPG, PNG, GIF, WebP up to 10MB (HEIC not supported)</div>
            </div>
          )}
        </label>
      </div>

      {/* URL Input Alternative */}
      <div className="space-y-2">
        <label className="block text-xs text-gray-600">Or enter image URL:</label>
        <input
          type="url"
          value={localImage || currentImage || ''}
          onChange={(e) => {
            setLocalImage(e.target.value);
            onImageChange(e.target.value);
          }}
          placeholder="https://example.com/image.jpg"
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
    </div>
  );
}