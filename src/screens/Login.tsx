import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CenteredBox } from '../components/templates/CenteredBox';
import { Form } from '../components/organisms/Form';
import { FaStore } from 'react-icons/fa';
import { useStore } from '../stores';
import { Loading } from '../components/molecules/Loading';

function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, clearError } = useStore();
  const [initialLoading, setInitialLoading] = useState(true);
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);

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
      placeholder: 'Email*',
      required: true,
      autoComplete: 'email'
    },
    {
      type: 'password' as const,
      name: 'password',
      label: 'Password',
      placeholder: 'Password*',
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

        <h2 className="text-2xl font-semibold mb-6">Welcome back!</h2>
        <p className="text-center text-gray-600 text-sm mb-8">
          Sign in to your MercadoTiendas account
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
          submitText="Sign In"
          loading={isLoading}
        />

        <p className="mt-6 text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-sky-500 hover:text-sky-600 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </CenteredBox>
  );
}

export default Login;
