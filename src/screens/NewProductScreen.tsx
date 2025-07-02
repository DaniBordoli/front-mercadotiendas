import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesignButton } from '../components/atoms/DesignButton/DesignButton';
import { FaArrowLeft } from 'react-icons/fa6';
import { FaCheck } from 'react-icons/fa';
import { colors } from '../design/colors';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import StepBasicInfo from '../components/organisms/NewProductComponents/StepBasicInfo';
import ImageStep from '../components/organisms/NewProductComponents/ImageStep';
import VariantsStep from '../components/organisms/NewProductComponents/VariantsStep';
import ProductSuccessModal from '../components/organisms/NewProductComponents/ProductSuccessModal';
import { useAuthStore } from '../stores/slices/authSlice';
import Toast from '../components/atoms/Toast';
import FullScreenLoader from '../components/molecules/FullScreenLoader';
import { fetchCategories, fetchMainCategories, fetchSubcategoriesByParent } from '../stores/slices/authSlice';

const steps = [
  { label: 'Información Básica' },
  { label: 'Imágenes' },
  { label: 'Variantes' },
];

const NewProductScreen: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [showModal, setShowModal] = React.useState(false);
  const [createdProduct, setCreatedProduct] = React.useState<any | null>(null);
  const [toast, setToast] = React.useState({
    show: false,
    message: '',
    type: 'error' as 'success' | 'error' | 'info',
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const [basicInfo, setBasicInfo] = React.useState({
    nombre: '',
    descripcion: '',
    sku: '',
    estado: 'Activo',
    precio: '',
    categoria: '',
    subcategoria: '',
    stock: '', // nuevo campo
  });

  // Estado para imágenes
  const [productImages, setProductImages] = React.useState<(File | string)[]>([]);
  const variantsRef = useRef<{ getVariants: () => { tipo: string; valores: string[] }[] }>(null);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([ { value: '', label: 'Seleccionar categoría' } ]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<{ value: string; label: string }[]>([ { value: '', label: 'Seleccionar subcategoría' } ]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string; value: string }
  ) => {
    if ('target' in e) {
      const { name, value } = e.target;
      setBasicInfo(prev => ({ ...prev, [name]: value }));
      
      // Si cambia la categoría, resetear subcategoría y cargar subcategorías
      if (name === 'categoria') {
        setBasicInfo(prev => ({ ...prev, subcategoria: '' }));
        loadSubcategories(value);
      }
    } else {
      setBasicInfo(prev => ({ ...prev, [e.name]: e.value }));
      
      // Si cambia la categoría, resetear subcategoría y cargar subcategorías
      if (e.name === 'categoria') {
        setBasicInfo(prev => ({ ...prev, subcategoria: '' }));
        loadSubcategories(e.value);
      }
    }
  };

  const createProduct = useAuthStore(state => state.createProduct);

  // Función para cargar subcategorías según la categoría seleccionada
  const loadSubcategories = async (categoryName: string) => {
    if (!categoryName) {
      setSubcategoryOptions([{ value: '', label: 'Seleccionar subcategoría' }]);
      return;
    }

    try {
      // Encontrar la categoría seleccionada en los datos
      const selectedCategory = categoriesData.find(cat => cat.name === categoryName);
      if (!selectedCategory) {
        setSubcategoryOptions([{ value: '', label: 'Seleccionar subcategoría' }]);
        return;
      }

      // Obtener subcategorías de esta categoría
      const subcategories = await fetchSubcategoriesByParent(selectedCategory._id);
      setSubcategoryOptions([
        { value: '', label: 'Seleccionar subcategoría' },
        ...subcategories.map((subcat: any) => ({ value: subcat.name, label: subcat.name }))
      ]);
    } catch (error) {
      console.error('Error cargando subcategorías:', error);
      setSubcategoryOptions([{ value: '', label: 'Seleccionar subcategoría' }]);
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      const variants = variantsRef.current?.getVariants() || [];
      
      let formData: FormData | null = null;
      if (productImages.length > 0) {
        formData = new FormData();
        Object.entries(basicInfo).forEach(([key, value]) => {
          // Convertir stock a número si es posible
          if (key === 'stock') {
            formData!.append(key, value ? String(Number(value)) : '0');
          } else {
            formData!.append(key, value);
          }
        });
        formData!.append('variantes', JSON.stringify(variants));
        productImages.forEach((img) => {
          if (img instanceof File) {
            formData!.append('productImages', img);
          }
        });
      }
      
      const dataToSend = formData
        ? (formData as any)
        : {
            ...basicInfo,
            stock: basicInfo.stock ? Number(basicInfo.stock) : 0, // Enviar como número
            variantes: variants,
          };
      
      const result = await createProduct(dataToSend);
      setCreatedProduct({
        nombre: result.data?.nombre || basicInfo.nombre,
        sku: result.data?.sku || basicInfo.sku,
        precio: result.data?.precio || basicInfo.precio,
        estado: result.data?.estado || basicInfo.estado,
        stock: result.data?.stock || basicInfo.stock, // mostrar stock si lo necesitas
        productImages: result.data?.productImages || [],
      });
      setShowModal(true);
    } catch (err: any) {
      console.log('Error completo:', err);
      let errorMessage = 'Error al crear el producto';
      
      // El mensaje del backend viene en err.message
      if (err.message) {
        // Si el mensaje contiene información sobre SKU duplicado
        if (err.message.includes('SKU') || err.message.includes('sku')) {
          errorMessage = err.message;
        } else if (err.message.includes('duplicate') || err.message.includes('duplicado')) {
          errorMessage = 'Ya existe un producto con esta información. Por favor, verifica los datos.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setToast({
        show: true,
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Cargar todas las categorías para referencia interna
        const allCategories = await fetchCategories();
        setCategoriesData(allCategories);
        
        // Cargar solo categorías principales para el select
        const mainCategories = await fetchMainCategories();
        setCategoryOptions([
          { value: '', label: 'Seleccionar categoría' },
          ...mainCategories.map((cat: any) => ({ value: cat.name, label: cat.name }))
        ]);
      } catch (error) {
        console.error('Error cargando categorías:', error);
        setCategoryOptions([{ value: '', label: 'Seleccionar categoría' }]);
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="min-h-screen flex relative">
      {isLoading && <FullScreenLoader />}
      <DataSideBar />
      <div className="flex flex-col flex-grow ml-[250px]">
        <div className="w-full flex items-center justify-between px-8 h-[80px] bg-white border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              aria-label="Volver"
            >
              <FaArrowLeft className="text-gray-500" />
            </button>
            <h1 className="text-2xl font-space">Nuevo Producto</h1>
          </div>
          <div className="flex items-center gap-2">
            <DesignButton variant="neutral" onClick={() => navigate('/data-products')}>Cancelar</DesignButton>
            <DesignButton
              variant="primary"
              disabled={step !== 3}
              onClick={step === 3 ? handlePublish : undefined}
            >
              Publicar Producto
            </DesignButton>
          </div>
        </div>

        <div className="w-full flex items-center px-8 py-6 bg-white border-b border-gray-100">
          <div className="flex items-center gap-8">
            {steps.map((s, idx) => {
              const stepNum = idx + 1;
              const isActive = step === stepNum;
              const isCompleted = step > stepNum;
              return (
                <React.Fragment key={s.label}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center border-2"
                      style={{
                        borderColor: isActive || isCompleted ? colors.primaryRed : '#E5E5E7',
                        background: isActive
                          ? colors.primaryRed
                          : isCompleted
                          ? colors.primaryRed
                          : '#fff',
                        color: isActive || isCompleted ? '#fff' : colors.primaryRed,
                        fontWeight: 600,
                        transition: 'background 0.2s, border 0.2s',
                      }}
                    >
                      {isCompleted ? <FaCheck size={14} /> : stepNum}
                    </div>
                    <span
                      className="font-space text-sm"
                      style={{
                        color: isActive
                          ? colors.primaryRed
                          : isCompleted
                          ? colors.primaryRed
                          : '#aaa',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="h-0.5 w-12 bg-gray-200" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {step === 1 && (
          <StepBasicInfo
            onNext={() => setStep(2)}
            values={basicInfo}
            onChange={handleBasicInfoChange}
            categoryOptions={categoryOptions}
            subcategoryOptions={subcategoryOptions}
          />
        )}
        {step === 2 && (
          <ImageStep 
            onNext={() => setStep(3)}
            productImages={productImages}
            setProductImages={setProductImages}
          />
        )}
        {step === 3 && (
          <VariantsStep ref={variantsRef} />
        )}

        {showModal && createdProduct && (
          <ProductSuccessModal
            onClose={() => setShowModal(false)}
            product={createdProduct}
          />
        )}
        <Toast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
          duration={3000}
        />
      </div>
    </div>
  );
};

export default NewProductScreen;
