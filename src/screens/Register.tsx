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
    confirmPassword: ''
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
      errors.fullName = 'Full name is required';
    } else if (values.fullName.length < 3) {
      errors.fullName = 'Full name must be at least 3 characters';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(values.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validar contraseña
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Validar confirmación de contraseña
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleSubmit = async (values: Record<string, string>) => {
    // Limpiar errores anteriores
    setValidationErrors({});

    // Validar formulario
    const errors = validateForm(values);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    await register({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword
    });
  };

  const fields = [
    {
      type: 'text' as const,
      name: 'fullName',
      label: 'Full Name',
      placeholder: 'Enter your full name*',
      required: true,
      autoComplete: 'name'
    },
    {
      type: 'email' as const,
      name: 'email',
      label: 'Email',
      placeholder: 'Enter your email*',
      required: true,
      autoComplete: 'email'
    },
    {
      type: 'password' as const,
      name: 'password',
      label: 'Password',
      placeholder: 'Create a password*',
      required: true,
      autoComplete: 'new-password'
    },
    {
      type: 'password' as const,
      name: 'confirmPassword',
      label: 'Confirm Password',
      placeholder: 'Confirm your password*',
      required: true,
      autoComplete: 'new-password'
    }
  ];

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <CenteredBox height="600px">
      <div className="flex flex-col items-center mt-4">
        <div className="flex items-center mb-8">
          <span className="text-green-500 text-3xl mr-2">
            <FaStore size={28} color="skyblue" />
          </span>
          <h1 className="text-2xl font-bold text-sky-500">MercadoTiendas</h1>
        </div>

        <h2 className="text-2xl font-semibold mb-6">Create an account</h2>
        <p className="text-center text-gray-600 text-sm mb-8">
          Start selling with your own MercadoTiendas shop
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
          submitText="Create Account"
          loading={isLoading}
        />

        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-sky-500 hover:text-sky-600 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </CenteredBox>
  );
}

export default Register;