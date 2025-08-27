import * as React from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { DesignButton } from '../components/atoms/DesignButton';
import { colors } from '../design/colors';
import { InputDefault } from '../components/atoms/InputDefault';
import { SelectDefault } from '../components/atoms/SelectDefault';
import { fetchUserProfile, updateUserProfile, updateAvatar, isGoogleUser } from '../stores/slices/authSlice';
import { useAuthStore } from '../stores';
import { updateInfluencerData, getInfluencerData, InfluencerDataForm } from '../services/userService';
import Toast from '../components/atoms/Toast';
import FullScreenLoader from '../components/molecules/FullScreenLoader';
import { getCountryOptions, getCountryByCode, getCountryOptionLabel, type CountryOption } from '../utils/countriesLibrary';
import { FaBullhorn, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const DataPersonalInfo: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    
    // Estado para los valores de los inputs
    const [values, setValues] = React.useState({
        fullName: '',
        email: '',
        birthDate: '',
        countryCode: '+54',
        userPhone: '',
        country: '',
        city: '',
        address: ''
    });
    
    // Estado para la dirección preferida
    const [preferredAddress, setPreferredAddress] = React.useState({
        country: '',
        province: '',
        city: '',
        postalCode: '',
        streetAndNumber: ''
    });
    const [selectedPreferredCountry, setSelectedPreferredCountry] = React.useState<CountryOption | null>(null);
    const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
    const [toast, setToast] = React.useState({
        show: false,
        message: '',
        type: 'success' as 'success' | 'error' | 'info'
    });
    const [profileImage, setProfileImage] = React.useState<string | null>(null);
    const [profileImageFile, setProfileImageFile] = React.useState<File | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedCountry, setSelectedCountry] = React.useState<CountryOption | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    
    // Estado para datos de influencer
    const [influencerData, setInfluencerData] = React.useState({
        username: '',
        instagram: '',
        tiktok: '',
        youtube: '',
        category: '',
        niches: [] as string[]
    });

    // Cargar datos del usuario al montar
    React.useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const user = await fetchUserProfile();
                setValues({
                    fullName: user.name || '',
                    email: user.email || '',
                    birthDate: user.birthDate ? user.birthDate.split('T')[0] : '',
                    countryCode: user.countryCode || '+54',
                    userPhone: user.userPhone || '',
                    country: user.country || '',
                    city: user.city || '',
                    address: user.address || ''
                });
                setProfileImage(user.avatar || "https://placehold.co/100x100"); // Cambiado a user.avatar
                
                // Establecer país seleccionado si existe
                if (user.country) {
                    const selectedCountryOption = getCountryByCode(user.country);
                    setSelectedCountry(selectedCountryOption || null);
                }

                // Prefill Dirección preferida si existe
                if (user.preferredAddress) {
                    setPreferredAddress({
                        country: user.preferredAddress.country || '',
                        province: user.preferredAddress.province || '',
                        city: user.preferredAddress.city || '',
                        postalCode: user.preferredAddress.postalCode || '',
                        streetAndNumber: user.preferredAddress.streetAndNumber || ''
                    });
                    if (user.preferredAddress.country) {
                        const prefCountryOption = getCountryByCode(user.preferredAddress.country);
                        setSelectedPreferredCountry(prefCountryOption || null);
                    }
                }
                
                // Cargar datos de influencer si no tiene tienda
                if (!user.shop) {
                    const influencerInfo = await getInfluencerData();
                    if (influencerInfo) {
                        setInfluencerData(influencerInfo);
                    }
                }
            } catch (error) {
                // Manejo de error opcional
            }
        };
        loadUserProfile();
    }, []);
    
    // Función para guardar datos de influencer
    const handleSaveInfluencerData = async () => {
        try {
            await updateInfluencerData(influencerData);
            setToast({
                show: true,
                message: 'Perfil de influencer actualizado correctamente',
                type: 'success'
            });
        } catch (error) {
            setToast({
                show: true,
                message: 'Error al actualizar el perfil de influencer',
                type: 'error'
            });
        }
    };

    // Función para guardar y finalizar
    const handleSaveAndFinish = async () => {
        // Validar campos obligatorios
        if (!influencerData.username || !influencerData.category) {
            setToast({
                show: true,
                message: 'Por favor completa el nombre de usuario y la categoría',
                type: 'error'
            });
            return;
        }

        try {
            await updateInfluencerData(influencerData);
            setToast({
                show: true,
                message: 'Perfil de influencer guardado exitosamente',
                type: 'success'
            });
            // Redirigir a /success después de un breve delay
            setTimeout(() => {
                navigate('/success');
            }, 1500);
        } catch (error) {
            setToast({
                show: true,
                message: 'Error al guardar el perfil de influencer',
                type: 'error'
            });
        }
    };

    // Función para completar más tarde
    const handleCompleteLater = () => {
        // Redirigir a /success sin guardar datos
        navigate('/success');
    };

    const validateForm = (values: Record<string, string>): Record<string, string> => {
        const errors: Record<string, string> = {};
        if (!values.fullName?.trim()) {
            errors.fullName = 'Nombre completo es requerido';
        }
        if (!values.email?.trim()) {
            errors.email = 'Email es requerido';
        }
        return errors;
    };

    const handleSaveChanges = async () => {
        setValidationErrors({});
        const errors = validateForm(values);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        setIsLoading(true);
        try {
            // 1. Actualizar datos de perfil (sin imagen)
            const { fullName, ...restValues } = values;
            const payload: any = {
                ...restValues,
                name: fullName,
            };

            // 2. Agregar dirección preferida si está completa
            if (preferredAddress.country || preferredAddress.province || preferredAddress.city || 
                preferredAddress.postalCode || preferredAddress.streetAndNumber) {
                payload.preferredAddress = {
                    ...preferredAddress,
                    role: 'buyer'
                };
            }

            await updateUserProfile(payload);

            // 2. Si hay imagen nueva, subirla aparte
            if (profileImageFile) {
                await updateAvatar(profileImageFile);
            }

            setToast({
                show: true,
                message: 'Perfil actualizado',
                type: 'success'
            });
        } catch (error) {
            setToast({
                show: true,
                message: 'Error al actualizar',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Imagen de perfil (SideMenuProfile logic)
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

        setProfileImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImage(reader.result as string);
        };
        reader.onerror = () => {
            alert('Error al cargar la imagen');
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setProfileImage("https://placehold.co/100x100");
        setProfileImageFile(null);
    };

    const handleCountryChange = (selectedOption: CountryOption | null) => {
        setSelectedCountry(selectedOption);
        if (selectedOption) {
            setValues(v => ({ ...v, country: selectedOption.value }));
        } else {
            setValues(v => ({ ...v, country: '' }));
        }
    };
    
    const handlePreferredCountryChange = (selectedOption: CountryOption | null) => {
        setSelectedPreferredCountry(selectedOption);
        if (selectedOption) {
            setPreferredAddress(prev => ({ ...prev, country: selectedOption.value }));
        } else {
            setPreferredAddress(prev => ({ ...prev, country: '' }));
        }
    };

    const handleEditProfileClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="min-h-screen flex relative">
            {isLoading && <FullScreenLoader />}
            <DataSideBar />
            <div className="flex flex-col flex-grow p-1 md:p-2 md:ml-[250px]">
                <h1 className="text-2xl font-space font-medium text-gray-800 mb-1">Datos Personales</h1>
                <div className="p-2 md:p-3 bg-white rounded-md border" style={{ borderColor: '#E5E7EB' }}>
                    <div className="flex flex-col md:flex-row md:ml-[16%] items-center gap-2 md:gap-4">
                        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mb-2 relative group">
                            <img
                                src={profileImage || "https://placehold.co/100x100"}
                                alt="Perfil"
                                className="w-full h-full object-cover"
                            />
                            {profileImageFile && (
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
                        
                        {/* Sección Perfil de Influencer - Solo para influencers */}
                        {!user?.shop && (
                            <div className="w-full">
                                <div className="border-t border-gray-300 my-3 w-full"></div>
                                <h2 className="text-lg font-space font-medium text-gray-800 mb-2 md:ml-[16%] flex items-center">
                                    <FaBullhorn className="mr-2 text-purple-600" />
                                    Perfil de Influencer
                                </h2>
                                
                                <div className="space-y-3">
                                    {/* Nombre de usuario público */}
                                    <div className="flex flex-col md:flex-row gap-4 w-full md:justify-center">
                                        <div className="w-full md:w-8/12">
                                            <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                                Nombre de usuario público *
                                            </label>
                                            <InputDefault
                                                placeholder="@tu_usuario"
                                                className="w-full"
                                                value={influencerData.username}
                                                onChange={val => setInfluencerData({...influencerData, username: val})}
                                            />
                                        </div>
                                    </div>

                                    {/* Redes sociales */}
                                    <div>
                                        <h3 className="text-md font-space font-medium text-gray-700 mb-2 md:ml-[16%]">Redes Sociales</h3>
                                        <div className="flex flex-col md:flex-row gap-4 w-full md:justify-center">
                                            <div className="w-full md:w-8/12">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-space font-medium text-gray-600 mb-2 flex items-center">
                                                            <FaInstagram className="mr-2 text-pink-500" />
                                                            Instagram
                                                        </label>
                                                        <InputDefault
                                                            placeholder="@tu_instagram"
                                                            className="w-full"
                                                            value={influencerData.instagram}
                                                            onChange={val => setInfluencerData({...influencerData, instagram: val})}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-space font-medium text-gray-600 mb-2 flex items-center">
                                                            <FaTiktok className="mr-2 text-black" />
                                                            TikTok
                                                        </label>
                                                        <InputDefault
                                                            placeholder="@tu_tiktok"
                                                            className="w-full"
                                                            value={influencerData.tiktok}
                                                            onChange={val => setInfluencerData({...influencerData, tiktok: val})}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-space font-medium text-gray-600 mb-2 flex items-center">
                                                            <FaYoutube className="mr-2 text-red-500" />
                                                            YouTube
                                                        </label>
                                                        <InputDefault
                                                            placeholder="Tu canal de YouTube"
                                                            className="w-full"
                                                            value={influencerData.youtube}
                                                            onChange={val => setInfluencerData({...influencerData, youtube: val})}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Categoría y nichos */}
                                    <div className="flex flex-col md:flex-row gap-4 w-full md:justify-center">
                                        <div className="w-full md:w-4/12">
                                            <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                                Categoría principal *
                                            </label>
                                            <SelectDefault
                                                value={influencerData.category}
                                                onChange={val => setInfluencerData({...influencerData, category: val})}
                                                className="w-full"
                                                placeholder="Selecciona una categoría"
                                                options={[
                                                    { value: "moda", label: "Moda y Estilo" },
                                                    { value: "belleza", label: "Belleza y Cuidado Personal" },
                                                    { value: "fitness", label: "Fitness y Salud" },
                                                    { value: "comida", label: "Comida y Gastronomía" },
                                                    { value: "viajes", label: "Viajes y Turismo" },
                                                    { value: "tecnologia", label: "Tecnología" },
                                                    { value: "lifestyle", label: "Lifestyle" },
                                                    { value: "entretenimiento", label: "Entretenimiento" },
                                                    { value: "educacion", label: "Educación" },
                                                    { value: "deportes", label: "Deportes" }
                                                ]}
                                            />
                                        </div>
                                        <div className="w-full md:w-4/12">
                                            <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                                Nichos específicos
                                            </label>
                                            <InputDefault
                                                placeholder="Ej: moda sostenible, belleza natural"
                                                className="w-full"
                                                value={influencerData.niches.join(', ')}
                                                onChange={val => setInfluencerData({...influencerData, niches: val.split(', ').filter(n => n.trim())})}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Separa los nichos con comas</p>
                                        </div>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex flex-col md:flex-row gap-4 w-full md:justify-center">
                                        <div className="w-full md:w-8/12 flex gap-4">
                                            <DesignButton variant="primary" onClick={handleSaveAndFinish}>
                                                Guardar y finalizar
                                            </DesignButton>
                                            <DesignButton variant="neutral" onClick={handleCompleteLater}>
                                                Completar más tarde
                                            </DesignButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        </div>
                        <div className="flex flex-col w-full md:w-auto">
                            <h2 className="text-lg font-space font-medium text-gray-800 mb-2">Foto de Perfil</h2>
                            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                                <DesignButton variant="primary" onClick={handleEditProfileClick}>
                                    Cambiar foto
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
                                <DesignButton variant="neutral" onClick={handleRemoveImage}>
                                    Eliminar
                                </DesignButton>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-300 my-3 md:w-8/12 md:ml-[16%] w-full"></div>

                    <div className="flex flex-col items-center gap-3">
                        <div className="flex flex-col md:flex-row gap-4 w-full md:justify-center">
                            <div className="w-full md:w-4/12">
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    Nombre Completo
                                </label>
                                <InputDefault
                                    placeholder="Ingresa tu Nombre"
                                    className="w-full"
                                    value={values.fullName}
                                    onChange={val => setValues(v => ({ ...v, fullName: val }))}
                                />
                                {validationErrors.fullName && (
                                    <p className="text-red-500 text-xs">{validationErrors.fullName}</p>
                                )}
                            </div>
                            <div className="w-full md:w-4/12">
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    Correo Electrónico
                                    {isGoogleUser(user) && (
                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Google
                                        </span>
                                    )}
                                </label>
                                <InputDefault
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="w-full"
                                    value={values.email}
                                    onChange={val => setValues(v => ({ ...v, email: val }))}
                                    disabled
                                />
                                {validationErrors.email && (
                                    <p className="text-red-500 text-xs">{validationErrors.email}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 w-full md:justify-center">
                            <div className="w-full md:w-4/12">
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    Fecha de nacimiento
                                </label>
                                <InputDefault
                                    type="date"
                                    className="w-full"
                                    value={values.birthDate}
                                    onChange={val => setValues(v => ({ ...v, birthDate: val }))}
                                />
                            </div>
                            <div className="w-full md:w-4/12">
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    Número de teléfono
                                </label>
                                <InputDefault
                                    placeholder="Ingresa tu número"
                                    className="w-full"
                                    value={values.userPhone}
                                    onChange={val => setValues(v => ({ ...v, userPhone: val }))}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 w-full md:justify-center">
                            <div className="w-full md:w-4/12">
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    País
                                </label>
                                <Select
                                    value={selectedCountry}
                                    onChange={handleCountryChange}
                                    options={getCountryOptions()}
                                    placeholder="Selecciona tu país"
                                    isSearchable
                                    isClearable
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    getOptionLabel={(option: CountryOption) => getCountryOptionLabel(option)}
                                    formatOptionLabel={(option: CountryOption) => (
                                        <div className="flex items-center gap-2">
                                            <span>{option.flag}</span>
                                            <span>{option.label}</span>
                                        </div>
                                    )}
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            width: '382px',
                                            height: '44px',
                                            minHeight: '44px'
                                        })
                                    }}
                                />
                            </div>
                            <div className="w-full md:w-4/12">
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    Ciudad
                                </label>
                                <InputDefault
                                    placeholder="Ingresa tu ciudad"
                                    className="w-full"
                                    value={values.city}
                                    onChange={val => setValues(v => ({ ...v, city: val }))}
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-8/12 mt-6">
                            <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                Dirección
                            </label>
                            <InputDefault
                                placeholder="Ingresa tu dirección completa"
                                className="w-full"
                                value={values.address}
                                onChange={val => setValues(v => ({ ...v, address: val }))}
                            />
                        </div>
                        <div className="border-t border-gray-300 my-1 w-full md:w-8/12"></div>
                        {/* Solo mostrar sección de cambio de contraseña si el usuario no se logueó con Google */}
                        {!isGoogleUser(user) && (
                            <div className="w-full">
                                <h2 className="text-lg font-space font-medium text-gray-800 mb-2 md:ml-[16%]">
                                    Cambiar contraseña
                                </h2>
                                <div className="flex flex-col md:flex-row gap-4 w-full md:justify-center">
                                    <div className="w-full md:w-4/12">
                                        <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                            Contraseña actual
                                        </label>
                                        <InputDefault
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="w-full md:w-4/12">
                                        <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                            Nueva contraseña
                                        </label>
                                        <InputDefault
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Sección de Dirección Preferida */}
                        <div className="border-t border-gray-300 my-4 w-full md:w-8/12"></div>
                        <div className="w-full">
                            <h2 className="text-lg font-space font-medium text-gray-800 mb-2 md:ml-[16%]">
                                Dirección preferida (opcional)
                            </h2>
                            <div className="flex flex-col gap-4 w-full md:justify-center">
                                {/* País */}
                                <div className="flex flex-col md:flex-row gap-4 w-full md:justify-center">
                                    <div className="w-full md:w-4/12">
                                        <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                            País
                                        </label>
                                        <Select
                                            value={selectedPreferredCountry}
                                            onChange={handlePreferredCountryChange}
                                            options={getCountryOptions()}
                                            placeholder="Seleccionar país"
                                            isSearchable
                                            isClearable
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            getOptionLabel={(option: CountryOption) => getCountryOptionLabel(option)}
                                            formatOptionLabel={(option: CountryOption) => (
                                                <div className="flex items-center gap-2">
                                                    <span>{option.flag}</span>
                                                    <span>{option.label}</span>
                                                </div>
                                            )}
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    width: '382px',
                                                    height: '44px',
                                                    minHeight: '44px'
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="w-full md:w-4/12">
                                        <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                            Provincia
                                        </label>
                                        <InputDefault
                                            placeholder="Seleccionar provincia"
                                            className="w-full"
                                            value={preferredAddress.province}
                                            onChange={val => setPreferredAddress(prev => ({ ...prev, province: val }))}
                                        />
                                    </div>
                                </div>
                                
                                {/* Ciudad y Código Postal */}
                                <div className="flex flex-col md:flex-row gap-4 w-full md:justify-center">
                                    <div className="w-full md:w-4/12">
                                        <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                            Ciudad
                                        </label>
                                        <InputDefault
                                            placeholder="Tu ciudad"
                                            className="w-full"
                                            value={preferredAddress.city}
                                            onChange={val => setPreferredAddress(prev => ({ ...prev, city: val }))}
                                        />
                                    </div>
                                    <div className="w-full md:w-4/12">
                                        <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                            Código Postal
                                        </label>
                                        <InputDefault
                                            placeholder="CP"
                                            className="w-full"
                                            value={preferredAddress.postalCode}
                                            onChange={val => setPreferredAddress(prev => ({ ...prev, postalCode: val }))}
                                        />
                                    </div>
                                </div>
                                
                                {/* Calle y número */}
                                <div className="flex flex-col md:flex-row gap-4 w-full md:justify-center">
                                    <div className="w-full md:w-8/12">
                                        <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                            Calle y número
                                        </label>
                                        <InputDefault
                                            placeholder="Av. Corrientes 1234"
                                            className="w-full"
                                            value={preferredAddress.streetAndNumber}
                                            onChange={val => setPreferredAddress(prev => ({ ...prev, streetAndNumber: val }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center mt-3 w-full">
                            <DesignButton variant="primary" onClick={handleSaveChanges}>
                                Guardar cambios
                            </DesignButton>
                        </div>
                    </div>
                </div>
            </div>
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
                duration={3000}
            />
        </div>
    );
};

export default DataPersonalInfo;
