import React from 'react';
import { SelectDefault } from '../components/atoms/SelectDefault/SelectDefault';
import { DesignButton } from '../components/atoms/DesignButton/DesignButton';
import { FaSearch, FaRegEdit, FaTrash, FaEyeSlash } from 'react-icons/fa';
import { TbEdit } from "react-icons/tb";
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar'
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa6';

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

const productos = [
  {
    img: '',
    nombre: 'Reloj de Cuero Clásico',
    sku: 'RL-001',
    precio: '$299.99',
    stock: 45,
    estado: 'Activo',
    categoria: 'Accesorios',
    fecha: '2024-02-15',
    estadoColor: 'text-green-600',
  },
  {
    img: '',
    nombre: 'Zapatillas Deportivas Pro',
    sku: 'ZP-100',
    precio: '$149.50',
    stock: 28,
    estado: 'Pendiente',
    categoria: 'Calzado',
    fecha: '2024-02-15',
    estadoColor: 'text-blue-500',
  },
];

const MyProductsSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      <DataSideBar />
      <div className="flex flex-col flex-grow ml-[250px]">
       
        <div className="w-full flex items-center justify-between px-8 h-[80px] bg-white">
          <h1 className="text-2xl font-space ">Mis Productos</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="border border-gray-200 rounded-lg px-4 py-2 pl-10 w-64 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primaryRed"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            </div>
            <DesignButton
              variant="primary"
              onClick={() => navigate('/new-product')}
            icon={FaPlus}
            >

              Nuevo Producto
            </DesignButton>
          </div>
        </div>
        <hr className="border-gray-300" />
       
        <div className="w-full px-8 flex items-center justify-between mt-4 mb-2">
          <span className="font-space text-lg">Filtros</span>
          <button className="text-sky-500 text-sm font-space hover:underline">Limpiar filtros</button>
        </div>
        <div className="w-full px-8 py-6 pt-0">
        
          <div className="flex items-end gap-4 mb-2">
            <div className="flex flex-col gap-1 w-40">
              <span className="text-xs text-gray-500 font-space">Estado</span>
              <SelectDefault options={estadoOptions} value={''} />
            </div>
            <div className="flex flex-col gap-1 w-40">
              <span className="text-xs text-gray-500 font-space">Categoría</span>
              <SelectDefault options={categoriaOptions} value={''} />
            </div>
            <div className="flex flex-col gap-1 w-48">
              <span className="text-xs text-gray-500 font-space">Ordenar por</span>
              <SelectDefault options={ordenarOptions} value={'recientes'} />
            </div>
            <div className="flex flex-col gap-1 w-40">
              <span className="text-xs text-gray-500 font-space">Stock</span>
              <SelectDefault options={stockOptions} value={''} />
            </div>
          </div>
     
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
                {productos.map((prod, idx) => (
                  <tr key={prod.sku} className="border-t last:border-b rounded-xl hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="w-[40px] h-[40px] bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400 font-space">60×60</div>
                      <span className="font-space text-sm text-gray-800">{prod.nombre}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-space">{prod.sku}</td>
                    <td className="px-4 py-3 font-space">{prod.precio}</td>
                    <td className="px-4 py-3 font-space">{prod.stock}</td>
                    <td className="px-4 py-3 font-space">
                      <span className={`font-medium ${prod.estadoColor}`}>{prod.estado}</span>
                    </td>
                    <td className="px-4 py-3 font-space">{prod.categoria}</td>
                    <td className="px-4 py-3 font-space">{prod.fecha}</td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <button
                        className="hover:text-primaryRed"
                        onClick={() => navigate('/edit-products')}
                      >
                        <TbEdit className="text-lg text-gray-500" />
                      </button>
                      <button className="hover:text-primaryRed">
                        <FaEyeSlash className="text-lg text-gray-500" />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <FaTrash className="" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProductsSection;
