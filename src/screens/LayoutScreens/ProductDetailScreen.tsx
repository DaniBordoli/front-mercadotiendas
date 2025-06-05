import React, { useState } from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { FaChevronRight, FaStar, FaRegStar, FaHeart, FaTruck, FaUndo } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';

const images = [
  'https://www.houseofblanks.com/cdn/shop/files/HeavyweightTshirt_White_01_2.jpg?v=1726516822&width=1445',
  'https://www.houseofblanks.com/cdn/shop/files/HeavyweightTshirt_White_01_2.jpg?v=1726516822&width=1445',
  'https://www.houseofblanks.com/cdn/shop/files/HeavyweightTshirt_White_01_2.jpg?v=1726516822&width=1445',
  'https://www.houseofblanks.com/cdn/shop/files/HeavyweightTshirt_White_01_2.jpg?v=1726516822&width=1445',
  'https://www.houseofblanks.com/cdn/shop/files/HeavyweightTshirt_White_01_2.jpg?v=1726516822&width=1445',
];

const ProductDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [tab, setTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  return (
    <div style={{ backgroundColor: editableVariables.mainBackgroundColor }}>
      <NavBar
        navbarLinks={editableVariables.navbarLinks}
        title={editableVariables.title}
        backgroundColor={editableVariables.navbarBackgroundColor}
        textColor={editableVariables.textColor}
        fontType={editableVariables.fontType}
      />

      <section className="bg-gray-100 py-2">
        <div className="max-w-7xl mx-auto px-12">
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <span>Home</span>
            <FaChevronRight className="text-gray-400" size={12} />
            <span>Shop</span>
            <FaChevronRight className="text-gray-400" size={12} />
            <span className="text-blue-500 font-semibold">Classic White Shirt</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 mt-8 px-4">

        <div className="flex-1 flex flex-col items-center">
          <div className="w-full max-w-2xl h-[600px] bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden mb-4 border">

            <img
              src={images[selectedImage]}
              alt="Product"
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex gap-3 mt-2 w-full max-w-2xl">
            {images.slice(1).map((img, idx) => (
              <button
                key={idx}
                className={`w-1/4 h-20 rounded border-2 ${selectedImage === idx + 1 ? 'border-blue-500' : 'border-gray-200'} overflow-hidden bg-gray-200`}
                onClick={() => setSelectedImage(idx + 1)}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md flex flex-col">
          <h2 className="text-2xl font-bold mb-2">Classic White Shirt</h2>

          <div className="flex items-center mb-2">
            {[1,2,3,4,5].map(i =>
              i <= 4 ? (
                <FaStar key={i} className="text-yellow-400 mr-1" />
              ) : (
                <FaRegStar key={i} className="text-yellow-400 mr-1" />
              )
            )}
            <span className="ml-2 text-sm text-gray-500">(24 Reviews)</span>
          </div>

          <div className="text-2xl font-bold text-gray-900 mb-4">$59.99</div>

          <p className="text-gray-600 mb-4">
            A timeless classic white shirt made from premium cotton. Perfect for both casual and formal occasions. Features a regular fit, button-down collar, and curved hem.
          </p>

          <div className="mb-4">
            <div className="text-sm font-semibold mb-2">Size</div>
            <div className="flex gap-2">
              {['S', 'M', 'L', 'XL'].map(size => (
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
  
          <div className="mb-4">
            <div className="text-sm font-semibold mb-2">Quantity</div>
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 flex items-center justify-center border rounded text-lg font-bold bg-white hover:bg-gray-100"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >-</button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                className="w-8 h-8 flex items-center justify-center border rounded text-lg font-bold bg-white hover:bg-gray-100"
                onClick={() => setQuantity(q => q + 1)}
              >+</button>
            </div>
          </div>
 
          <div className="flex gap-2 mt-4">
            <button onClick={() => {navigate('/shipping-layout')}} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition">
              Add to Cart
            </button>
            <button className="w-12 h-12 flex items-center justify-center border rounded bg-white text-blue-600 hover:bg-blue-50 transition">
              <FaHeart size={22} />
            </button>
          </div>

          <div className="mt-6 space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaTruck className="text-lg text-gray-700" />
              Free shipping on orders over $100
            </div>
            <div className="flex items-center gap-2">
              <FaUndo className="text-lg text-gray-700" />
              30-day return policy
            </div>
          </div>
        </div>
      </div>

      <div className="w-full" style={{ backgroundColor: editableVariables.heroBackgroundColor, marginTop: '3rem', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex border-b mb-6">
            <button
              className="px-4 py-2 text-sm font-medium border-b-2"
              type="button"
              style={{ color: tab === 'description' ? editableVariables.primaryColor : editableVariables.textColor, borderColor: tab === 'description' ? editableVariables.primaryColor : 'transparent' }}
              onClick={() => setTab('description')}
            >
              Description
            </button>
            <button
              className="px-4 py-2 text-sm font-medium border-b-2"
              type="button"
              style={{ color: tab === 'specs' ? editableVariables.primaryColor : editableVariables.textColor, borderColor: tab === 'specs' ? editableVariables.primaryColor : 'transparent' }}
              onClick={() => setTab('specs')}
            >
              Specifications
            </button>
            <button
              className="px-4 py-2 text-sm font-medium border-b-2"
              type="button"
              style={{ color: tab === 'reviews' ? editableVariables.primaryColor : editableVariables.textColor, borderColor: tab === 'reviews' ? editableVariables.primaryColor : 'transparent' }}
              onClick={() => setTab('reviews')}
            >
              Reviews (24)
            </button>
          </div>
          <div>
            {tab === 'description' && (
              <>
                <h3 className="text-lg font-semibold mb-2" style={{ color: editableVariables.textColor }}>Product Description</h3>
                <p className="mb-4" style={{ color: editableVariables.secondaryColor }}>
                  This classic white shirt is crafted from premium 100% cotton fabric, ensuring both comfort and durability. The regular fit design provides a timeless silhouette that suits various body types. Features include:
                </p>
                <div className="pl-0 space-y-1" style={{ color: editableVariables.textColor }}>
                  <div>Premium cotton fabric</div>
                  <div>Button-down collar</div>
                  <div>Regular fit</div>
                  <div>Curved hem</div>
                  <div>Machine washable</div>
                </div>
              </>
            )}
            {tab === 'specs' && (
              <div style={{ color: editableVariables.textColor }}>
                <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                <ul className="list-disc pl-6">
                  <li>Material: 100% Cotton</li>
                  <li>Fit: Regular</li>
                  <li>Color: White</li>
                  <li>Care: Machine washable</li>
                </ul>
              </div>
            )}
            {tab === 'reviews' && (
              <div style={{ color: editableVariables.textColor }}>
                <h3 className="text-lg font-semibold mb-2">Reviews (24)</h3>
                <p>No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 px-4 pb-16">
        <h3 className="text-lg font-semibold mb-6">You May Also Like</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="relative rounded-lg overflow-hidden shadow group h-96 flex items-stretch bg-white"
            >

              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <img
                  src={`https://via.placeholder.com/300x400?text=Product+${idx}`}
                  alt={`Product ${idx}`}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="relative z-10 flex flex-col justify-end h-full w-full p-4">
                <h3 className="text-lg font-semibold text-left mb-1  drop-shadow">Product {idx}</h3>
                <span className="font-bold text-lg mb-2 text-left block">$99.99</span>
                <div className="flex justify-center">
                  <button className="px-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer
        backgroundColor={editableVariables.footerBackgroundColor}
        textColor={editableVariables.footerTextColor}
        footerDescription={editableVariables.footerDescription}
      />
    </div>
  );
};

export default ProductDetailScreen;
