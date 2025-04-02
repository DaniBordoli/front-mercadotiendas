import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CenteredBox } from '../components/templates/CenteredBox';
import { Form } from '../components/organisms/Form';
import { FaStore } from 'react-icons/fa';
import { useStore } from '../stores';
import { Loading } from '../components/molecules/Loading';

function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, isAuthenticated, clearError } = useStore();
  const [initialLoading, setInitialLoading] = useState(true);
  const [values, setValues] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/createshop');
    }
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);

  const handleSubmit = async (values: Record<string, string>) => {
    await register({
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword
    });
  };

  const fields = [
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
            setValues(prev => ({ ...prev, [name]: value }));
          }}
          onSubmit={handleSubmit}
          errors={error ? { email: error } : {}}
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