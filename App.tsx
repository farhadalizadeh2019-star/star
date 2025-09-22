import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Header } from './components/Header';
import { generateVirtualTryOnImage } from './services/geminiService';
import type { UploadedFile } from './types';

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<UploadedFile | null>(null);
  const [clothingImage, setClothingImage] = useState<UploadedFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!personImage || !clothingImage) {
      setError('Please upload both images.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedText(null);

    try {
      const result = await generateVirtualTryOnImage(personImage, clothingImage);
      if (result.image) {
        setGeneratedImage(`data:image/png;base64,${result.image}`);
      } else {
        setError('The AI could not generate an image. Please try with different images.');
      }
      setGeneratedText(result.text);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [personImage, clothingImage]);

  const PersonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );

  const ClothingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const handleImageUpload = (
    setImage: React.Dispatch<React.SetStateAction<UploadedFile | null>>
  ) => (file: UploadedFile | null) => {
    setImage(file);
    setGeneratedImage(null);
    setGeneratedText(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-gray-700 border-b pb-3 mb-2 text-center">Inputs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploader title="1. Upload Your Photo" onImageUpload={handleImageUpload(setPersonImage)} icon={<PersonIcon />} />
              <ImageUploader title="2. Upload Clothing Photo" onImageUpload={handleImageUpload(setClothingImage)} icon={<ClothingIcon />} />
            </div>
            <button
              onClick={handleGenerate}
              disabled={!personImage || !clothingImage || isLoading}
              className="w-full mt-4 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-md disabled:shadow-none"
            >
              {isLoading ? 'Generating...' : 'Virtual Try-On'}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
             <h2 className="text-2xl font-bold text-gray-700 border-b pb-3 mb-4 text-center">Result</h2>
            <ResultDisplay
              generatedImage={generatedImage}
              generatedText={generatedText}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;