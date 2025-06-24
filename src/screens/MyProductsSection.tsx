import React from 'react';
import { SelectDefault } from '../components/atoms/SelectDefault/SelectDefault';
import { DesignButton } from '../components/atoms/DesignButton/DesignButton';
import { FaSearch, FaRegEdit, FaTrash, FaEyeSlash } from 'react-icons/fa';
import { TbEdit } from "react-icons/tb";
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar'
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa6';
import { useAuthStore } from '../stores/slices/authSlice';
import ProductDeleteModal from '../components/organisms/NewProductComponents/ProductDeleteModal';

const estadoOptions = [
  { value: '', label: 'Todos' },
  { value: 'activo', label: 'Activo' },
  { value: 'pendiente', label: 'Pendiente' },
];
const categoriaOptions = [
  { value: '', label: 'Todas' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'calzado', label: 'Calzado' },
];
const ordenarOptions = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'antiguos', label: 'Más antiguos' },
];
const stockOptions = [
  { value: '', label: 'Todos' },
  { value: 'conStock', label: 'Con stock' },
  { value: 'sinStock', label: 'Sin stock' },
];

const MyProductsSection: React.FC = () => {
  const navigate = useNavigate();
  const fetchProducts = useAuthStore(state => state.fetchProducts);
  const deleteProduct = useAuthStore(state => state.deleteProduct);
  const [productos, setProductos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<any | null>(null);

  // Estados para filtros
  const [estadoFiltro, setEstadoFiltro] = React.useState('');
  const [categoriaFiltro, setCategoriaFiltro] = React.useState('');
  const [ordenarFiltro, setOrdenarFiltro] = React.useState('recientes');
  const [stockFiltro, setStockFiltro] = React.useState('');
  const [busqueda, setBusqueda] = React.useState('');

  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const prods = await fetchProducts();
        setProductos(prods);
      } catch (err) {
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [fetchProducts]);

  // Filtrado de productos
  const productosFiltrados = React.useMemo(() => {
    let filtered = [...productos];
    if (estadoFiltro) filtered = filtered.filter(p => (p.estado || '').toLowerCase() === estadoFiltro);
    if (categoriaFiltro) filtered = filtered.filter(p => (p.categoria || '').toLowerCase() === categoriaFiltro);
    if (stockFiltro === 'conStock') filtered = filtered.filter(p => Number(p.stock) > 0);
    if (stockFiltro === 'sinStock') filtered = filtered.filter(p => !p.stock || Number(p.stock) <= 0);
    if (busqueda.trim()) filtered = filtered.filter(p => (p.nombre || '').toLowerCase().includes(busqueda.trim().toLowerCase()));
    if (ordenarFiltro === 'recientes') filtered = filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    if (ordenarFiltro === 'antiguos') filtered = filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateA - dateB;
    });
    return filtered;
  }, [productos, estadoFiltro, categoriaFiltro, stockFiltro, busqueda, ordenarFiltro]);

  const openDeleteModal = (product: any) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete._id);
      setProductos(prev => prev.filter(p => p._id !== productToDelete._id));
      closeDeleteModal();
    } catch (err: any) {
      alert(err?.message || 'Error al eliminar el producto');
    }
  };

  return (
    <div className="min-h-screen flex">
      <DataSideBar />
      <div className="flex flex-col flex-grow ml-0 md:ml-[250px]">
        {/* Barra superior */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-8 h-auto md:h-[80px] bg-white gap-4 md:gap-0 pt-4 md:pt-0">
          <h1 className="text-2xl font-space ">Mis Productos</h1>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="border border-gray-200 rounded-lg px-4 py-2 pl-10 w-full md:w-64 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primaryRed"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            </div>
            <DesignButton
              variant="primary"
              onClick={() => navigate('/new-product')}
              icon={FaPlus}
              className="w-full md:w-auto"
            >

              Nuevo Producto
            </DesignButton>
          </div>
        </div>
        <hr className="border-gray-300" />
        {/* Filtros */}
        <div className="w-full px-4 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between mt-4 mb-2 gap-2">
          <span className="font-space text-lg">Filtros</span>
          <button className="text-sky-500 text-sm font-space hover:underline" onClick={() => {
            setEstadoFiltro('');
            setCategoriaFiltro('');
            setOrdenarFiltro('recientes');
            setStockFiltro('');
            setBusqueda('');
          }}>Limpiar filtros</button>
        </div>
        <div className="w-full px-4 md:px-8 py-6 pt-0">
          <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4 mb-2">
            <div className="flex flex-col gap-1 w-full md:w-40">
              <span className="text-xs text-gray-500 font-space">Estado</span>
              <SelectDefault options={estadoOptions} value={estadoFiltro} onChange={val => setEstadoFiltro(val)} />
            </div>
            <div className="flex flex-col gap-1 w-full md:w-40">
              <span className="text-xs text-gray-500 font-space">Categoría</span>
              <SelectDefault options={categoriaOptions} value={categoriaFiltro} onChange={val => setCategoriaFiltro(val)} />
            </div>
            <div className="flex flex-col gap-1 w-full md:w-48">
              <span className="text-xs text-gray-500 font-space">Ordenar por</span>
              <SelectDefault options={ordenarOptions} value={ordenarFiltro} onChange={val => setOrdenarFiltro(val)} />
            </div>
            <div className="flex flex-col gap-1 w-full md:w-40">
              <span className="text-xs text-gray-500 font-space">Stock</span>
              <SelectDefault options={stockOptions} value={stockFiltro} onChange={val => setStockFiltro(val)} />
            </div>
          </div>
          {/* Tabla responsiva */}
          <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500 font-space text-xs">
                  <th className="px-4 py-3 font-normal text-left">Producto</th>
                  <th className="px-4 py-3 font-normal text-left">SKU</th>
                  <th className="px-4 py-3 font-normal text-left">Precio</th>
                  <th className="px-4 py-3 font-normal text-left">Stock</th>
                  <th className="px-4 py-3 font-normal text-left">Estado</th>
                  <th className="px-4 py-3 font-normal text-left">Categoría</th>
                  <th className="px-4 py-3 font-normal text-left">Fecha</th>
                  <th className="px-4 py-3 font-normal text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-400">Cargando productos...</td>
                  </tr>
                ) : productos.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-400">No hay productos.</td>
                  </tr>
                ) : (
                  productosFiltrados.map((prod, idx) => (
                    <tr key={prod._id || prod.sku || idx} className="border-t last:border-b rounded-xl hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 flex items-center gap-3 min-w-[180px]">
                        {prod.productImages && prod.productImages.length > 0 ? (
                          <img
                            src={prod.productImages[0]}
                            alt={prod.nombre}
                            className="w-[40px] h-[40px] object-cover rounded-md bg-gray-200"
                          />
                        ) : prod.productImage ? (
                          <img
                            src={prod.productImage}
                            alt={prod.nombre}
                            className="w-[40px] h-[40px] object-cover rounded-md bg-gray-200"
                          />
                        ) : (
                          <div className="w-[40px] h-[40px] bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400 font-space">
                            60×60
                          </div>
                        )}
                        <span className="font-space text-sm text-gray-800">{prod.nombre}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 font-space min-w-[100px]">{prod.sku}</td>
                      <td className="px-4 py-3 font-space min-w-[100px]">{prod.precio}</td>
                      <td className="px-4 py-3 font-space min-w-[80px]">{prod.stock ?? '-'}</td>
                      <td className="px-4 py-3 font-space min-w-[100px]">
                        <span className="font-medium text-green-600">{prod.estado}</span>
                      </td>
                      <td className="px-4 py-3 font-space min-w-[120px]">{prod.categoria}</td>
                      <td className="px-4 py-3 font-space min-w-[120px]">
                        {prod.createdAt ? new Date(prod.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 flex items-center gap-3 min-w-[120px]">
                        <button
                          className="hover:text-primaryRed"
                          onClick={() => navigate(`/edit-products/${prod._id}`)}
                        >
                          <TbEdit className="text-lg text-gray-500" />
                        </button>
                       
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => openDeleteModal(prod)}
                        >
                          <FaTrash className="" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {deleteModalOpen && productToDelete && (
        <ProductDeleteModal
          onClose={closeDeleteModal}
          onDelete={handleDelete}
          product={{
            nombre: productToDelete.nombre,
            sku: productToDelete.sku,
            precio: productToDelete.precio,
            estado: productToDelete.estado,
            productImages: productToDelete.productImages || [],
          }}
        />
      )}
    </div>
  );
};

export default MyProductsSection;
