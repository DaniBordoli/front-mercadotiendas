import React from 'react';

const CategorySection: React.FC = () => {
  return (
    <div className="bg-white py-12">
      <h2 className="text-2xl font-bold text-center mb-8">Shop By Category</h2>
      <div className="flex justify-center mx-28 gap-8">
        <img src="https://placehold.co/400x400" alt="Category 1" className="w-1/3 h-96 rounded-lg object-cover shadow-md" />
        <img src="https://placehold.co/400x400" alt="Category 2" className="w-1/3 h-96 rounded-lg object-cover shadow-md" />
        <img src="https://placehold.co/400x400" alt="Category 3" className="w-1/3 h-96 rounded-lg object-cover shadow-md" />
      </div>
    </div>
  );
};

export default CategorySection;
