import React, { useState, useEffect } from 'react';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { DesignButton } from '../components/atoms/DesignButton/DesignButton';
import { FaPlus, FaCoins, FaPenToSquare, FaTrash, FaTriangleExclamation } from 'react-icons/fa6';
import { 
  fetchCurrencies, 
  createCurrency, 
  updateCurrency, 
  deleteCurrency,
  Currency 
} from '../stores/slices/authSlice';

const DataCurrency: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState<Currency | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currencyToEdit, setCurrencyToEdit] = useState<Currency | null>(null);

  // Estado para inputs del modal de agregar
  const [newCurrencyName, setNewCurrencyName] = useState('');
  const [newCurrencySymbol, setNewCurrencySymbol] = useState('');
  const [newCurrencyCode, setNewCurrencyCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos al montar el componente
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const currenciesData = await fetchCurrencies();
        setCurrencies(currenciesData);
      } catch (err: any) {
        console.error('Error al cargar monedas:', err);
        alert(err.message || 'Error al cargar las monedas');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Crear moneda
  const handleAddCurrency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCurrencyName.trim() || !newCurrencySymbol.trim() || !newCurrencyCode.trim()) return;
    
    setIsCreating(true);
    try {
      const newCurrency = await createCurrency({
        name: newCurrencyName,
        symbol: newCurrencySymbol,
        code: newCurrencyCode.toUpperCase()
      });
      
      setCurrencies(prev => [...prev, newCurrency]);
      setShowModal(false);
      setNewCurrencyName('');
      setNewCurrencySymbol('');
      setNewCurrencyCode('');
    } catch (err: any) {
      alert(err.message || 'Error al crear la moneda');
    } finally {
      setIsCreating(false);
    }
  };

  // Eliminar moneda
  const handleDeleteCurrency = async () => {
    if (!currencyToDelete) return;
    try {
      await deleteCurrency(currencyToDelete.id);
      setCurrencies(prev => prev.filter(currency => currency.id !== currencyToDelete.id));
      setShowDeleteModal(false);
      setCurrencyToDelete(null);
    } catch (err: any) {
      alert(err.message || 'Error al eliminar la moneda');
    }
  };

  // Editar moneda
  const handleEditCurrency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currencyToEdit) return;
    
    try {
      const updatedCurrency = await updateCurrency(currencyToEdit.id, {
        name: currencyToEdit.name,
        symbol: currencyToEdit.symbol,
        code: currencyToEdit.code
      });
      
      setCurrencies(prev => 
        prev.map(currency => 
          currency.id === currencyToEdit.id ? updatedCurrency : currency
        )
      );
      setEditModalOpen(false);
      setCurrencyToEdit(null);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar la moneda');
    }
  };

  return (
    <div className="flex">
      <DataSideBar />
      <div className="flex-1 min-h-screen pl-0 md:pl-[250px]">
        <div className="p-4 md:p-8">
          {/* Título y resumen fuera de la caja */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h1 className="text-xl font-space">Gestión de Monedas</h1>
            <div className="flex gap-4 text-xs text-gray-400 font-space">
              <span>Total: {currencies.length} monedas</span>
            </div>
          </div>
          <div className="text-xs text-gray-400 mb-6 font-space">
            Dashboard &gt; Panel de administración &gt; Gestión de Monedas
          </div>
          
          {/* Botón arriba a la izquierda */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start mb-4 gap-2">
            <DesignButton
              variant="primary"
              icon={FaPlus}
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto"
            >
              <span className="font-space">Nueva Moneda</span>
            </DesignButton>
          </div>

          {/* Sección principal con título */}
          <div className='my-8'>
            <span className="font-space text-base">Lista de Monedas</span>
          </div>

          <div className="bg-white rounded-lg shadow p-0 min-h-[300px] flex flex-col border">
            <div className="px-4 md:px-8 py-6">
              {isLoading ? (
                <div className="text-center text-gray-400 font-space">Cargando monedas...</div>
              ) : currencies.length === 0 ? (
                <div className="text-center text-gray-400 font-space">No hay monedas registradas.</div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-space text-sm text-gray-500 border-b pb-2">
                    <div>Nombre</div>
                    <div>Símbolo</div>
                    <div>Código</div>
                    <div>Acciones</div>
                  </div>
                  {currencies.map(currency => (
                    <div key={currency.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <FaCoins className="text-[#FF4D4F] text-lg" />
                        <span className="font-space font-medium">{currency.name}</span>
                      </div>
                      <div className="font-space text-2xl font-bold text-gray-700">
                        {currency.symbol}
                      </div>
                      <div className="font-space text-sm bg-gray-100 px-2 py-1 rounded inline-block w-fit">
                        {currency.code}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="text-gray-400 hover:text-[#2563eb] p-1"
                          title="Editar moneda"
                          onClick={() => {
                            setCurrencyToEdit(currency);
                            setEditModalOpen(true);
                          }}
                        >
                          <FaPenToSquare size={16} />
                        </button>
                        <button
                          className="text-gray-400 hover:text-[#FF4D4F] p-1"
                          title="Eliminar moneda"
                          onClick={() => {
                            setCurrencyToDelete(currency);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Modal de agregar */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 md:p-6 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-space">Agregar nueva moneda</h2>
                  <button
                    className="text-gray-400 hover:text-gray-600 text-xl font-space"
                    onClick={() => {
                      setShowModal(false);
                      setNewCurrencyName('');
                      setNewCurrencySymbol('');
                      setNewCurrencyCode('');
                    }}
                  >
                    ×
                  </button>
                </div>
                {/* Form */}
                <form onSubmit={handleAddCurrency}>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 font-space">
                      Nombre de la moneda *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D4F] placeholder-gray-300 font-space"
                      placeholder="Ej: Peso Argentino"
                      value={newCurrencyName}
                      onChange={e => setNewCurrencyName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 font-space">
                      Símbolo *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D4F] placeholder-gray-300 font-space"
                      placeholder="Ej: $, €, £"
                      value={newCurrencySymbol}
                      onChange={e => setNewCurrencySymbol(e.target.value)}
                      maxLength={3}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 font-space">
                      Código ISO *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D4F] placeholder-gray-300 font-space uppercase"
                      placeholder="Ej: ARS, USD, EUR"
                      value={newCurrencyCode}
                      onChange={e => setNewCurrencyCode(e.target.value.toUpperCase())}
                      maxLength={3}
                      required
                    />
                    <div className="text-xs text-gray-400 mt-1 font-space">
                      Código de 3 letras según estándar ISO 4217
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                    <DesignButton
                      variant="neutral"
                      onClick={() => {
                        setShowModal(false);
                        setNewCurrencyName('');
                        setNewCurrencySymbol('');
                        setNewCurrencyCode('');
                      }}
                      type="button"
                      disabled={isCreating}
                      className="w-full sm:w-auto"
                    >
                      <span className="font-space">Cancelar</span>
                    </DesignButton>
                    <DesignButton 
                      variant="primary" 
                      type="submit" 
                      loading={isCreating} 
                      className="w-full sm:w-auto"
                    >
                      <span className="font-space">Crear Moneda</span>
                    </DesignButton>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal de eliminar */}
          {showDeleteModal && currencyToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 md:p-6 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-space">Eliminar moneda</h2>
                  <button
                    className="text-gray-400 hover:text-gray-600 text-xl font-space"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setCurrencyToDelete(null);
                    }}
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
                        ¿Estás seguro que deseas eliminar la moneda "{currencyToDelete.name}"?
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 font-space">
                      Esta acción no se puede deshacer. La moneda será eliminada permanentemente del sistema.
                    </div>
                  </div>
                </div>
                {/* Botones */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                  <DesignButton
                    variant="neutral"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setCurrencyToDelete(null);
                    }}
                    className="w-full sm:w-auto"
                  >
                    <span className="font-space">Cancelar</span>
                  </DesignButton>
                  <DesignButton
                    variant="primary"
                    onClick={handleDeleteCurrency}
                    className="w-full sm:w-auto"
                  >
                    <span className="font-space">Eliminar</span>
                  </DesignButton>
                </div>
              </div>
            </div>
          )}

          {/* Modal de editar */}
          {editModalOpen && currencyToEdit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 md:p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-space">Editar moneda</h2>
                  <button
                    className="text-gray-400 hover:text-gray-600 text-xl font-space"
                    onClick={() => { 
                      setEditModalOpen(false); 
                      setCurrencyToEdit(null); 
                    }}
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleEditCurrency}>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 font-space">Nombre *</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D4F] placeholder-gray-300 font-space"
                      value={currencyToEdit.name}
                      onChange={e => setCurrencyToEdit(prev => prev ? { ...prev, name: e.target.value } : null)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 font-space">Símbolo *</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D4F] placeholder-gray-300 font-space"
                      value={currencyToEdit.symbol}
                      onChange={e => setCurrencyToEdit(prev => prev ? { ...prev, symbol: e.target.value } : null)}
                      maxLength={3}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 font-space">Código ISO *</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D4F] placeholder-gray-300 font-space uppercase"
                      value={currencyToEdit.code}
                      onChange={e => setCurrencyToEdit(prev => prev ? { ...prev, code: e.target.value.toUpperCase() } : null)}
                      maxLength={3}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <DesignButton
                      variant="neutral"
                      type="button"
                      onClick={() => { 
                        setEditModalOpen(false); 
                        setCurrencyToEdit(null); 
                      }}
                    >
                      <span className="font-space">Cancelar</span>
                    </DesignButton>
                    <DesignButton
                      variant="primary"
                      type="submit"
                    >
                      <span className="font-space">Guardar</span>
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

export default DataCurrency;
