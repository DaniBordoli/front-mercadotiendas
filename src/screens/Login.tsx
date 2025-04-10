import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { CenteredBox } from '../components/templates/CenteredBox';
import { Form } from '../components/organisms/Form';
import { FaStore } from 'react-icons/fa';
import { Loading } from '../components/molecules/Loading';
import { GoogleSignInButton } from '../components/molecules/GoogleSignInButton/GoogleSignInButton';

function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuthStore();
  const [initialLoading, setInitialLoading] = useState(true);
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useAuthRedirect();

  const handleSubmit = async (values: Record<string, string>) => {
    await login({
      email: values.email,
      password: values.password
    });
  };

  const fields = [
    {
      type: 'email' as const,
      name: 'email',
      label: 'Email',
      placeholder: 'Ingresa tu email*',
      required: true,
      autoComplete: 'email'
    },
    {
      type: 'password' as const,
      name: 'password',
      label: 'Contraseña',
      placeholder: 'Ingresa tu contraseña*',
      required: true,
      autoComplete: 'current-password'
    }
  ];

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <CenteredBox height="520px">
      <div className="flex flex-col items-center mt-4">
        <div className="flex items-center mb-8">
          <span className="text-green-500 text-3xl mr-2">
            <FaStore size={28} color="skyblue" />
          </span>
          <h1 className="text-2xl font-bold text-sky-500">MercadoTiendas</h1>
        </div>

        <h2 className="text-2xl font-semibold mb-6">¡Bienvenido de vuelta!</h2>
        <p className="text-center text-gray-600 text-sm mb-8">
          Inicia sesión en tu cuenta de MercadoTiendas
        </p>

        <Form
          fields={fields}
          values={values}
          onChange={(name, value) => {
            clearError();
            setValues(prev => ({ ...prev, [name]: value }));
          }}
          onSubmit={handleSubmit}
          errors={error ? { email: error } : {}}
          submitText="Inicia sesión"
          loading={isLoading}
        />

        <div className="mt-4 w-full">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                O accede con
              </span>
            </div>
          </div>

          <div className="mt-4">
            <GoogleSignInButton
              onClick={() => {
                clearError();
                loginWithGoogle();
              }}
              isLoading={isLoading}
            />
          </div>
        </div>
        <p
          className="text-sky-500 font-semibold text-sm mt-2 cursor-pointer"
          onClick={() => navigate('/reset-password')}
        >
          ¿Olvidaste tu contraseña? 
        </p>

        <p className="mt-6 text-sm text-gray-600">
          No tienes una cuenta?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-sky-500 hover:text-sky-600 font-medium"
          >
            Registrate
          </button>
        </p>
      </div>
    </CenteredBox>
  );
}

export default Login;
