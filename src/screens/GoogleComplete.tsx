import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../design/colors';
import { InputDefault } from '../components/atoms/InputDefault/InputDefault';
import { SelectDefault } from '../components/atoms/SelectDefault/SelectDefault';
import { DesignButton } from '../components/atoms/DesignButton';
import { useAuthStore } from '../stores';
import { updateUserProfile } from '../stores/slices/authSlice';
import FullScreenLoader from '../components/molecules/FullScreenLoader';
import { Navbar } from '../components/organisms/Navbar';
import FooterHome from '../components/organisms/FooterHome/FooterHome';

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
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar />
            {isLoading && <FullScreenLoader />}
            <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-0" style={{paddingTop: '10px', paddingBottom: '20px'}}>
                <div className="rounded-[2.0rem] border border-gray-200 shadow bg-white px-4 py-6 md:px-8 md:py-10 flex flex-col items-center w-full max-w-lg">
                    <div className="flex items-center justify-center w-full">
                        <img src="/logonuevoalto.png" alt="MercadoTiendas Logo" className="w-32 md:w-48 h-auto" />
                </div>
                <div className="mt-6 w-full max-w-md px-4">
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
                                        País
                                    </label>
                                    <SelectDefault
                                        options={[
                                            { value: 'Argentina', label: 'Argentina' }
                                        ]}
                                        value={values.country}
                                        onChange={(value: string) => {
                                            clearError();
                                            setValidationErrors((prev) => ({ ...prev, country: '' }));
                                            setValues((prev) => ({ ...prev, country: value }));
                                        }}
                                        placeholder="Selecciona tu país"
                                        className="w-full"
                                    />
                                    {validationErrors.country && (
                                        <span className="text-red-500 text-sm">{validationErrors.country}</span>
                                    )}
                                </div>
                        
                        
                        <div className="mb-4">
                            <label className="block mb-2 font-space text-darkGray">
                                Provincia
                            </label>
                            <InputDefault
                                type="text"
                                placeholder="Ingresa tu provincia"
                                className="w-full"
                                value={values.province}
                                onChange={(value: string) => {
                                    clearError();
                                    setValidationErrors((prev) => ({ ...prev, province: '' }));
                                    setValues((prev) => ({ ...prev, province: value }));
                                }}
                            />
                            {validationErrors.province && (
                                <span className="text-red-500 text-sm">{validationErrors.province}</span>
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
                        <div className="mt-8">
                            <DesignButton
                                className='w-full'
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
            </div>
            <FooterHome />
        </div>
    );
};

export default GoogleComplete;