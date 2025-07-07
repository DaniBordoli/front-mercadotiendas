import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useFirstLayoutStore } from '../stores/firstLayoutStore';
import { useShopStore } from '../stores/slices/shopStore';
import { useAuthStore } from '../stores';
import { fetchShopTemplate } from '../services/api';
import FirstLayout from './LayoutScreens/FirstLayout';
import ShopLayout from './LayoutScreens/ShopLayout';
import ProductDetailScreen from './LayoutScreens/ProductDetailScreen';
import ContactScreen from './LayoutScreens/ContactScreen';
import AboutUsScreen from './LayoutScreens/AboutUsScreen';
import CartScreen from './LayoutScreens/CartScreen';
import FullScreenLoader from '../components/molecules/FullScreenLoader';

const ShopView: React.FC = () => {
  const { shopId, productId } = useParams<{ shopId: string; productId?: string }>();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shopData, setShopData] = useState<any>(null);
  
  const { setEditableVariables } = useFirstLayoutStore();
  const { setShop } = useShopStore();
  const { fetchProducts } = useAuthStore();

  useEffect(() => {
    const loadShopData = async () => {
      if (!shopId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Cargando datos de tienda con ID:', shopId);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/shops/public/${shopId}`);
        
        console.log('Respuesta del servidor:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error del servidor:', errorData);
          throw new Error(errorData.message || 'Tienda no encontrada');
        }
        
        const result = await response.json();
        console.log('Datos de tienda recibidos:', result);
        const shop = result.data.shop;
        
        if (!shop.active) {
          throw new Error('Esta tienda no está disponible');
        }
        
        setShopData(shop);
        setShop(shop);
        
        if (shop.templateUpdate) {
          console.log('Aplicando templateUpdate:', shop.templateUpdate);
          setEditableVariables(shop.templateUpdate);
        } else {
          console.log('No hay templateUpdate para esta tienda');
        }
        
      } catch (err: any) {
        console.error('Error al cargar tienda:', err);
        setError(err.message || 'Error al cargar la tienda');
      } finally {
        setLoading(false);
      }
    };
    
    loadShopData();
  }, [shopId, setShop, setEditableVariables]);

  if (loading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tienda No Encontrada</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Volver al Marketplace
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    const path = location.pathname;
    
    if (path.includes('/producto/')) {
      return <ProductDetailScreen />;
    } else if (path.includes('/tienda')) {
      return <ShopLayout />;
    } else if (path.includes('/contacto')) {
      return <ContactScreen />;
    } else if (path.includes('/acerca-de')) {
      return <AboutUsScreen />;
    } else if (path.includes('/carrito')) {
      return <CartScreen />;
    } else {
      return <FirstLayout />;
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default ShopView;
