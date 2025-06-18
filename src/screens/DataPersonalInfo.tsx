import * as React from 'react';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { DesignButton } from '../components/atoms/DesignButton';
import { colors } from '../design/colors';
import { InputDefault } from '../components/atoms/InputDefault';
import { SelectDefault } from '../components/atoms/SelectDefault';
import { fetchUserProfile, updateUserProfile, updateAvatar } from '../stores/slices/authSlice';
import Toast from '../components/atoms/Toast';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const DataPersonalInfo: React.FC = () => {
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
    const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
    const [toast, setToast] = React.useState({
        show: false,
        message: '',
        type: 'success' as 'success' | 'error' | 'info'
    });
    const [profileImage, setProfileImage] = React.useState<string | null>(null);
    const [profileImageFile, setProfileImageFile] = React.useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

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
            } catch (error) {
                // Manejo de error opcional
            }
        };
        loadUserProfile();
    }, []);

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
        try {
            // 1. Actualizar datos de perfil (sin imagen)
            const { fullName, ...restValues } = values;
            const payload: any = {
                ...restValues,
                name: fullName,
            };
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

    const handleEditProfileClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="min-h-screen flex">
            <DataSideBar />
            <div className="flex flex-col flex-grow p-4 md:p-10 md:ml-[250px]">
                <h1 className="text-2xl font-space font-medium text-gray-800 mb-6">Datos Personales</h1>
                <div className="p-4 md:p-6 bg-white rounded-md border" style={{ borderColor: '#E5E7EB' }}>
                    <div className="flex flex-col md:flex-row md:ml-[16%] items-center gap-4 md:gap-6">
                        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mb-4 relative group">
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

                    <div className="border-t border-gray-300 my-6 md:w-8/12 md:ml-[16%] w-full"></div>

                    <div className="flex flex-col items-center gap-6">
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
                                <SelectDefault
                                    options={[
                                        { value: 'argentina', label: 'Argentina' },
                                        { value: 'chile', label: 'Chile' },
                                        { value: 'brasil', label: 'Brasil' },
                                    ]}
                                    placeholder="Argentina"
                                    className="w-full"
                                    value={values.country}
                                    onChange={val => setValues(v => ({ ...v, country: val }))}
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
                        <div className="border-t border-gray-300 my-2 w-full md:w-8/12"></div>
                        <div className="w-full">
                            <h2 className="text-lg font-space font-medium text-gray-800 mb-4 md:ml-[16%]">
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
                        <div className="flex flex-col items-center md:items-end mt-6 w-full">
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
