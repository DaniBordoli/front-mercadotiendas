import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CenteredBox } from '../components/templates/CenteredBox';
import { Form } from '../components/organisms/Form';
import { Logo } from '../components/atoms/Logo';

function ResetPassword() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '' });

  const handleSubmit = async (values: Record<string, string>) => {
    navigate('/login');
  };

  const fields = [
    {
      type: 'email' as const,
      name: 'email',
      label: 'Email',
      placeholder: 'Enter your email*',
      required: true,
      autoComplete: 'email'
    }
  ];

  return (
    <CenteredBox height="600px">
      <div className="flex items-center mb-4 mt-10">
        <Logo size={48} color="skyblue" className="mr-2" />
        <h1 className="text-2xl font-bold text-sky-500">MercadoTiendas</h1>
      </div>
      <h1 className='text-2xl font-medium my-4'>¿Olvidaste tu contraseña?</h1>
      <p className="text-gray-600 text-center w-11/12 text-sm mb-6">
      Escribe tu dirección de correo electrónico y te enviaremos las instrucciones para restablecer la contraseña.
      </p>
      <Form
        fields={fields}
        values={values}
        onChange={(name, value) => setValues(prev => ({ ...prev, [name]: value }))}
        onSubmit={handleSubmit}
        submitText="Enviar"
      />
      <button 
        type="button"
        className="mt-4 font-semibold text-sky-600 hover:text-sky-700" 
        onClick={() => navigate('/login')}
      >
        Volver
      </button>
    </CenteredBox>
  );
}

export default ResetPassword;
