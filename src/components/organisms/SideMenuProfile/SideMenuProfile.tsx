import * as React from 'react';
import { colors } from '../../../design/colors';
import { DesignButton } from '../../atoms/DesignButton/DesignButton';
import { FaEdit, FaRegUser, FaRegHeart , FaTruck , FaRegStar, FaRegCreditCard , FaRegMap} from 'react-icons/fa';
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { FaRegClock } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { fetchUserProfile } from '../../../stores/slices/authSlice';

const SideMenuProfile: React.FC = () => {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>("https://placehold.co/100x100");
    const [userData, setUserData] = useState({ name: '', email: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const user = await fetchUserProfile();
                setUserData({
                    name: user.name || 'Usuario',
                    email: user.email || 'email@ejemplo.com'
                });
            } catch (error) {
                console.error('Error loading user profile:', error instanceof Error ? error.message : 'Unknown error');
            }
        };

        loadUserProfile();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            alert('La imagen no debe superar los 10MB');
            e.target.value = '';
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen válido');
            e.target.value = '';
            return;
        }

        setImageFile(file);
        const reader = new FileReader();

        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };

        reader.onerror = () => {
            alert('Error al cargar la imagen');
        };

        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview("https://placehold.co/100x100");
    };

    const handleEditProfileClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div 
            className="w-[288px] mt-24 bg-white rounded-md shadow-md p-6"
            style={{ minHeight: '716px', height: 'auto' }}
        >
            <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 relative group">
                    <img 
                        src={imagePreview || "https://placehold.co/100x100"} 
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                    {imageFile && (
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                <h3 className="font-space text-lg font-medium text-gray-800 mt-4">
                    {userData.name}
                </h3>
                <p className="font-space text-sm text-gray-500 mt-1">
                    {userData.email}
                </p>
                <div className="w-full mt-6 flex justify-center">
                    <DesignButton 
                        variant="primary"
                        icon={FaEdit}
                        iconPosition="left"
                        fullWidth={true}
                        onClick={handleEditProfileClick}
                    >
                        Editar Avatar
                    </DesignButton>
                    <input
                        ref={fileInputRef}
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                
                <div className="w-full mt-8">
                    <ul className="space-y-5">
 <li className="flex items-center ml-2 cursor-pointer" onClick={() => navigate('/personal-info')}>
                            <FaRegUser className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Información Personal</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer" onClick={() => navigate('/purchase-history')}>
                            <FaRegClock className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Historial de Compras</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer" onClick={() => navigate('/favorites')}>
                            <FaRegHeart className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Favoritos</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer" onClick={() => navigate('/tracking')}>
                            <FaTruck className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Seguimiento</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer" onClick={() => navigate('/reputation')}>
                            <FaRegStar className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Reputación</span>
                        </li>

                        <li className="flex items-center ml-2 cursor-pointer" onClick={() => navigate('/subscription')}>
                            <HiOutlineQuestionMarkCircle className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Suscripción</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer" onClick={() => navigate('/billing')}>
                            <HiOutlineQuestionMarkCircle className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Facturación</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer" onClick={() => navigate('/sales-management')}>
                            <HiOutlineQuestionMarkCircle className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Gestión de ventas</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer" onClick={() => navigate('/shop-state')}>
                            <HiOutlineQuestionMarkCircle className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Estado de la tienda</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer" onClick={() => navigate('/settings')}>
                            <HiOutlineQuestionMarkCircle className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Configuración de la tienda</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer" onClick={() => navigate('/domain-config')}>
                            <HiOutlineQuestionMarkCircle className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Configuración de Dominio</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer" onClick={() => navigate('/seo-metadata')}>
                            <HiOutlineQuestionMarkCircle className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">SEO y Metadata</span>
                        </li>
                        <li className="flex items-center ml-2 cursor-pointer" onClick={() => navigate('/createshop')}>
                            <HiOutlineQuestionMarkCircle className="mr-3 text-gray-500" />
                            <span className="font-space text-gray-500">Crear tienda</span>
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