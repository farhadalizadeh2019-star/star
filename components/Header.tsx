import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 md:px-8">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          AI Virtual Try-On
        </h1>
        <p className="text-center text-gray-500 mt-1">
          Try on clothes virtually before you buy
        </p>
      </div>
    </header>
  );
};