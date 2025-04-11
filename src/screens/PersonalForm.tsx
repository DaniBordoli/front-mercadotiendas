import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/organisms/Sidebar/Sidebar';
import { Form } from '../components/organisms/Form';
import { API_URL } from '../services/api';
import { getStorageItem } from '../utils/storage';
import { fetchUserProfile, updateUserProfile } from '../stores/slices/authSlice';

const PersonalForm: React.FC = () => {
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    birthDate: '',
    city: '',
    province: '',
    country: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = await fetchUserProfile(); 
        setValues({
          fullName: user.name || '',
          email: user.email || '',
          birthDate: user.birthDate ? user.birthDate.split('T')[0] : '', 
          city: user.city || '',
          province: user.province || '',
          country: user.country || ''
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

  const handleSubmit = async (values: Record<string, string>) => {
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
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error updating profile:', error instanceof Error ? error.message : 'Unknown error');
      alert('Error al actualizar el perfil');
    }
  };
  const fields = [
    {
      type: 'text' as const,
      name: 'fullName',
      label: 'Nombre completo',
      placeholder: 'Ingresa tu nombre completo*',
      required: true,
      autoComplete: 'name'
    },
    {
      type: 'email' as const,
      name: 'email',
      label: 'Email',
      placeholder: 'Ingresa tu Email*',
      required: true,
      autoComplete: 'email',
      disabled: true
    },
    {
      type: 'date' as const,
      name: 'birthDate',
      label: 'Fecha de nacimiento',
      placeholder: 'Selecciona tu fecha de nacimiento',
      required: false,
      autoComplete: 'bday'
    },
    {
      type: 'text' as const,
      name: 'city',
      label: 'Ciudad',
      placeholder: 'Ingresa tu ciudad',
      required: false,
      autoComplete: 'address-level2'
    },
    {
      type: 'text' as const,
      name: 'province',
      label: 'Provincia',
      placeholder: 'Ingresa tu provincia',
      required: false,
      autoComplete: 'address-level1'
    },
    {
      type: 'text' as const,
      name: 'country',
      label: 'País',
      placeholder: 'Ingresa tu país',
      required: false,
      autoComplete: 'country-name'
    }
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 flex-grow flex justify-center">
        <div className="max-w-4xl w-full">
          <h1 className="text-2xl font-bold mb-4">Formulario Personal</h1>
          <Form
            fields={fields}
            values={values}
            onChange={(name, value) => {
              setValidationErrors(prev => ({ ...prev, [name]: '' }));
              setValues(prev => ({ ...prev, [name]: value }));
            }}
            onSubmit={handleSubmit}
            errors={validationErrors}
            submitText="Guardar"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalForm;
