import * as React from 'react';
import { colors } from '../../../design/colors';
import { DesignButton } from '../../atoms/DesignButton/DesignButton';
import { FaEdit, FaRegUser, FaRegHeart , FaTruck , FaRegStar, FaRegCreditCard , FaRegMap} from 'react-icons/fa';
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { FaRegClock } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
const SideMenuProfile: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div 
            className="w-[288px] mt-24 bg-white rounded-md shadow-md p-6"
            style={{ minHeight: '716px', height: 'auto' }}
        >
            <div className="flex flex-col items-center mb-6">
               
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img 
                        src="https://placehold.co/100x100" 
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
                
               
                <h3 className="font-space text-lg font-medium text-gray-800">
                    Ana García
                </h3>
                <p className="font-space text-sm text-gray-500 mt-1">
                    ana.garcia@email.com
                </p>
                
               
                <div className="w-full mt-6 flex justify-center">
                    <DesignButton 
                        variant="primary"
                        icon={FaEdit}
                        iconPosition="left"
                        fullWidth={true}
                    >
                        Editar Perfil
                    </DesignButton>
                </div>
                
                
                <div className="w-full mt-8">
                    <ul className="space-y-5">
                        <li className="flex items-center ml-2 cursor-pointer">
                            <FaRegUser className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Información Personal</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer">
                            <FaRegClock className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Historial de Compras</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer">
                            <FaRegHeart className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Favoritos</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer">
                            <FaTruck  className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Seguimiento</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer">
                            <FaRegStar  className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Reputación</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer">
                            <FaRegCreditCard  className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Métodos de Pago</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer">
                            <FaRegMap className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Direcciones</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer">
                            <HiOutlineQuestionMarkCircle className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Configuración</span>
                        </li>
                        <li 
                            className="flex items-center ml-2 cursor-pointer"
                            onClick={() => navigate('/first-template')}
                        >
                            <HiOutlineQuestionMarkCircle className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Template</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer">
                            <HiOutlineQuestionMarkCircle className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500"
                            onClick={() => navigate('/my-profile')}>Información de mi tienda</span>
                        </li>
                        
                        <li className="flex items-center ml-2 cursor-pointer hover:opacity-80 transition-opacity">
                            <MdLogout className="mr-3" style={{ color: colors.primaryRed }} />
                            <span className="font-space font-medium" style={{ color: colors.primaryRed }}>Cerrar Sesión</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SideMenuProfile;