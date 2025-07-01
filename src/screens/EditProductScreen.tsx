import React, { useEffect, useState } from 'react';
import { DesignButton } from '../components/atoms/DesignButton/DesignButton';
import { SelectDefault } from '../components/atoms/SelectDefault/SelectDefault';
import { FaTrash, FaStore, FaPlus, FaRegEdit, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { FaEye, FaPowerOff, FaRegFolderOpen, FaRegTrashCan, FaRegImages, FaArrowLeft } from 'react-icons/fa6';
import { colors } from '../design/colors';
import { RiPencilFill } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore, addProductImages, deleteProductImage, fetchCategories, fetchMainCategories, fetchSubcategoriesByParent } from '../stores/slices/authSlice';
import ProductDeleteModal from '../components/organisms/NewProductComponents/ProductDeleteModal';
import Toast from '../components/atoms/Toast';
import FullScreenLoader from '../components/molecules/FullScreenLoader';

const EditProductScreen: React.FC = () => {
  const [hasVariants, setHasVariants] = React.useState(true);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fetchProductById = useAuthStore(state => state.fetchProductById);
  const updateProduct = useAuthStore(state => state.updateProduct);
  const deleteProduct = useAuthStore(state => state.deleteProduct);

  const [product, setProduct] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [productImageFile, setProductImageFile] = React.useState<File | null>(null);
  const [productImages, setProductImages] = React.useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = React.useState<File[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [variants, setVariants] = React.useState<{ tipo: string; valores: string[] }[]>([]);
  const [newVariantType, setNewVariantType] = React.useState('');
  const [newVariantValues, setNewVariantValues] = React.useState<Record<number, string>>({});
  const [toast, setToast] = React.useState({
    show: false,
    message: '',
    type: 'error' as 'success' | 'error' | 'info',
  });
  const [showLoader, setShowLoader] = React.useState(false);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([ { value: '', label: 'Seleccionar' } ]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<{ value: string; label: string }[]>([ { value: '', label: 'Seleccionar subcategoría' } ]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);

  React.useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const found = await fetchProductById(id as string);
        if (found) {
          setProduct({
            _id: found._id,
            nombre: found.nombre || '',
            sku: found.sku || '',
            descripcion: found.descripcion || '',
            precio: found.precio || '',
            stock: found.stock?.toString() || '',
            categoria: found.categoria || '',
            estado: found.estado || 'Activo',
          });
          
          // Cargar variantes del producto
          if (found.variantes && Array.isArray(found.variantes)) {
            setVariants(found.variantes);
            setHasVariants(found.variantes.length > 0);
          } else {
            setVariants([]);
            setHasVariants(false);
          }
          
          // Cargar imágenes del producto
          if (found.productImages && Array.isArray(found.productImages)) {
            setProductImages(found.productImages);
          }
          setProductImages(found.productImages || (found.productImage ? [found.productImage] : []));
          // Cargar variantes existentes
          if (found.variantes && Array.isArray(found.variantes)) {
            setVariants(found.variantes);
            setHasVariants(found.variantes.length > 0);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) loadProduct();
  }, [id, fetchProductById]);

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        // Cargar todas las categorías para referencia interna
        const allCategories = await fetchCategories();
        setCategoriesData(allCategories);
        
        // Cargar solo categorías principales para el select
        const mainCategories = await fetchMainCategories();
        setCategoryOptions([
          { value: '', label: 'Seleccionar' },
          ...mainCategories.map((cat: any) => ({ value: cat.name, label: cat.name }))
        ]);
      } catch (error) {
        console.error('Error cargando categorías:', error);
        setCategoryOptions([{ value: '', label: 'Seleccionar' }]);
      }
    };
    loadCategories();
  }, []);

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

  // Cargar subcategorías cuando el producto se carga y tiene una categoría
  React.useEffect(() => {
    if (product?.categoria && categoriesData.length > 0) {
      loadSubcategories(product.categoria);
    }
  }, [product?.categoria, categoriesData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProduct((prev: any) => ({ ...prev, [name]: value }));
    
    // Si cambia la categoría, resetear subcategoría y cargar subcategorías
    if (name === 'categoria') {
      setProduct((prev: any) => ({ ...prev, subcategoria: '' }));
      loadSubcategories(value);
    }
  };

  const handleAddVariant = () => {
    if (!newVariantType.trim()) return;
    const newVariant = {
      tipo: newVariantType.trim(),
      valores: []
    };
    setVariants(prev => [...prev, newVariant]);
    setNewVariantType('');
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
    setNewVariantValues(prev => {
      const newValues = { ...prev };
      delete newValues[index];
      return newValues;
    });
  };

  const handleAddValue = (variantIndex: number) => {
    const value = newVariantValues[variantIndex];
    if (!value?.trim()) return;
    
    setVariants(prev => prev.map((variant, index) => {
      if (index === variantIndex) {
        // Evitar duplicados
        if (variant.valores.includes(value.trim())) return variant;
        return {
          ...variant,
          valores: [...variant.valores, value.trim()]
        };
      }
      return variant;
    }));

    setNewVariantValues(prev => ({ ...prev, [variantIndex]: '' }));
  };

  const handleRemoveValue = (variantIndex: number, valueIndex: number) => {
    setVariants(prev => prev.map((variant, index) => {
      if (index === variantIndex) {
        return {
          ...variant,
          valores: variant.valores.filter((_, i) => i !== valueIndex)
        };
      }
      return variant;
    }));
  };

  const handleProductImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      setToast({
        show: true,
        message: 'Solo se permiten archivos de imagen',
        type: 'error',
      });
      return;
    }
   
    if (productImages.length + validFiles.length > 3) {
      setToast({
        show: true,
        message: 'Máximo 3 imágenes',
        type: 'error',
      });
      return;
    }
    setNewImageFiles(prev => [...prev, ...validFiles]);
    // Preview local
    const readers = validFiles.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject();
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(imgs => {
      setProductImages(prev => [...prev, ...imgs]);
    });
  };

  const handleRemoveProductImage = async (idx: number) => {
    const imageToRemove = productImages[idx];
   
    if (imageToRemove && imageToRemove.startsWith('http')) {
      try {
        const updatedImages = await deleteProductImage(product._id, imageToRemove);
        setProductImages(updatedImages);
      } catch (err: any) {
        setToast({
          show: true,
          message: err?.message || 'Error al eliminar la imagen',
          type: 'error',
        });
      }
    } else {
      
      setProductImages(prev => prev.filter((_, i) => i !== idx));
      setNewImageFiles(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleSave = async () => {
    if (!product) return;
    setUploadingImage(true);
    try {
      let updatedImages: string[] = [...productImages];
     
      if (newImageFiles.length > 0) {
        updatedImages = await addProductImages(product._id, newImageFiles);
        setNewImageFiles([]);
        setProductImages(updatedImages);
      }

      // Preparar las variantes para enviar
      const validVariants = hasVariants 
        ? variants.filter(v => v.tipo && v.valores.length > 0)
        : [];

      await updateProduct(product._id, {
        nombre: product.nombre,
        sku: product.sku,
        descripcion: product.descripcion,
        precio: product.precio,
        stock: product.stock,
        categoria: product.categoria,
        estado: product.estado,
        variantes: validVariants,
      });
      setToast({
        show: true,
        message: 'Producto actualizado correctamente',
        type: 'success',
      });
    } catch (err: any) {
      setToast({
        show: true,
        message: err?.message || 'Error al actualizar el producto',
        type: 'error',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !product) return;
    if (!file.type.startsWith('image/')) {
      setToast({
        show: true,
        message: 'Por favor selecciona un archivo de imagen válido',
        type: 'error',
      });
      e.target.value = '';
      return;
    }
    setProductImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.onerror = () => {
      setToast({
        show: true,
        message: 'Error al cargar la imagen',
        type: 'error',
      });
    };
    reader.readAsDataURL(file);
  };

  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const handleDelete = async () => {
    if (!product) return;
    setShowLoader(true);
    try {
      await deleteProduct(product._id);
      closeDeleteModal();
      navigate('/data-products');
    } catch (err: any) {
      setToast({
        show: true,
        message: err?.message || 'Error al eliminar el producto',
        type: 'error',
      });
    } finally {
      setShowLoader(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex">
        <DataSideBar />
        <div className="flex flex-col flex-grow ml-[250px] items-center justify-center">
          <span className="text-gray-400">Cargando producto...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <DataSideBar />
      <div className="flex flex-col flex-grow ml-[250px]">
        {/* Header global: título, buscador y botón */}
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
            <h1 className="text-2xl font-space">Editar Producto</h1>
          </div>
          <div className="flex items-center gap-3">

            <DesignButton variant="primary"
            icon={FaPlus}>Nuevo Producto</DesignButton>
          </div>
        </div>
      
        <hr className="border-gray-300" />
    
        <div className="w-full py-8 px-8">
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
       
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold font-space mb-1">Editar producto</h1>
                <span className="text-gray-400 text-sm font-space">#RB-001</span>
              </div>
              <div className="flex gap-3">
                <DesignButton variant="green"
                icon={FaEye}
                onClick={() => navigate(`/first-layout/detail-layout/${product._id}`)}>
                  Ver en tienda
                </DesignButton>
                <DesignButton variant="secondary"
                icon={FaTrash}
                onClick={openDeleteModal}>
                  Eliminar producto
                </DesignButton>
              </div>
            </div>
        
            <div className="flex gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <FaRegFolderOpen style={{ color: colors.primaryRed, fontSize: 20 }} />
                  <span className="text-lg font-semibold font-space">Información básica</span>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-xs font-space text-gray-500 mb-1">Nombre del producto *</label>
                    <input
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none"
                      name="nombre"
                      value={product.nombre}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-space text-gray-500 mb-1">SKU *</label>
                    <input
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none"
                      name="sku"
                      value={product.sku}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-space text-gray-500 mb-1">Descripción</label>
                  <textarea
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none min-h-[60px]"
                    name="descripcion"
                    value={product.descripcion}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-xs font-space text-gray-500 mb-1">Precio *</label>
                    <input
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none"
                      name="precio"
                      value={product.precio}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-space text-gray-500 mb-1">Descuento</label>
                    <input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none" defaultValue="10" />
                  </div>
                  <div>
                    <label className="block text-xs font-space text-gray-500 mb-1">Stock *</label>
                    <input
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none"
                      name="stock"
                      value={product.stock}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-space text-gray-500 mb-1">Categoría *</label>
                    <SelectDefault
                      options={categoryOptions}
                      value={product.categoria}
                      onChange={val => handleSelectChange('categoria', val)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-xs font-space text-gray-500 mb-1">Estado *</label>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-space font-semibold ${product.estado === 'Activo' ? 'text-green-600' : 'text-red-500'}`}>{product.estado === 'Activo' ? 'Activo' : 'Inactivo'}</span>
                      <button
                        type="button"
                        className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none ${product.estado === 'Activo' ? 'bg-green-500' : 'bg-gray-300'}`}
                        onClick={() => setProduct((prev: any) => ({ ...prev, estado: prev.estado === 'Activo' ? 'Inactivo' : 'Activo' }))}
                        aria-pressed={product.estado === 'Activo'}
                        aria-label="Cambiar estado"
                      >
                        <motion.span
                          className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow"
                          animate={{ x: product.estado === 'Activo' ? 20 : 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-space">¿Este producto tiene variantes?</span>
                  <button
                    type="button"
                    className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none ${hasVariants ? 'bg-sky-500' : 'bg-gray-200'}`}
                    onClick={() => setHasVariants((v) => !v)}
                    aria-pressed={hasVariants}
                  >
                    <motion.span
                      className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow"
                      animate={{ x: hasVariants ? 20 : 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  </button>
                </div>
           
                {hasVariants && (
                  <div className="mt-2">
                    {/* Agregar nueva variante */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                      <span className="font-space text-sm font-semibold block mb-2">Agregar nueva variante</span>
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <label className="block text-xs font-space text-gray-500 mb-1">Tipo de variante</label>
                          <input
                            className="w-full px-3 py-2 border rounded-lg text-sm font-space focus:outline-sky-400"
                            type="text"
                            placeholder="Ej: Color, Talla, Material, Madera..."
                            value={newVariantType}
                            onChange={(e) => setNewVariantType(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddVariant();
                            }}
                          />
                        </div>
                        <DesignButton
                          variant="primary"
                          onClick={handleAddVariant}
                          disabled={!newVariantType.trim()}
                          className="px-4 py-2 text-sm"
                        >
                          Agregar
                        </DesignButton>
                      </div>
                    </div>

                    {/* Lista de variantes */}
                    {variants.map((variant, variantIndex) => (
                      <div key={variantIndex} className="mb-6 p-4 bg-white border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-space font-medium text-sm text-gray-700 capitalize">
                            {variant.tipo}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(variantIndex)}
                            className="text-red-500 hover:text-red-700 text-sm font-space"
                          >
                            Eliminar variante
                          </button>
                        </div>

                        {/* Valores de la variante */}
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {variant.valores.map((valor, valueIndex) => (
                              <span
                                key={valueIndex}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs font-space"
                              >
                                {valor}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveValue(variantIndex, valueIndex)}
                                  className="text-sky-500 hover:text-sky-700 ml-1"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Agregar nuevo valor */}
                        <div className="flex gap-2">
                          <input
                            className="flex-1 px-2 py-1 border rounded text-xs font-space focus:outline-sky-400"
                            type="text"
                            placeholder={`Agregar ${variant.tipo.toLowerCase()}...`}
                            value={newVariantValues[variantIndex] || ''}
                            onChange={(e) => setNewVariantValues(prev => ({ ...prev, [variantIndex]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddValue(variantIndex);
                            }}
                          />
                          <button
                            className="text-sky-600 text-xs font-space hover:underline px-2"
                            type="button"
                            onClick={() => handleAddValue(variantIndex)}
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                    ))}

                    {variants.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <span className="text-sm font-space">
                          No hay variantes definidas. Agrega una nueva variante arriba.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
          
              <div className="w-56">
                <div className="flex items-center gap-2 mb-3">
                  <FaRegImages style={{ color: '#7C3AED', fontSize: 20 }} />
                  <span className="text-lg font-semibold font-space">Imágenes</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {productImages.map((img, idx) => (
                    <div className="relative" key={idx}>
                      <img
                        src={img}
                        alt={`img${idx}`}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <button
                        className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-1 shadow"
                        onClick={() => handleRemoveProductImage(idx)}
                        type="button"
                        title="Eliminar imagen"
                      >
                        <FaTrash className="text-xs text-red-500" />
                      </button>
                    </div>
                  ))}
                  <div
                    className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded cursor-pointer border border-dashed border-gray-300"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaPlus className="text-gray-400 text-lg" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      multiple
                      onChange={handleProductImagesChange}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-space">Arrastrá para ordenar tus imágenes</span>
              </div>
            </div>
        
            <div className="flex items-center justify-end gap-3 mt-8">
              <DesignButton variant="neutral">
                Cancelar
              </DesignButton>
              <DesignButton variant="primary" onClick={handleSave}>
                Guardar cambios
              </DesignButton>
            </div>
          </div>
        </div>
      </div>
      {deleteModalOpen && product && (
        <ProductDeleteModal
          onClose={closeDeleteModal}
          onDelete={handleDelete}
          product={{
            nombre: product.nombre,
            sku: product.sku,
            precio: product.precio,
            estado: product.estado,
            productImages: productImages || [],
          }}
        />
      )}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
        duration={3000}
      />
      {showLoader && <FullScreenLoader />}
    </div>
  );
};

export default EditProductScreen;
