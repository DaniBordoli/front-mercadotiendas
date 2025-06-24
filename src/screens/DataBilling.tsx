import * as React from 'react';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { colors } from '../design/colors';
import { StatusTags } from '../components/atoms/StatusTags/StatusTags';
import { FaEllipsisV } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { InputDefault } from '../components/atoms/InputDefault/InputDefault';
import { SelectDefault } from '../components/atoms/SelectDefault/SelectDefault';
import { DesignButton } from '../components/atoms/DesignButton/DesignButton';
import { FaDownload } from "react-icons/fa6";
import { FaBell } from 'react-icons/fa';
import { FaFilePdf } from 'react-icons/fa';
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { FaCcAmex, FaEye, FaDownload as FaDownload6 } from "react-icons/fa6";

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

const DataBilling: React.FC = () => {
    const isMobile = useIsMobile();

    const rows = [
        { id: '101', producto: 'Producto X', tienda: 'Tienda A', fecha: '2023-10-05', monto: '$300', medioPago: 'visa', tarjeta: '4242', estado: 'Active' as 'Active' },
        { id: '102', producto: 'Producto Y', tienda: 'Tienda B', fecha: '2023-10-06', monto: '$400', medioPago: 'mastercard', tarjeta: '5555', estado: 'Pending' as 'Pending' },
        { id: '103', producto: 'Producto Z', tienda: 'Tienda C', fecha: '2023-10-07', monto: '$250', medioPago: 'amex', tarjeta: '8888', estado: 'Inactive' as 'Inactive' },
    ];

    return (
        <div className="min-h-screen flex">
            <DataSideBar />
            <div className="flex flex-col flex-grow p-4 md:p-10 md:ml-[250px]">
                <h1 className="text-2xl font-space mb-6 flex items-center justify-between">
                    Facturación
                   
                </h1>
                <div
                    className="p-4 bg-white rounded-md border mb-6 flex flex-col md:flex-row md:items-center md:gap-4 gap-4"
                    style={{ borderColor: colors.lightGray }}
                >
                    <div className="flex flex-col">
                        <label className="text-sm font-space text-gray-600 mb-1">Rango de Fechas</label>
                        <InputDefault type="date" className="w-80" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-space text-gray-600 mb-1">Estado</label>
                        <SelectDefault
                            options={[
                                { value: 'all', label: 'Todos' },
                                { value: 'active', label: 'Active' },
                                { value: 'pending', label: 'Pending' },
                                { value: 'inactive', label: 'Inactive' },
                            ]}
                            placeholder="Todos"
                            className="w-80"
                        />
                    </div>
                    <div className="ml-auto flex gap-4">
                        <DesignButton
                            onClick={() => console.log('Exportar CSV')}
                     
                            variant="neutral"
                             icon={FaDownload}
                            iconPosition="left"
                        >
                            CSV
                        </DesignButton>
                        <DesignButton
                            onClick={() => console.log('Exportar PDF')}
                          
                            variant="primary"
                            icon={FaFilePdf}
                            iconPosition="left"
                        >
                    
                            PDF
                        </DesignButton>
                    </div>
                </div>
                <div
                    className="p-4 bg-white rounded-md border"
                    style={{ borderColor: colors.lightGray, width: '100%' }}
                >
                    <div className="w-full">
                        {!isMobile ? (
                            // Vista Desktop (tabla horizontal)
                            <>
                                <div className="flex text-gray-500 font-space font-medium text-xs md:text-sm border-b pb-2">
                                    <div className="w-1/6">ID Factura</div>
                                    <div className="w-1/6">Producto</div>
                                    <div className="w-1/6">Tienda</div>
                                    <div className="w-1/6">Fecha</div>
                                    <div className="w-1/6">Monto</div>
                                    <div className="w-1/6">Medio de Pago</div>
                                    <div className="w-1/6">Estado</div>
                                    <div className="w-1/6">Acciones</div>
                                </div>
                                {rows.map((row, index) => (
                                    <div key={index} className="flex items-center font-space py-4 border-b text-xs md:text-sm">
                                        <div className="w-1/6">{row.id}</div>
                                        <div className="w-1/6 flex items-center gap-2">
                                            {row.producto}
                                        </div>
                                        <div className="w-1/6">{row.tienda}</div>
                                        <div className="w-1/6">{row.fecha}</div>
                                        <div className="w-1/6">{row.monto}</div>
                                        <div className="w-1/6 flex items-center gap-2">
                                            {row.medioPago === 'visa' && <FaCcVisa />}
                                            {row.medioPago === 'mastercard' && <FaCcMastercard />}
                                            {row.medioPago === 'amex' && <FaCcAmex />}
                                            <span>•••• {row.tarjeta}</span>
                                        </div>
                                        <div className="w-1/6">
                                            <StatusTags status={row.estado} />
                                        </div>
                                        <div className="w-1/6 flex gap-2">
                                            <button
                                                className="font-medium"
                                                style={{ color: colors.primaryRed }}
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                className="font-medium"
                                                style={{ color: colors.primaryRed }}
                                            >
                                                <FaDownload6 />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            // Vista Mobile (tarjetas verticales)
                            <div className="flex flex-col gap-4">
                                {rows.map((row, index) => (
                                    <div key={index} className="border rounded-md p-3 flex flex-col gap-2 font-space text-xs bg-gray-50">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-700">ID Factura:</span>
                                            <span>{row.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-700">Producto:</span>
                                            <span>{row.producto}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-700">Tienda:</span>
                                            <span>{row.tienda}</span>
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
                                            <span className="font-semibold text-gray-700">Medio de Pago:</span>
                                            <span className="flex items-center gap-1">
                                                {row.medioPago === 'visa' && <FaCcVisa />}
                                                {row.medioPago === 'mastercard' && <FaCcMastercard />}
                                                {row.medioPago === 'amex' && <FaCcAmex />}
                                                <span>•••• {row.tarjeta}</span>
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-700">Estado:</span>
                                            <StatusTags status={row.estado} />
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                className="font-medium"
                                                style={{ color: colors.primaryRed }}
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                className="font-medium"
                                                style={{ color: colors.primaryRed }}
                                            >
                                                <FaDownload6 />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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

export default DataBilling;
