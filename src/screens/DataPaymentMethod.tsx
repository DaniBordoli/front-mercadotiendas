import * as React from 'react';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { colors } from '../design/colors';
import { DesignButton } from '../components/atoms/DesignButton/DesignButton';
import { FaQuestionCircle } from 'react-icons/fa';
import axios from 'axios';

// Hook para detectar mobile
function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth <= breakpoint);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);
    return isMobile;
}

interface PaymentMethodCard {
    id: string;
    name: string;
    image: string;
    commission: string;
    accreditation: string;
    isActive: boolean;
    isRecommended?: boolean;
}

// Declarar paymentMethods antes de los useState
const paymentMethods: PaymentMethodCard[] = [
    {
        id: 'mobbex',
        name: 'Mobbex',
        image: 'https://8700267.fs1.hubspotusercontent-na1.net/hubfs/8700267/MicrosoftTeams-image%20(22).png',
        commission: 'Variable',
        accreditation: 'Variable',
        isActive: false
    },
    {
        id: 'cash',
        name: 'Efectivo',
        image: 'https://png.pngtree.com/png-vector/20191018/ourmid/pngtree-stack-of-money-icon-cartoon-style-png-image_1818237.jpg',
        commission: '0%',
        accreditation: 'Manual',
        isActive: true
    },
    {
        id: 'transfer',
        name: 'Depósito/Transferencia',
        image: 'https://pngimg.com/d/bank_PNG5.png',
        commission: '0%',
        accreditation: 'Manual',
        isActive: false
    },
    {
        id: 'agreement',
        name: 'Acordar',
        image: 'https://www.pngmart.com/files/15/Vector-Business-Handshake-PNG-Photos.png',
        commission: 'A convenir',
        accreditation: 'A convenir',
        isActive: true
    }
];

