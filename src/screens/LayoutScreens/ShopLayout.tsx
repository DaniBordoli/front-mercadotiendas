import React, { useState, useEffect } from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { SelectDefault } from '../../components/atoms/SelectDefault/SelectDefault';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { useNavigate } from 'react-router-dom';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';

const ShopLayout: React.FC = () => {
  const [price, setPrice] = useState(500);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sort, setSort] = useState('latest');
  const navigate = useNavigate();

  // Obtener variables globales de estilo
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);

  const fetchProducts = require('../../stores').useAuthStore((state: any) => state.fetchProducts);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const prods = await fetchProducts();
        setProducts(prods);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [fetchProducts]);

  return (
    <div style={{ backgroundColor: editableVariables.mainBackgroundColor }}>
      <NavBar
        navbarLinks={editableVariables.navbarLinks}
        title={editableVariables.title}
        backgroundColor={editableVariables.navbarBackgroundColor}
        textColor={editableVariables.textColor}
        fontType={editableVariables.fontType}
      />
      <section className="py-8" style={{ backgroundColor: editableVariables.heroBackgroundColor }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2" style={{ color: editableVariables.textColor }}>Shop</h1>
          <div className="flex items-center space-x-1" style={{ color: editableVariables.textColor }}>
            <span>Home</span>
            <FaChevronRight className="text-gray-400" size={14} />
            <span className="font-semibold" style={{ color: editableVariables.primaryColor }}>Shop</span>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto flex mt-8">
        <aside className="w-64 px-4 rounded-lg" style={{ backgroundColor: editableVariables.navbarBackgroundColor }}>
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
              {products.length > 0 ? `Mostrando 1-${products.length} de ${products.length} resultados` : 'No hay productos'}
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
            {loading ? (
              <div className="w-full text-center text-gray-400 py-8 col-span-3">Cargando productos...</div>
            ) : (
              (products && products.length > 0 ? products : [...Array(6)]).map((prod, idx) => (
                <div
                  key={prod?.id || idx}
                  className="relative rounded-lg overflow-hidden shadow group h-96 flex items-stretch cursor-pointer hover:shadow-lg transition"
                  onClick={() => navigate('/first-layout/detail-layout')}
                  style={{ backgroundColor: editableVariables.heroBackgroundColor }}
                >
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: editableVariables.placeholderCardImage }}>
                    {prod && prod.productImages ? (
                      <img src={prod.productImages[0]} alt={prod.nombre} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-2xl" style={{ color: editableVariables.secondaryColor }}>Image</span>
                    )}
                  </div>
                  <div className="relative z-10 flex flex-col justify-end h-full w-full p-4">
                    <h3 className="text-lg font-semibold text-left mb-1 text-white" style={{ color: editableVariables.textColor }}>{prod?.nombre || `Product ${idx + 1}`}</h3>
                    <span className="font-bold text-lg mb-2 text-left block" style={{ color: editableVariables.primaryColor }}>
                      {prod?.precio ? `$${prod.precio}` : '$99.99'}
                    </span>
                    <div className="flex justify-center">
                      <button
                        className="px-4 w-full py-2 rounded hover:bg-blue-600 transition text-sm"
                        style={{
                          backgroundColor: editableVariables.featuredProductsCardButtonColor,
                          color: editableVariables.featuredProductsCardButtonTextColor,
                        }}
                      >
                        {editableVariables.featuredProductsCardButtonText}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
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
      <Footer
        backgroundColor={editableVariables.footerBackgroundColor}
        textColor={editableVariables.footerTextColor}
        footerDescription={editableVariables.footerDescription}
      />
    </div>
  );
};

export default ShopLayout;
