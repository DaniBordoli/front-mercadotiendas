import React, { useState, useEffect } from 'react';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { DesignButton } from '../components/atoms/DesignButton/DesignButton';
import { FaPlus, FaRegImage, FaBox, FaPenToSquare, FaTrash, FaChevronDown, FaChevronRight, FaTriangleExclamation } from 'react-icons/fa6';
import { updateCategory, fetchCategories, createCategory, deleteCategory } from '../stores/slices/authSlice';
import { getStorageItem } from '../utils/storage';

// Máximo de categorías principales y subcategorías
const MAX_CATEGORIES = 4;

function buildCategoryTree(categories: any[]) {
  const map: Record<string, any> = {};
  const roots: any[] = [];
  categories.forEach(cat => {
    map[cat._id] = { ...cat, id: cat._id, icon: FaBox, children: [] };
  });
  categories.forEach(cat => {
    if (cat.parent) {
      if (map[cat.parent]) {
        map[cat.parent].children.push(map[cat._id]);
      }
    } else {
      roots.push(map[cat._id]);
    }
  });
  return roots;
}

const CollapsibleCategory: React.FC<{
  cat: any;
  onDelete: (cat: any) => void;
  onAddSubcategory: (parentCat: any) => void;
  onEdit: (cat: any) => void;
}> = ({ cat, onDelete, onAddSubcategory, onEdit }) => {
  const [open, setOpen] = useState(true);
  const hasChildren = cat.children && cat.children.length > 0;
  const maxSubcats = cat.children && cat.children.length >= MAX_CATEGORIES;
  return (
    <div>
      <div className={`flex items-center py-2`}>
        <button
          type="button"
          className="mr-2 text-gray-300 focus:outline-none"
          style={{ minWidth: 24 }}
          onClick={() => hasChildren && setOpen((v) => !v)}
          tabIndex={hasChildren ? 0 : -1}
        >
          {hasChildren ? (
            open ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />
          ) : (
            <span style={{ width: 14, display: 'inline-block' }} />
          )}
        </button>
        <cat.icon className="text-[#FF4D4F] mr-2" />
        <span className="font-space mr-2">{cat.name}</span>
        <div className="ml-auto flex gap-2">
          <button
            className={`text-gray-400 hover:text-[#2563eb] ${maxSubcats ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Agregar subcategoría"
            onClick={() => !maxSubcats && onAddSubcategory(cat)}
            disabled={maxSubcats}
          >
            <FaPlus size={16} />
          </button>
          <button className="text-gray-400 hover:text-[#FF4D4F]" onClick={() => onEdit(cat)}>
            <FaPenToSquare size={16} />
          </button>
          <button
            className="text-gray-400 hover:text-[#FF4D4F]"
            onClick={() => onDelete(cat)}
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>
      {hasChildren && open && (
        <div>
          {cat.children.map((child: any) => (
            <div key={child.id} className="pl-8">
              <CollapsibleCategory cat={child} onDelete={onDelete} onAddSubcategory={onAddSubcategory} onEdit={onEdit} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DataCatalog: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);

  // Estado para radio buttons del modal de eliminar
  const [productAction, setProductAction] = useState<'move' | 'delete'>('move');
  const [subcategoryAction, setSubcategoryAction] = useState<'move' | 'delete'>('move');
  const [productTarget, setProductTarget] = useState('');
  const [subcategoryTarget, setSubcategoryTarget] = useState('');

  // Estado para inputs del modal de agregar
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Nuevo estado para subcategoría
  const [parentCategory, setParentCategory] = useState<any>(null);

  // Opciones de categorías destino 
  const categoryOptions = categories.map(cat => ({ id: cat.id, name: cat.name }));

  // Contar cuántas subcategorías tiene el parent actual
  const parentSubcategoryCount = parentCategory ? (parentCategory.children?.length || 0) : 0;

  // Fetch categories on mount
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const flat = await fetchCategories();
        setCategories(buildCategoryTree(flat));
      } catch (err: any) {
        alert(err.message || 'Error al obtener categorías');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Crear categoría usando la API real
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsCreating(true);
    try {
      const newCat = await createCategory({
        name: newCategoryName,
        description: newCategoryDesc,
        status: 'Pending',
        parent: parentCategory ? parentCategory.id : undefined,
        // image: ... (no se maneja aquí)
      });
      const flat = await fetchCategories();
      setCategories(buildCategoryTree(flat));
      setShowModal(false);
      setNewCategoryName('');
      setNewCategoryDesc('');
      setNewCategoryImage(null);
      setParentCategory(null);
    } catch (err: any) {
      alert(err.message || 'Error al crear la categoría');
    } finally {
      setIsCreating(false);
    }
  };

  // Eliminar categoría usando la API real
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.id);
      const flat = await fetchCategories();
      setCategories(buildCategoryTree(flat));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (err: any) {
      alert(err.message || 'Error al eliminar la categoría');
    }
  };

  return (
    <div className="flex">
      <DataSideBar />
      <div className="flex-1 min-h-screen pl-0 md:pl-[250px]">
        <div className="p-4 md:p-8">
          {/* Título y resumen fuera de la caja */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h1 className="text-xl font-space">Gestión de Categorías</h1>
            <div className="flex gap-4 text-xs text-gray-400 font-space">
              <span>Total: {categories.length} categorías</span>
              {/* Subcategorías: suma todos los hijos */}
              <span>
                {categories.reduce((acc, cat) => acc + (cat.children?.length || 0), 0)} subcategorías
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-400 mb-6 font-space">
            Dashboard &gt; Catálogo &gt; Gestión de Categorías
          </div>
          {/* Botón arriba a la izquierda */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start mb-4 gap-2">
            <DesignButton
              variant="primary"
              icon={FaPlus}
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto"
              disabled={categories.length >= MAX_CATEGORIES}
            >
              <span className="font-space">Nueva Categoría</span>
            </DesignButton>
            {categories.length >= MAX_CATEGORIES && (
              <span className="text-xs text-red-500 font-space ml-2">Máximo 4 categorías principales</span>
            )}
          </div>
          {/* Sección principal con título */}
          <div className='my-8'>
            <span className="font-space text-base">Árbol de Categorías</span>
          </div>
          <div className="bg-white rounded-lg shadow p-0 min-h-[300px] flex flex-col border">
            <div className="px-4 md:px-8 py-6">
              {isLoading ? (
                <div className="text-center text-gray-400 font-space">Cargando categorías...</div>
              ) : categories.length === 0 ? (
                <div className="text-center text-gray-400 font-space">No hay categorías registradas.</div>
              ) : (
                categories.map(cat => (
                  <CollapsibleCategory
                    key={cat.id}
                    cat={cat}
                    onDelete={(cat) => {
                      setCategoryToDelete(cat);
                      setShowDeleteModal(true);
                    }}
                    onAddSubcategory={(parentCat) => {
                      setParentCategory(parentCat);
                      setShowModal(true);
                    }}
                    onEdit={(cat) => {
                      setCategoryToEdit(cat);
                      setEditModalOpen(true);
                    }}
                  />
                ))
              )}
            </div>
          </div>
          {/* Modal de agregar */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 md:p-6 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-space">
                    {parentCategory
                      ? <>Agregar subcategoría a <span className="text-[#2563eb]">{parentCategory.name}</span></>
                      : 'Agregar categoría'}
                  </h2>
                  <button
                    className="text-gray-400 hover:text-gray-600 text-xl font-space"
                    onClick={() => {
                      setShowModal(false);
                      setParentCategory(null);
                    }}
                  >
                    ×
                  </button>
                </div>
                {/* Form */}
                <form onSubmit={handleAddCategory}>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 font-space">
                      Nombre de la {parentCategory ? 'subcategoría' : 'categoría'}
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D4F] placeholder-gray-300 font-space"
                      placeholder={`Ingresa el nombre de la ${parentCategory ? 'subcategoría' : 'categoría'}`}
                      value={newCategoryName}
                      onChange={e => setNewCategoryName(e.target.value)}
                      disabled={parentCategory ? parentSubcategoryCount >= MAX_CATEGORIES : false}
                    />
                    {parentCategory && parentSubcategoryCount >= MAX_CATEGORIES && (
                      <span className="text-xs text-red-500 font-space">Máximo 4 subcategorías por categoría</span>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 font-space">
                      Descripción (opcional)
                    </label>
                    <textarea
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D4F] placeholder-gray-300 resize-none font-space"
                      placeholder="Describe brevemente esta categoría"
                      rows={2}
                      value={newCategoryDesc}
                      onChange={e => setNewCategoryDesc(e.target.value)}
                    />
             
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                    <DesignButton
                      variant="neutral"
                      onClick={() => {
                        setShowModal(false);
                        setNewCategoryName('');
                        setNewCategoryDesc('');
                        setNewCategoryImage(null);
                        setParentCategory(null);
                      }}
                      type="button"
                      disabled={isCreating}
                      className="w-full sm:w-auto"
                    >
                      <span className="font-space">Cancelar</span>
                    </DesignButton>
                    <DesignButton variant="primary" type="submit" loading={isCreating} className="w-full sm:w-auto" disabled={parentCategory ? parentSubcategoryCount >= MAX_CATEGORIES : false}>
                      <span className="font-space">Aceptar</span>
                    </DesignButton>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Modal de eliminar */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 md:p-6 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-space">Eliminar categoría</h2>
                  <button
                    className="text-gray-400 hover:text-gray-600 text-xl font-space"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    ×
                  </button>
                </div>
                {/* Alerta */}
                <div className="flex items-start gap-3 mb-4">
                  <span
                    className="mt-1 flex items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: 'rgba(255,79,65,0.10)',
                      width: 58,
                      height: 48,
                    }}
                  >
                    <FaTriangleExclamation className="text-[#FF4D4F] text-2xl" />
                  </span>
                  <div>
                    <div className="font-space text-sm mb-1">
                      <span className="text-[#FF4D4F] font-space">
                        ¿Estás seguro que deseas eliminar la categoría {categoryToDelete?.name}?
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 font-space">
                      Esta acción no se puede deshacer. La categoría contiene 8 productos y 3 subcategorías.
                    </div>
                  </div>
                </div>
                {/* Productos asociados */}
                <div className="mb-4">
                  <div className="font-space text-sm mb-2">¿Qué deseas hacer con los productos asociados?</div>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center font-space text-sm">
                      <input
                        type="radio"
                        className="accent-[#2563eb] mr-2"
                        checked={productAction === 'move'}
                        onChange={() => setProductAction('move')}
                      />
                      Mover a otra categoría
                    </label>
                    {productAction === 'move' && (
                      <select
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm font-space mb-1"
                        value={productTarget}
                        onChange={e => setProductTarget(e.target.value)}
                      >
                        <option value="">Seleccionar categoría destino</option>
                        {categoryOptions
                          .filter(opt => opt.id !== categoryToDelete?.id)
                          .map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                          ))}
                      </select>
                    )}
                    <label className="flex items-center font-space text-sm">
                      <input
                        type="radio"
                        className="accent-[#2563eb] mr-2"
                        checked={productAction === 'delete'}
                        onChange={() => setProductAction('delete')}
                      />
                      Eliminar todos los productos asociados
                    </label>
                  </div>
                </div>
                {/* Subcategorías */}
                <div className="mb-4">
                  <div className="font-space text-sm mb-2">¿Qué deseas hacer con las subcategorías?</div>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center font-space text-sm">
                      <input
                        type="radio"
                        className="accent-[#2563eb] mr-2"
                        checked={subcategoryAction === 'move'}
                        onChange={() => setSubcategoryAction('move')}
                      />
                      Mover a otra categoría
                    </label>
                    {subcategoryAction === 'move' && (
                      <select
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm font-space mb-1"
                        value={subcategoryTarget}
                        onChange={e => setSubcategoryTarget(e.target.value)}
                      >
                        <option value="">Seleccionar categoría destino</option>
                        {categoryOptions
                          .filter(opt => opt.id !== categoryToDelete?.id)
                          .map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                          ))}
                      </select>
                    )}
                    <label className="flex items-center font-space text-sm">
                      <input
                        type="radio"
                        className="accent-[#2563eb] mr-2"
                        checked={subcategoryAction === 'delete'}
                        onChange={() => setSubcategoryAction('delete')}
                      />
                      Eliminar todas las subcategorías
                    </label>
                  </div>
                </div>
                {/* Botones */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                  <DesignButton
                    variant="neutral"
                    onClick={() => setShowDeleteModal(false)}
                    className="w-full sm:w-auto"
                  >
                    <span className="font-space">Cancelar</span>
                  </DesignButton>
                  <DesignButton
                    variant="primary"
                    onClick={handleDeleteCategory}
                    className="w-full sm:w-auto"
                  >
                    <span className="font-space">Eliminar</span>
                  </DesignButton>
                </div>
              </div>
            </div>
          )}
          {/* Modal de editar */}
          {editModalOpen && categoryToEdit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 md:p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-space">Editar categoría</h2>
                  <button
                    className="text-gray-400 hover:text-gray-600 text-xl font-space"
                    onClick={() => { setEditModalOpen(false); setCategoryToEdit(null); }}
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await updateCategory(categoryToEdit.id, { name: categoryToEdit.name, description: categoryToEdit.description });
                    const flat = await fetchCategories();
                    setCategories(buildCategoryTree(flat));
                    setEditModalOpen(false);
                    setCategoryToEdit(null);
                  } catch (err: any) {
                    alert(err.message || 'Error al actualizar la categoría');
                  }
                }}>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 font-space">Nombre</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D4F] placeholder-gray-300 font-space"
                      value={categoryToEdit.name}
                      onChange={e => setCategoryToEdit((prev: any) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 font-space">Descripción</label>
                    <textarea
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D4F] placeholder-gray-300 font-space"
                      value={categoryToEdit.description}
                      onChange={e => setCategoryToEdit((prev: any) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <DesignButton
                      variant="neutral"
                      type="button"
                      onClick={() => { setEditModalOpen(false); setCategoryToEdit(null); }}
                    >
                      Cancelar
                    </DesignButton>
                    <DesignButton
                      variant="primary"
                      type="submit"
                    >
                      Guardar
                    </DesignButton>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataCatalog;
