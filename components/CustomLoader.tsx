// components/Loader.tsx
import React from 'react';

const CustomLoader = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
    </div>
  );
};

export default CustomLoader;