import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CenteredBox } from '../components/templates/CenteredBox';
import { Form } from '../components/organisms/Form';
import { Logo } from '../components/atoms/Logo';

const API_URL = process.env.REACT_APP_API_URL;

function ResetPassword() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      setError(null); // Limpiar errores previos
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar el correo.');
      }

      setSuccess(true); // Mostrar mensaje de éxito
      setTimeout(() => navigate('/password-restore'), 1000);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error. Inténtalo nuevamente.');
    }
  };

  const fields = [
    {
      type: 'email' as const,
      name: 'email',
      label: 'Email',
      placeholder: 'Enter your email*',
      required: true,
      autoComplete: 'email',
    },
  ];

  return (
    <CenteredBox height="600px">
      <div className="flex items-center mb-4 mt-10">
        <Logo size={48} color="skyblue" className="mr-2" />
        <h1 className="text-2xl font-bold text-sky-500">MercadoTiendas</h1>
      </div>
      <h1 className="text-2xl font-medium my-4">¿Olvidaste tu contraseña?</h1>
      <p className="text-gray-600 text-center w-11/12 text-sm mb-6">
        Escribe tu dirección de correo electrónico y te enviaremos las instrucciones para restablecer la contraseña.
      </p>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && (
        <p className="text-green-500 text-sm mb-4">
          ¡Correo enviado! Revisa tu bandeja de entrada para más instrucciones.
        </p>
      )}
      <Form
        fields={fields}
        values={values}
        onChange={(name, value) => setValues((prev) => ({ ...prev, [name]: value }))}
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