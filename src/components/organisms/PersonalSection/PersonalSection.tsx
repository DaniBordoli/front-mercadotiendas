import * as React from 'react';
import { useState, useEffect } from 'react';
import { InputDefault } from '../../atoms/InputDefault/InputDefault';
import { colors } from '../../../design/colors';
import { DesignButton } from '../../atoms/DesignButton/DesignButton';
import { fetchUserProfile, updateUserProfile } from '../../../stores/slices/authSlice';
import Toast from '../../atoms/Toast';

const PersonalSection: React.FC = () => {

    const [values, setValues] = useState({
        fullName: '',
        email: '',
        phone: '',
        birthDate: '',
        city: '',
        province: '',
        country: '',
        avatar: ''
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success' as 'success' | 'error' | 'info'
    });

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const user = await fetchUserProfile();
                setValues({
                    fullName: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    birthDate: user.birthDate ? user.birthDate.split('T')[0] : '',
                    city: user.city || '',
                    province: user.province || '',
                    country: user.country || '',
                    avatar: user.avatar || ''
                });
            } catch (error) {
                console.error('Error loading user profile:', error instanceof Error ? error.message : 'Unknown error');
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
     
            const { fullName, ...restValues } = values;
            const payload = {
              ...restValues,
              name: fullName, 
            };

            await updateUserProfile(payload);
            setToast({
                show: true,
                message: 'Perfil actualizado',
                type: 'success'
            });
        } catch (error) {
            console.error('Error updating profile:', error instanceof Error ? error.message : 'Unknown error');
            setToast({
                show: true,
                message: 'Error al actualizar',
                type: 'error'
            });
        }
    };

    return (
        <div className='flex justify-center '>
            <div className='w-[928px] h-auto mt-24 bg-white rounded-md shadow-md p-6'>

                <div className="flex justify-between items-center mb-8">
                    <h1
                    style={{color: colors.darkGray}}
                    className='text-xl font-space'
                    >Información Personal</h1>
                    
                    <DesignButton variant="secondary" onClick={handleSaveChanges}>
                        Guardar Cambios
                    </DesignButton>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <label className="block text-sm font-base font-space text-gray-500 mb-1">Nombre Completo</label>
                        <InputDefault placeholder="" value={values.fullName} onChange={(value) => setValues({ ...values, fullName: value })} />
                        {validationErrors.fullName && <p className="text-red-500 text-xs">{validationErrors.fullName}</p>}
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-base font-space text-gray-500 mb-1">Correo Electrónico</label>
                        <InputDefault placeholder="" value={values.email} disabled />
                        {validationErrors.email && <p className="text-red-500 text-xs">{validationErrors.email}</p>}
                    </div>
                    <div className="col-span-1 mt-4">
                        <label className="block text-sm font-base font-space text-gray-500 mb-1">Fecha de Nacimiento</label>
                        <InputDefault placeholder="" type="date" value={values.birthDate} onChange={(value) => setValues({ ...values, birthDate: value })} />
                    </div>
                    <div className="col-span-1 mt-4">
                        <label className="block text-sm font-base font-space text-gray-500 mb-1">Ciudad</label>
                        <InputDefault placeholder="" value={values.city} onChange={(value) => setValues({ ...values, city: value })} />
                    </div>
                    <div className="col-span-1 mt-4">
                        <label className="block text-sm font-base font-space text-gray-500 mb-1">Provincia</label>
                        <InputDefault placeholder="" value={values.province} onChange={(value) => setValues({ ...values, province: value })} />
                    </div>
                    <div className="col-span-1 mt-4">
                        <label className="block text-sm font-base font-space text-gray-500 mb-1">País</label>
                        <InputDefault placeholder="" value={values.country} onChange={(value) => setValues({ ...values, country: value })} />
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
}

export default PersonalSection;