import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoTienda from '../public/assets/logoTienda.png';
import { colors } from '../design/colors';
import { InputDefault } from '../components/atoms/InputDefault/InputDefault';
import { DesignButton } from '../components/atoms/DesignButton';
import { useAuthStore } from '../stores';
import { SelectDefault } from '../components/atoms/SelectDefault/SelectDefault';
import { updateUserProfile, fetchCountries, fetchProvincesForArgentina } from '../stores/slices/authSlice';

const GoogleComplete = () => {
    const navigate = useNavigate();
    const { user, isLoading, clearError } = useAuthStore();
    const [values, setValues] = useState({
        birthDate: '',
        city: '',
        province: '',
        country: ''
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [countries, setCountries] = useState<{ name: string; code: string }[]>([]);
    const [provinces, setProvinces] = useState<string[]>([]);

    useEffect(() => {
        if (user) {
            setValues({
                birthDate: user.birthDate || '',
                city: user.city || '',
                province: user.province || '',
                country: user.country || ''
            });
        }
    }, [user]);

    useEffect(() => {
        fetchCountries()
            .then((data) => setCountries(data))
            .catch((error) => console.error('Error fetching countries:', error));
    }, []);

    useEffect(() => {
        if (values.country === 'Argentina') {
            fetchProvincesForArgentina()
                .then((data) => setProvinces(data))
                .catch((error) => console.error('Error fetching provinces:', error));
        } else {
            setProvinces([]);
        }
    }, [values.country]);

    const validateForm = (values: Record<string, string>): Record<string, string> => {
        const errors: Record<string, string> = {};
        
        if (!values.birthDate) {
            errors.birthDate = 'La fecha de nacimiento es requerida';
        }
        
        if (!values.city?.trim()) {
            errors.city = 'La ciudad es requerida';
        }
        
        if (!values.province?.trim()) {
            errors.province = 'La provincia es requerida';
        }
        
        if (!values.country?.trim()) {
            errors.country = 'El país es requerido';
        }
        
        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});
        const errors = validateForm(values);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        
        try {
            const authStore = useAuthStore.getState();
            const token = authStore.token;

            if (!token) {
                throw new Error('No token provided');
            }

            await updateUserProfile(values);
            await authStore.loadProfile();
            
            navigate('/'); 
        } catch (err) {
            console.error('Error durante la actualización del perfil:', err);
        }
    };

    return (
        <div className="bg-white h-screen flex flex-col items-center">
            <div className="mt-28 mr-20 flex items-center space-x-6">
                <img src={logoTienda} alt="Logo Tienda" className="w-32 h-32" />
                <div className="flex flex-col">
                    <span className="font-bold text-4xl">Mercado Tiendas</span>
                    <span
                        className="font-space font-bold text-4xl tracking-[5px] mt-2"
                        style={{ color: colors.primaryRed }}
                    >
                        Live shopping
                    </span>
                </div>
            </div>
            
            <div className="mt-10 w-full max-w-md px-4">
                <h2 className="text-2xl font-bold mb-6 text-center">Completa tu perfil</h2>
                <p className="text-center text-gray-600 mb-8">
                    Necesitamos algunos datos adicionales para completar tu registro
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-space text-darkGray">
                            Fecha de nacimiento
                        </label>
                        <input
                            type="date"
                            placeholder="Selecciona tu fecha de nacimiento"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={values.birthDate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                clearError();
                                setValidationErrors((prev) => ({ ...prev, birthDate: '' }));
                                setValues((prev) => ({ ...prev, birthDate: e.target.value }));
                            }}
                        />
                        {validationErrors.birthDate && (
                            <span className="text-red-500 text-sm">{validationErrors.birthDate}</span>
                        )}
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-2 font-space text-darkGray">
                            Ciudad
                        </label>
                        <InputDefault
                            type="text"
                            placeholder="Ingresa tu ciudad"
                            className="w-full"
                            value={values.city}
                            onChange={(value: string) => {
                                clearError();
                                setValidationErrors((prev) => ({ ...prev, city: '' }));
                                setValues((prev) => ({ ...prev, city: value }));
                            }}
                        />
                        {validationErrors.city && (
                            <span className="text-red-500 text-sm">{validationErrors.city}</span>
                        )}
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-2 font-space text-darkGray">
                            Provincia
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={values.province}
                            onChange={(e) => {
                                clearError();
                                setValidationErrors((prev) => ({ ...prev, province: '' }));
                                setValues((prev) => ({ ...prev, province: e.target.value }));
                            }}
                            disabled={!values.country || provinces.length === 0}
                        >
                            <option value="">Selecciona tu provincia</option>
                            {provinces.map((province, index) => (
                                <option key={index} value={province}>
                                    {province}
                                </option>
                            ))}
                        </select>
                        {validationErrors.province && (
                            <span className="text-red-500 text-sm">{validationErrors.province}</span>
                        )}
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-2 font-space text-darkGray">
                            País
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={values.country}
                            onChange={(e) => {
                                clearError();
                                setValidationErrors((prev) => ({ ...prev, country: '' }));
                                setValues((prev) => ({ ...prev, country: e.target.value }));
                            }}
                        >
                            <option value="">Selecciona tu país</option>
                            {countries.map((country, index) => (
                                <option key={index} value={country.name}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                        {validationErrors.country && (
                            <span className="text-red-500 text-sm">{validationErrors.country}</span>
                        )}
                    </div>
                    
                    <div className="mt-8">
                        <DesignButton
                            fullWidth={true}
                            variant="primary"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Guardando...' : 'Completar perfil'}
                        </DesignButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GoogleComplete;