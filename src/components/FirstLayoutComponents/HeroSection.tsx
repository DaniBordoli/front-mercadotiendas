import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="flex h-[700px] bg-gray-50 p-8">
      <div className="flex-1 flex flex-col justify-center pl-40">
        <h1 className="text-4xl text-gray-800 w-6/12 font-bold mb-4">Discover Your Style With Our Collection</h1>
        <p className="text-lg text-gray-600 mb-8">
          Shop the latest trends in fashion, accessories, and lifestyle products.
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-3 text-white bg-blue-500 rounded hover:bg-blue-600">
            Shop Now
          </button>
          <button className="px-6 py-3 text-gray-800 border border-gray-800 rounded">
            Learn More
          </button>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <img src="https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=80&w=2141&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Placeholder" className="w-4/5 h-4/5 rounded-lg object-cover shadow-lg" />
      </div>
    </div>
  );
};

export default HeroSection;
