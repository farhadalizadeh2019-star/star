import React, { useState, useRef } from 'react';
import type { UploadedFile } from '../types';

interface ImageUploaderProps {
  title: string;
  onImageUpload: (file: UploadedFile | null) => void;
  icon: JSX.Element;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onImageUpload, icon }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        const base64Data = result.split(',')[1];
        onImageUpload({ base64: base64Data, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      onImageUpload(null);
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
      <div
        onClick={handleAreaClick}
        className="w-full aspect-square bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300 overflow-hidden"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-500 p-4">
            {icon}
            <p className="mt-2 text-sm">Click to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};