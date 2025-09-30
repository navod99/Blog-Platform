'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ImageUploaderProps {
  currentImage?: string;
  onImageUploaded: (url: string) => void;
}

export default function ImageUploader({ currentImage, onImageUploaded }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // const file = e.target.files?.[0];
    // if (!file) return;

    // setUploading(true);
    // const formData = new FormData();
    // formData.append('file', file);

    // try {
    //   const response = await axiosInstance.post('/upload/image', formData, {
    //     headers: { 'Content-Type': 'multipart/form-data' },
    //   });
      
    //   onImageUploaded(response.data.url);
    //   toast.success('Image uploaded successfully');
    // } catch (error) {
    //   toast.error('Failed to upload image');
    // } finally {
    //   setUploading(false);
    // }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Featured Image
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
      {currentImage && (
        <Image src={currentImage} alt={"Featured"} width={300} height={300} />
      )}
    </div>
  );
}