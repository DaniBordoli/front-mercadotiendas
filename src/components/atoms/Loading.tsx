import React from 'react';
import { FaStore } from 'react-icons/fa';

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex items-center mb-4">
        <FaStore size={28} color="skyblue" className="mr-2" />
        <h1 className="text-2xl font-bold text-sky-500">Mercado tienda</h1>
      </div>
      <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 dark:bg-white-700 overflow-hidden">
        <div className="bg-sky-500 h-2.5 rounded-full w-1/3 animate-loading"></div>
      </div>
    </div>
  );
}

export default Loading;
