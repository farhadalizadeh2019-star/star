import React from 'react';
import { Loader } from './Loader';

interface ResultDisplayProps {
  generatedImage: string | null;
  generatedText: string | null;
  isLoading: boolean;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedImage, generatedText, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <Loader />
          <p className="mt-4 text-lg font-semibold text-indigo-600">Processing...</p>
          <p className="text-gray-500">This might take a moment. Please be patient.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-red-600">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-lg font-bold">Error!</p>
          <p className="mt-2 text-gray-700">{error}</p>
        </div>
      );
    }

    if (generatedImage) {
      return (
        <div className="flex flex-col items-center">
          <img src={generatedImage} alt="Generated result" className="rounded-lg shadow-lg w-full h-auto object-contain" />
          {generatedText && (
            <p className="mt-4 p-3 bg-gray-100 rounded-md text-sm text-gray-700">{generatedText}</p>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-4 text-lg font-semibold">Your result will be displayed here</p>
        <p className="mt-1 text-sm">Select your images and click the "Virtual Try-On" button.</p>
      </div>
    );
  };

  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[450px] flex items-center justify-center bg-gray-100/50 rounded-lg p-4">
      {renderContent()}
    </div>
  );
};