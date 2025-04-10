import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CenteredBox } from '../components/templates/CenteredBox';
import { Form } from '../components/organisms/Form';
import { Logo } from '../components/atoms/Logo';
import { resetPassword } from '../stores/slices/authSlice';

function VerifyPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [values, setValues] = useState({ code: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Obtén el token de la URL
  const token = searchParams.get('token');

  const handleSubmit = async () => {
    if (!token) {
      setError('Token no válido o faltante');
      return;
    }

    try {
      setError(null); // Limpia errores previos
      await resetPassword(token, values.code);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fields = [
    {
      type: 'password' as const,
      name: 'code',
      label: '',
      placeholder: 'Ingresa tu nueva contraseña*',
      required: true,
      autoComplete: 'off',
    },
  ];

  return (
    <CenteredBox height="600px">
      <div className="flex items-center mb-4 mt-10">
        <Logo size={48} color="skyblue" className="mr-2" />
        <h1 className="text-2xl font-bold text-sky-500">MercadoTiendas</h1>
      </div>
      <h1 className="text-2xl font-medium my-4">Restablece tu contraseña</h1>
      <p className="text-gray-600 text-center w-11/12 text-sm mb-6">
        Ingresa la nueva contraseña
      </p>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success ? (
        <p className="text-green-500 text-sm mb-4">
          ¡Contraseña restablecida con éxito! Serás redirigido al inicio de sesión.
        </p>
      ) : (
        <Form
          fields={fields}
          values={values}
          onChange={(name, value) => setValues((prev) => ({ ...prev, [name]: value }))}
          onSubmit={handleSubmit}
          submitText="Continuar"
        />
      )}
      <p className="mt-4 text-sm font-medium text-black">
        ¿No recibiste el código?{' '}
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
        onClick={() => navigate('/login')}
      >
        Volver al inicio
      </button>
    </CenteredBox>
  );
}

export default VerifyPassword;