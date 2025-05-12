import React, { useState } from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { SelectDefault } from '../../components/atoms/SelectDefault/SelectDefault';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { useNavigate } from 'react-router-dom';

const ShopLayout: React.FC = () => {
  const [price, setPrice] = useState(500);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sort, setSort] = useState('latest');
  const navigate = useNavigate();

  return (
    <div>
      <NavBar />
      <section className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop</h1>
          <div className="flex items-center space-x-1 text-gray-500">
            <span>Home</span>
            <FaChevronRight className="text-gray-400" size={14} />
            <span className="text-blue-500 font-semibold">Shop</span>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto flex mt-8">
   
        <aside className="w-64 bg-white rounded-lg shadow-sm">
         
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Categories</h2>
            <div className="flex flex-col gap-2 mb-6">
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="mr-2" />
                Women's Fashion
              </label>
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="mr-2" />
                Men's Collection
              </label>
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="mr-2" />
                Accessories
              </label>
            </div>
          </div>
          <hr className="my-4" />
       
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Price Range</h2>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>$0</span>
              <span>$1000</span>
            </div>
            <input
              type="range"
              min={0}
              max={1000}
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="text-xs text-gray-600 mt-1">Selected: ${price}</div>
          </div>
          <hr className="my-4" />
 
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Size</h2>
            <div className="flex gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 rounded border text-xs font-medium ${
                    selectedSize === size
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </aside>
 
        <main className="flex-1 ml-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <span className="text-sm text-gray-700 font-medium text-left">
              Showing 1-12 of 48 results
            </span>
            <div className="w-full md:w-48">
              <SelectDefault
                options={[{ value: 'latest', label: 'Sort by latest' }]}
                value={sort}
                onChange={setSort}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="relative rounded-lg overflow-hidden shadow group h-96 flex items-stretch cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate('/detail-layout')}
              >
       
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">Image</span>
                </div>
  
                <div className="relative z-10 flex flex-col justify-end h-full w-full p-4">
                  <h3 className="text-lg font-semibold text-left mb-1">Product {idx + 1}</h3>
                  <span className=" font-bold text-lg mb-2 text-left block">$99.99</span>
                  <div className="flex justify-center">
                    <button className="px-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10 mb-16">
            <nav className="inline-flex items-center space-x-2">
              <button className="w-10 h-10 flex items-center justify-center border rounded-lg bg-white text-gray-500 hover:bg-gray-100">
                <span className="sr-only">Previous</span>
                <FaChevronLeft />
              </button>
              <button className="w-10 h-10 flex items-center justify-center border rounded-lg bg-blue-600 text-white font-semibold">1</button>
              <button className="w-10 h-10 flex items-center justify-center border rounded-lg bg-white text-gray-700 hover:bg-gray-100">2</button>
              <button className="w-10 h-10 flex items-center justify-center border rounded-lg bg-white text-gray-700 hover:bg-gray-100">3</button>
              <button className="w-10 h-10 flex items-center justify-center border rounded-lg bg-white text-gray-500 hover:bg-gray-100">
                <span className="sr-only">Next</span>
                <FaChevronRight />
              </button>
            </nav>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ShopLayout;