const DataPaymentMethod: React.FC = () => {
    const isMobile = useIsMobile();

    // Estado para mostrar el formulario de Mobbex
    const [showMobbexForm, setShowMobbexForm] = React.useState(false);
    const [mobbexApiKey, setMobbexApiKey] = React.useState('');
    const [mobbexAccessToken, setMobbexAccessToken] = React.useState('');
    const [loadingMobbex, setLoadingMobbex] = React.useState(false);
    const [mobbexError, setMobbexError] = React.useState('');
    const [paymentMethodsState, setPaymentMethodsState] = React.useState(paymentMethods);
    const [popup, setPopup] = React.useState<Window | null>(null);
    const popupListenerRef = React.useRef<any>(null);

    // Simulación: obtener shopId del usuario autenticado (ajustar según tu auth real)
    // const shopId = localStorage.getItem('shopId'); // O de tu contexto/auth
    const userStr = localStorage.getItem('mercadotiendas_user');
    const user = userStr ? JSON.parse(userStr) : null;
    const shopId = user?.shop?._id;
    const token = localStorage.getItem('mercadotiendas_token');

    React.useEffect(() => {
        console.log('shopId:', shopId, 'token:', token); // Depuración
        const fetchShop = async () => {
            try {
                if (!shopId || !token) {
                    console.log('No hay shopId o token, no se hace la petición');
                    return;
                }
                console.log('Haciendo petición a /api/shops/' + shopId);
                const res = await axios.get(`/api/shops/${shopId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Respuesta de /api/shops/:shopId:', res.data);
                const shop = (res.data as any).data.shop;
                setPaymentMethodsState(prev =>
                    prev.map(m =>
                        m.id === 'mobbex'
                            ? { ...m, isActive: !!(shop && shop.mobbexApiKey && shop.mobbexAccessToken) }
                            : m
                    )
                );
            } catch (err) {
                console.error('Error al obtener la tienda:', err);
            }
        };
        fetchShop();
    }, [shopId, token]);

    const handleToggleMethod = async (methodId: string) => {
        if (methodId === 'mobbex') {
            // Si está inactivo, mostrar el formulario
            const mobbexMethod = paymentMethodsState.find(m => m.id === 'mobbex');
            if (mobbexMethod && !mobbexMethod.isActive) {
                setShowMobbexForm(true);
                setMobbexError('');
                return;
            } else {
                // Si está activo, desactivar directamente
                setPaymentMethodsState(prev => prev.map(m => m.id === 'mobbex' ? { ...m, isActive: false } : m));
                setShowMobbexForm(false);
                return;
            }
        }
        // Otros métodos: activar/desactivar directo
        setPaymentMethodsState(prev => prev.map(m => m.id === methodId ? { ...m, isActive: !m.isActive } : m));
    };

    const handleSaveMobbexCredentials = async () => {
        setLoadingMobbex(true);
        setMobbexError('');
        try {
            if (!mobbexApiKey || !mobbexAccessToken) {
                setMobbexError('Debes completar ambos campos.');
                setLoadingMobbex(false);
                return;
            }
            // Llamada al backend
            await axios.put(`/api/shops/${shopId}/mobbex-credentials`, {
                mobbexApiKey,
                mobbexAccessToken
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Marcar método como activo y ocultar formulario
            setPaymentMethodsState(prev => prev.map(m => m.id === 'mobbex' ? { ...m, isActive: true } : m));
            setShowMobbexForm(false);
            setMobbexApiKey('');
            setMobbexAccessToken('');
        } catch (err: any) {
            setMobbexError(err?.response?.data?.message || 'Error al guardar credenciales.');
        } finally {
            setLoadingMobbex(false);
        }
    };

    // Manejar el flujo Dev Connect
    const handleConnectMobbex = async () => {
        setMobbexError('');
        try {
            // 1. Solicitar la URL de conexión al backend
            const returnUrl = window.location.origin + '/mobbex-return-bridge.html';
            const res = await axios.post('/api/payments/mobbex-connect-url', { returnUrl }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { connectUrl, connectId } = (res.data as any).data;
            // 2. Abrir el popup
            const width = 500, height = 700;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;
            const popupWindow = window.open(connectUrl, 'MobbexConnect', `width=${width},height=${height},left=${left},top=${top}`);
            setPopup(popupWindow);
            // 3. Escuchar el mensaje de retorno
            if (popupListenerRef.current) window.removeEventListener('message', popupListenerRef.current);
            popupListenerRef.current = async (event: MessageEvent) => {
                if (event.origin !== window.location.origin) return;
                if (event.data && event.data.type === 'mobbex-connect-done' && event.data.connectId) {
                    // 4. Obtener credenciales del backend
                    try {
                        const credRes = await axios.get(`/api/payments/mobbex-credentials?connectId=${event.data.connectId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const { apiKey, accessToken } = (credRes.data as any).data;
                        setMobbexApiKey(apiKey);
                        setMobbexAccessToken(accessToken);
                        setShowMobbexForm(true);
                        setMobbexError('');
                        if (popupWindow) popupWindow.close();
                    } catch (err: any) {
                        setMobbexError('No se pudieron obtener las credenciales de Mobbex.');
                    }
                }
            };
            window.addEventListener('message', popupListenerRef.current);
        } catch (err: any) {
            setMobbexError('No se pudo iniciar la conexión con Mobbex.');
        }
    };

    return (
        <div className="min-h-screen flex">
            <DataSideBar />
            <div className="flex flex-col flex-grow p-4 md:p-10 md:ml-[250px]">
                <h1 className="text-2xl font-space mb-6">
                    Métodos de Pago
                </h1>
                
                <p className="text-gray-600 mb-8 font-space">
                    Configura los métodos de pago disponibles para tu tienda. Activa o desactiva según tus necesidades.
                </p>

                <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                    {paymentMethodsState.map((method) => (
                        <div
                            key={method.id}
                            className="bg-white rounded-lg border p-6 relative hover:shadow-md transition-shadow"
                            style={{ borderColor: colors.lightGray }}
                        >
                            {/* Badge de recomendado */}
                            {method.isRecommended && (
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-space">
                                    Recomendado
                                </div>
                            )}

                            {/* Imagen del método de pago */}
                            <div className="flex flex-col items-center mb-4">
                                <h3 className="text-lg font-space font-medium text-gray-800 mb-3">
                                    {method.name}
                                </h3>
                                <img 
                                    src={method.image} 
                                    alt={method.name}
                                    className="h-16 w-auto object-contain rounded"
                                />
                            </div>

                            {/* Información */}
                            <div className="space-y-3 mb-6">
                                {/* Comisión */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-space text-gray-700">Comisión</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-space font-medium">{method.commission}</span>
                                        <FaQuestionCircle 
                                            className="text-gray-400 text-xs cursor-help" 
                                            title="Información sobre la comisión"
                                        />
                                    </div>
                                </div>

                                {/* Acreditación */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-space text-gray-700">Acreditación</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-space font-medium">{method.accreditation}</span>
                                        <FaQuestionCircle 
                                            className="text-gray-400 text-xs cursor-help" 
                                            title="Información sobre la acreditación"
                                        />
                                    </div>
                                </div>

                                {/* Estado */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-space text-gray-700">Estado</span>
                                    <span className={`text-sm font-space font-medium ${
                                        method.isActive ? 'text-green-600' : 'text-gray-500'
                                    }`}>
                                        {method.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>

                            {/* Botón y formulario para Mobbex */}
                            {method.id === 'mobbex' && showMobbexForm && !method.isActive ? (
                                <div className="mb-4">
                                    <div className="mb-2">
                                        <label className="block text-sm font-space text-gray-700 mb-1">API Key</label>
                                        <input
                                            type="text"
                                            className="w-full border rounded px-3 py-2 text-sm font-space focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            value={mobbexApiKey}
                                            onChange={e => setMobbexApiKey(e.target.value)}
                                            placeholder="Ingresa tu API Key de Mobbex"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-sm font-space text-gray-700 mb-1">Access Token</label>
                                        <input
                                            type="text"
                                            className="w-full border rounded px-3 py-2 text-sm font-space focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            value={mobbexAccessToken}
                                            onChange={e => setMobbexAccessToken(e.target.value)}
                                            placeholder="Ingresa tu Access Token de Mobbex"
                                        />
                                    </div>
                                    <button
                                        className="mb-2 text-xs text-blue-600 underline font-space w-full"
                                        type="button"
                                        onClick={handleConnectMobbex}
                                    >
                                        Conectar con Mobbex (crear o vincular cuenta)
                                    </button>
                                    {mobbexError && <div className="text-red-600 text-xs mb-2 font-space">{mobbexError}</div>}
                                    <DesignButton
                                        variant="primary"
                                        fullWidth
                                        onClick={handleSaveMobbexCredentials}
                                        disabled={loadingMobbex}
                                    >
                                        {loadingMobbex ? 'Guardando...' : 'Guardar y Activar'}
                                    </DesignButton>
                                    <button
                                        className="mt-2 text-xs text-gray-500 underline font-space w-full"
                                        onClick={() => setShowMobbexForm(false)}
                                        type="button"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            ) : (
                                <DesignButton
                                    variant={method.isActive ? "neutral" : "primary"}
                                    fullWidth
                                    onClick={() => handleToggleMethod(method.id)}
                                >
                                    {method.isActive ? 'Desactivar' : 'Activar'}
                                </DesignButton>
                            )}
                        </div>
                    ))}
                </div>

                {/* Información adicional */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <FaQuestionCircle className="text-blue-500 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-space font-medium text-blue-900 mb-2">
                                Información importante
                            </h3>
                            <p className="text-sm text-blue-800 font-space">
                                Los métodos de pago activos aparecerán disponibles para tus clientes al momento de realizar una compra. 
                                Puedes activar múltiples métodos de pago para ofrecer más opciones a tus clientes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataPaymentMethod;
