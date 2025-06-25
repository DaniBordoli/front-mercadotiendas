import React from 'react';
import { StatusTags } from '../components/atoms/StatusTags/StatusTags';
import { FaArrowUp } from 'react-icons/fa';
import { FaDollarSign } from 'react-icons/fa6';
import { FaBox } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa6';
import { AiOutlineShop } from 'react-icons/ai';
import { colors } from '../design/colors';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { FaBell } from 'react-icons/fa';
import { useAuthStore } from '../stores';

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

const DataDashboard: React.FC = () => {
    const fetchProducts = useAuthStore(state => state.fetchProducts);
    const [productCount, setProductCount] = React.useState<number>(0);
    const [prevProductCount, setPrevProductCount] = React.useState<number>(0);
    const [productTrend, setProductTrend] = React.useState<string>('');

    React.useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await fetchProducts();
                setPrevProductCount(productCount); // Guarda el anterior antes de actualizar
                setProductCount(products.length);
            } catch {
                setPrevProductCount(productCount);
                setProductCount(0);
            }
        };
        loadProducts();
        // eslint-disable-next-line
    }, [fetchProducts]);

    React.useEffect(() => {
        const diff = productCount - prevProductCount;
        if (diff > 0) {
            setProductTrend(`+${diff} este mes`);
        } else {
            setProductTrend('');
        }
    }, [productCount, prevProductCount]);

    const boxes = [
        { title: 'Ventas Totales', number: 123, trend: '+15% este mes', icon: <FaDollarSign />, iconColor: `${colors.primaryRed}1A`, iconTextColor: colors.primaryRed, showTrend: true },
        { title: 'Productos Activos', number: productCount, trend: productTrend, icon: <FaBox />, iconColor: `${colors.accentTeal}1A`, iconTextColor: colors.accentTeal, showTrend: !!productTrend },
        { title: 'Pedidos Pendientes', number: 789, status: 'Active', icon: <FaClock />, iconColor: `${colors.primaryRed}1A`, iconTextColor: colors.primaryRed, showTrend: false },
        { title: 'Estado Tienda', number: 101, status: 'Pending', icon: <AiOutlineShop />, iconColor: `${colors.accentTeal}1A`, iconTextColor: colors.accentTeal, showTrend: false },
    ];

    const isMobile = useIsMobile();

    const rows = [
        { producto: 'Producto A', cliente: 'Juan Pérez', fecha: '2023-10-01', monto: '$100', estado: 'Active' },
        { producto: 'Producto B', cliente: 'Ana Gómez', fecha: '2023-10-02', monto: '$200', estado: 'Pending' },
        { producto: 'Producto C', cliente: 'Luis Martínez', fecha: '2023-10-03', monto: '$150', estado: 'Inactive' },
    ];

    return (
        <div className="min-h-screen flex">
        <DataSideBar />
        <div className="flex flex-col flex-grow p-10 md:ml-[250px]">
            <h1 className="text-2xl font-space mb-6 flex items-center justify-between">
                Dashboard
                
            </h1>
                <div className="flex flex-wrap gap-4 justify-center">
                    {boxes.map((box, index) => (
                        <div
                            key={index}
                            className="p-3 bg-white rounded-md flex flex-col border" 
                            style={{ width: '250px', height: '150px', borderColor: colors.lightGray }} 
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="ml-2 text-gray-600 font-light font-space font-medium">{box.title}</h2>
                                <div
                                    className="w-8 h-8 rounded-md flex items-center justify-center"
                                    style={{ backgroundColor: box.iconColor }} 
                                >
                                    <div style={{ color: box.iconTextColor }}>{box.icon}</div> 
                                </div>
                            </div>
                            <div className="text-xl font-space mb-1">{box.number}</div>
                            {box.showTrend ? (
                                <div className="flex items-center text-sm" style={{ color: colors.accentTeal }}> 
                                    <FaArrowUp />
                                    <span className="ml-1">{box.trend}</span>
                                </div>
                            ) : (
                                <StatusTags status={box.status as 'Active' | 'Pending' | 'Inactive'} className="w-20" />
                            )}
                        </div>
                    ))}
                </div>
              
                <div
                    className="p-4 bg-white rounded-md border mt-8"
                    style={{ borderColor: colors.lightGray, width: '100%' }} 
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-space font-medium text-gray-600">Actividad Reciente</h2>
                        <span className="text-sm font-space font-medium" style={{ color: colors.primaryRed, cursor: 'pointer' }}>
                            Ver todo
                        </span>
                    </div>
                    <div className="w-full">
                        {!isMobile ? (
                            <>
                                <div className="flex text-gray-500 font-space font-medium text-sm border-b pb-2">
                                    <div className="w-1/5">Producto</div>
                                    <div className="w-1/5">Cliente</div>
                                    <div className="w-1/5">Fecha</div>
                                    <div className="w-1/5">Monto</div>
                                    <div className="w-1/5">Estado</div>
                                </div>
                                {rows.map((row, index) => (
                                    <div key={index} className="flex items-center text-sm font-space py-4 border-b">
                                        <div className="w-1/5">{row.producto}</div>
                                        <div className="w-1/5">{row.cliente}</div>
                                        <div className="w-1/5">{row.fecha}</div>
                                        <div className="w-1/5">{row.monto}</div>
                                        <div className="w-1/5">
                                            <StatusTags status={row.estado as 'Active' | 'Pending' | 'Inactive'} />
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {rows.map((row, index) => (
                                    <div key={index} className="border rounded-md p-3 flex flex-col gap-2 font-space text-xs bg-gray-50">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-700">Producto:</span>
                                            <span>{row.producto}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-700">Cliente:</span>
                                            <span>{row.cliente}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-700">Fecha:</span>
                                            <span>{row.fecha}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-700">Monto:</span>
                                            <span>{row.monto}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-700">Estado:</span>
                                            <StatusTags status={row.estado as 'Active' | 'Pending' | 'Inactive'} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataDashboard;
