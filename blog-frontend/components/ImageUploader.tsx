'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ImageUploaderProps {
  currentImage?: string;
  onFileSelected: (file: File | null) => void;
}

export default function ImageUploader({ currentImage, onFileSelected }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | undefined>(currentImage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      onFileSelected(null);
      setPreview(currentImage);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onFileSelected(file);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Featured Image
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      {preview && (
        <div className="mt-4">
          <Image 
            src={preview} 
            alt="Preview" 
            width={600}
            height={400}
          />
        </div>
      )}
    </div>
  );
}