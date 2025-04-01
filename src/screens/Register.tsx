import React, { useState, useEffect } from 'react';
import CenteredBox from '../components/atoms/CenteredBox';
import { FaStore } from 'react-icons/fa';
import InputField from '../components/atoms/InputField';
import Button from '../components/atoms/Button';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/atoms/Loading';

function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900); 
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <CenteredBox width="400px" height="540px">
      <div className="flex flex-col items-center mt-24">
        <div className="flex items-center">
          <span className="text-green-500 text-3xl mr-2">
            <FaStore size={28} color="skyblue" />
          </span>
          <h1 className="text-2xl font-bold text-sky-500">Mercado tienda</h1>
        </div>
        <h2 className="text-2xl font-semibold my-6">Te damos la bienvenida</h2>
        <p className="text-center text-[14px] mb-6">Inicia el registro de tu MercadoTienda</p>
        <InputField type="email" placeholder="Email*" />
        <Button onClick={() => navigate('/createShop')}>Continuar</Button>
      </div>
      <h1
        className="text-[14px] font-bold text-sky-500 ml-4 mt-4 cursor-pointer"
        onClick={() => navigate('/login')}
      >
        Iniciar sesión en tu MercadoTienda
      </h1>
    </CenteredBox>
  );
}

export default Register;