import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form } from '../components/organisms/Form';
import { resetPassword } from '../stores/slices/authSlice';
import { DesignButton } from '../components/atoms/DesignButton';
import { Navbar } from '../components/organisms/Navbar';
import FooterHome from '../components/organisms/FooterHome/FooterHome';

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
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-0" style={{paddingTop: '10px', paddingBottom: '20px'}}>
        <div className="rounded-[2.0rem] border border-gray-200 shadow bg-white px-4 py-6 md:px-8 md:py-10 flex flex-col items-center w-full max-w-lg">
          <div className="flex items-center justify-center w-full">
            <img src="/logonuevoalto.png" alt="MercadoTiendas Logo" className="w-32 md:w-48 h-auto" />

        </div>
        <div className="mt-6 w-full max-w-md px-4 flex flex-col items-center">
          <h1 className="text-2xl font-medium my-4 text-center">
            Restablece tu contraseña
          </h1>
          <p className="text-gray-600 text-center w-11/12 text-sm mb-6">
            Ingresa la nueva contraseña
          </p>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success ? (
            <p className="text-green-500 text-sm mb-4 text-center">
              ¡Contraseña restablecida con éxito! Serás redirigido al inicio de sesión.
            </p>
          ) : (
            <Form
              fields={fields}
              values={values}
              onChange={(name, value) =>
                setValues((prev) => ({ ...prev, [name]: value }))
              }
              onSubmit={handleSubmit}
              submitComponent={
                <div className="mt-8 w-full">
                  <DesignButton
                    className="w-full"
                    type="submit"
                    variant="primary"
                  >
                    Continuar
                  </DesignButton>
                </div>
              }
            />
          )}
          <p className="mt-4 text-sm font-medium text-black text-center">
            ¿No recibiste el código?{' '}
            <button
              type="button"
              className="text-red-500 hover:text-red-700 font-medium"
              onClick={() => {}}
            >
              Enviar nuevamente
            </button>
          </p>
          <button
            type="button"
            className="mt-4 font-semibold text-red-500 hover:text-red-700"
            onClick={() => navigate('/login')}
          >
            Volver al inicio
          </button>
        </div>
      </div>
      </div>
      <FooterHome />
    </div>
  );
}

export default VerifyPassword;