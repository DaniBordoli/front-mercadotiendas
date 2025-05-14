import React from 'react';
import { InputDefault } from '../atoms/InputDefault/InputDefault';

const NewsletterSection: React.FC = () => {
  return (
    <div className="bg-gray-50 py-12">
      <h2 className="text-2xl font-bold text-center mb-4">Subscribe to Our Newsletter</h2>
      <p className="text-center text-gray-600 mb-8">
        Get the latest updates about new products and upcoming sales.
      </p>
      <div className="flex justify-center items-center mb-12 gap-4">
        <div >
          <InputDefault className='w-80' placeholder="Enter your email" type="email" />
        </div>
        <button className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default NewsletterSection;
