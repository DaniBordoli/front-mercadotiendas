import * as React from 'react';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { FaArrowUp } from 'react-icons/fa';
import { FaDollarSign, FaShoppingCart, FaReceipt, FaChartPie } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa6';
import { AiOutlineShop } from 'react-icons/ai';
import { colors } from '../design/colors';
import { StatusTags } from '../components/atoms/StatusTags/StatusTags';
import { FaEllipsisV } from 'react-icons/fa';
import { InputDefault } from '../components/atoms/InputDefault/InputDefault';
import { SelectDefault } from '../components/atoms/SelectDefault/SelectDefault';
import { FaSearch } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';

const DataSalesManagement: React.FC = () => {
    const boxes = [
        { title: 'Ingresos Totales', number: 123, trend: '+8.5%  vs mes anterior', icon: <FaDollarSign />, iconColor: `${colors.primaryRed}1A`, iconTextColor: colors.primaryRed, showTrend: true },
        { title: 'Ventas Totales', number: 456, trend: '+4% vs mes anterior', icon: <FaShoppingCart />, iconColor: `${colors.accentTeal}1A`, iconTextColor: colors.accentTeal, showTrend: true },
        { title: 'Ticket Promedio', number: 789, trend: '-8.5%  vs mes anterior', icon: <FaReceipt />, iconColor: `${colors.primaryRed}1A`, iconTextColor: colors.primaryRed, showTrend: false },
        { title: 'Conversión', number: 101, trend: '+4% vs mes anterior', icon: <FaChartPie />, iconColor: `${colors.accentTeal}1A`, iconTextColor: colors.accentTeal, showTrend: false },
    ];

    return (
        <div className="min-h-screen bg-[#F8F8F8] flex">
            <DataSideBar />
            <div className="flex flex-col flex-grow p-4 md:p-10 md:ml-[250px]">
                <h1 className="text-2xl font-space mb-6 flex items-center justify-between">
                    Gestión de Ventas
                    <div className="flex items-center gap-4">
                        <FaBell className="text-gray-500 cursor-pointer" />
                        <img
                            src="https://placehold.co/40"
                            alt="User"
                            className="w-10 h-10 rounded-full"
                        />
                    </div>
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
                            <div className="text-xl ml-2 font-space mb-1">{box.number}</div>
                            <div className="flex items-center text-sm" style={{ color: box.trend.includes('-') ? colors.primaryRed : colors.accentTeal }}>
                                {box.trend.includes('-') ? <FaArrowUp style={{ transform: 'rotate(180deg)' }} /> : <FaArrowUp />}
                                <span className="ml-1">{box.trend}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div
                    className="p-4 bg-white rounded-md border mt-8"
                    style={{ borderColor: colors.lightGray, width: '100%' }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-space font-medium text-gray-600">Últimas Ventas</h2>
                        <div className="flex gap-5">
                            <InputDefault
                                placeholder="Buscar..."
                                icon={<FaSearch className="text-gray-500" />}
                                className="w-80"
                            />
                            <SelectDefault
                                options={[
                                    { value: '7', label: 'Últimos 7 Días' },
                                    { value: '30', label: 'Últimos 30 Días' },
                                    { value: '90', label: 'Últimos 90 Días' },
                                ]}
                                placeholder="Últimos 30 Días"
                                className="w-44"
                            />
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex text-gray-500 font-space font-medium text-sm border-b pb-2">
                            <div className="w-1/6">ID Orden</div>
                            <div className="w-1/6">Producto</div>
                            <div className="w-1/6">Cliente</div>
                            <div className="w-1/6">Fecha</div>
                            <div className="w-1/6">Monto</div>
                            <div className="w-1/6">Estado</div>
                            <div className="w-1/6">Acciones</div>
                        </div>
                        {[
                            { id: '001', producto: 'Producto A', cliente: 'Juan Pérez', fecha: '2023-10-01', monto: '$100', estado: 'Active' as 'Active' },
                            { id: '002', producto: 'Producto B', cliente: 'Ana Gómez', fecha: '2023-10-02', monto: '$200', estado: 'Pending' as 'Pending' },
                            { id: '003', producto: 'Producto C', cliente: 'Luis Martínez', fecha: '2023-10-03', monto: '$150', estado: 'Inactive' as 'Inactive' },
                        ].map((row, index) => (
                            <div key={index} className="flex items-center text-sm font-space py-4 border-b">
                                <div className="w-1/6">{row.id}</div>
                                <div className="w-1/6">{row.producto}</div>
                                <div className="w-1/6">{row.cliente}</div>
                                <div className="w-1/6">{row.fecha}</div>
                                <div className="w-1/6">{row.monto}</div>
                                <div className="w-1/6">
                                    <StatusTags status={row.estado} />
                                </div>
                                <div className="w-1/6">
                                    <FaEllipsisV className="text-gray-500 cursor-pointer" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-500 font-space">
                            Mostrando 1-10 de 234 resultados
                        </span>
                        <div className="flex gap-2">
                            <button
                                className="border border-gray-300 rounded-md px-3 py-1 text-gray-500 hover:bg-gray-100"
                            >
                                <FaChevronLeft />
                            </button>
                            {[1, 2, 3].map((page) => (
                                <button
                                    key={page}
                                    className="border border-gray-300 rounded-md px-3 py-1 text-gray-500 hover:bg-gray-100"
                                    style={page === 1 ? { backgroundColor: colors.primaryRed, color: 'white' } : {}}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                className="border border-gray-300 rounded-md px-3 py-1 text-gray-500 hover:bg-gray-100"
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataSalesManagement;
