import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CenteredBox } from '../components/templates/CenteredBox';
import { Form } from '../components/organisms/Form';
import { Logo } from '../components/atoms/Logo';

function VerifyPassword() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ code: '' });

  const handleSubmit = async (values: Record<string, string>) => {
    navigate('/reset-password');
  };

  const fields = [
    {
      type: 'text' as const,
      name: 'code',
      label: '',
      placeholder: 'Enter your verification code*',
      required: true,
      autoComplete: 'off'
    }
  ];

  return (
    <CenteredBox height="600px">
      <div className="flex items-center mb-4 mt-10">
        <Logo size={48} color="skyblue" className="mr-2" />
        <h1 className="text-2xl font-bold text-sky-500">MercadoTiendas</h1>
      </div>
      <h1 className='text-2xl font-medium my-4'>Verifica tu email</h1>
      <p className="text-gray-600 text-center w-11/12 text-sm mb-6">
      Enviamos un correo electrónico con tu código a email@email.com
      </p>
      <Form
        fields={fields}
        values={values}
        onChange={(name, value) => setValues(prev => ({ ...prev, [name]: value }))}
        onSubmit={handleSubmit}
        submitText="Continuar"
      />
      <p className="mt-4 text-sm font-medium text-black">
        ¿No recibiste el codigo?{' '}
        <button
          type="button"
          className="text-sky-600 hover:text-sky-700 font-medium"
          onClick={() => {}}
        >
          Enviar nuevamente
        </button>
      </p>
      <button 
        type="button"
        className="mt-4 font-semibold text-sky-600 hover:text-sky-700" 
        onClick={() => navigate('/reset-password')}
      >
        Volver al inicio
      </button>
    </CenteredBox>
  );
}

export default VerifyPassword;
