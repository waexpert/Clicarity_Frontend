import React, { useState, useEffect } from 'react';

const GlobalLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleLoading = (event) => {
      setIsLoading(event.detail.loading);
    };

    window.addEventListener('axios-loading', handleLoading);

    return () => {
      window.removeEventListener('axios-loading', handleLoading);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center gap-4">
        <img 
          src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png" 
          alt="Loading..." 
          className="h-28 w-auto"
          style={{
            animation: 'blink 1.5s ease-in-out infinite'
          }}
        />
        <p className="text-lg font-semibold text-gray-700 text-center">Loading ...</p>
      </div>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default GlobalLoading;