import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CenteredBox } from '../components/templates/CenteredBox';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { Form } from '../components/organisms/Form';
import { FaStore } from 'react-icons/fa';
import { useAuthStore } from '../stores'; 
import { Loading } from '../components/molecules/Loading';

function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [initialLoading, setInitialLoading] = useState(true);
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    city: '',
    province: '',
    country: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useAuthRedirect();

  const validateForm = (values: Record<string, string>): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Validar nombre completo
    if (!values.fullName?.trim()) {
      errors.fullName = 'Nombre completo es requerido';
    } else if (values.fullName.length < 3) {
      errors.fullName = 'El nombre completo debe tener al menos 3 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email?.trim()) {
      errors.email = 'Email es requerido';
    } else if (!emailRegex.test(values.email)) {
      errors.email = 'Por favor ingresa un email válido';
    }

    // Validar contraseña
    if (!values.password) {
      errors.password = 'Contraseña es requerido';
    } else if (values.password.length < 6) {
      errors.password = 'Contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Por favor confirma tu contraseña';
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return errors;
  };

  // Ya no necesitamos este efecto porque redirigiremos a la página de activación

  const handleSubmit = async (values: Record<string, string>) => {
    // Limpiar errores anteriores
    setValidationErrors({});

    // Validar formulario
    const errors = validateForm(values);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {
      // Registrar al usuario
      await register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        birthDate: values.birthDate,
        city: values.city,
        province: values.province,
        country: values.country
      });
      
      // Redirigir a la página de activación de cuenta
      navigate(`/activate-account?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      console.error('Error durante el registro:', err);
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
      autoComplete: 'email'
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
    },
    {
      type: 'password' as const,
      name: 'password',
      label: 'Contraseña',
      placeholder: 'Crea una contraseña*',
      required: true,
      autoComplete: 'new-password'
    },
    {
      type: 'password' as const,
      name: 'confirmPassword',
      label: 'Confirmar contraseña',
      placeholder: 'Confirma tu contraseña*',
      required: true,
      autoComplete: 'new-password'
    }
  ];

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <CenteredBox height="850px">
      <div className="flex flex-col items-center mt-4">
        <div className="flex items-center mb-8">
          <span className="text-green-500 text-3xl mr-2">
            <FaStore size={28} color="skyblue" />
          </span>
          <h1 className="text-2xl font-bold text-sky-500">MercadoTiendas</h1>
        </div>

        <h2 className="text-2xl font-semibold mb-6">Crear cuenta</h2>
        <p className="text-center text-gray-600 text-sm mb-8">
          Comienza a vender con tu tienda en MercadoTiendas 
        </p>

        <Form
          fields={fields}
          values={values}
          onChange={(name, value) => {
            clearError();
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
            setValues(prev => ({ ...prev, [name]: value }));
          }}
          onSubmit={handleSubmit}
          errors={{ ...validationErrors, ...(error ? { email: error } : {}) }}
          submitText="Crear cuenta"
          loading={isLoading}
        />

        <p className="mt-6 text-sm text-gray-600">
          Ya tienes una cuenta?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-sky-500 hover:text-sky-600 font-medium"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </CenteredBox>
  );
}

export default Register;