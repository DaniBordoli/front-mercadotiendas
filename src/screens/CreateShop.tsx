import React, { useState, useEffect } from 'react';

import CenteredBox from '../components/atoms/CenteredBox'
import InputField from '../components/atoms/InputField'
import Button from '../components/atoms/Button'
import SelectField from '../components/atoms/SelectField'
import { FaStore } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/atoms/Loading';

function CreateShop() {
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
      <CenteredBox width="400px" height="520px" className="items-start">
        <div className="flex flex-col items-center mt-4 flex-grow">
          <div className="flex items-center">
            <span className="text-green-500 text-3xl mr-2">
              <FaStore size={28} color="skyblue" />
            </span>
            <h1 className="text-2xl font-bold text-sky-500">Mercado tienda</h1>
          </div>
          <InputField type="email" placeholder="Nombre de la marca" className='mt-16' />
          <p className='text-[12px] ml-4 text-gray-500 text-left self-start'>Se utiliza para crear la URL de tu tienda</p>
          <SelectField 
            options={[
              { value: 'ropa', label: 'Ropa' },
              { value: 'tecnologia', label: 'Tecnología' },
              { value: 'hogar', label: 'Hogar' },
            ]}
          />
          <h1 className='text-[13px] font-semibold w-11/12 text-gray-500 mt-4'>
            Al registrarme declaro que acepto los <u>Términos y condiciones</u> y las <u>Políticas de privacidad de MercadoTienda</u>.
          </h1>
        </div>
        <div className='items-center flex justify-center'> 
        <Button className='h-10 mt-14' onClick={() => navigate('/createShop')}>Crear mi tienda</Button>
        </div>
      </CenteredBox>
    );
  }

export default CreateShop
