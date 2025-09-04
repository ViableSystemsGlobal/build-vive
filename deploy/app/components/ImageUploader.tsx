"use client";
import { useState } from "react";

type ImageUploaderProps = {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  label?: string;
};

export default function ImageUploader({ currentImage, onImageChange, label = "Image" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        onImageChange(result.url);
      } else {
        const error = await response.json();
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
      {currentImage && (
        <div className="relative">
          <img 
            src={currentImage} 
            alt="Current image" 
            className="w-full max-w-md h-40 object-cover rounded-lg border"
          />
          <button
            onClick={() => onImageChange('')}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
          >
            ×
          </button>
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
          accept="image/*"
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
              <div className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</div>
            </div>
          )}
        </label>
      </div>

      {/* URL Input Alternative */}
      <div className="space-y-2">
        <label className="block text-xs text-gray-600">Or enter image URL:</label>
        <input
          type="url"
          value={currentImage || ''}
          onChange={(e) => onImageChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
    </div>
  );
}