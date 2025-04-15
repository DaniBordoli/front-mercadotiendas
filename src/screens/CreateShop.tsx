import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { CenteredBox } from '../components/templates/CenteredBox';
import { Form } from '../components/organisms/Form';
import { FaStore } from 'react-icons/fa';


function CreateShop() {
  const navigate = useNavigate();
  const { createShop, isLoading, error, clearError } = useAuthStore();
  const [values, setValues] = useState({
    shopName: '',
    category: '',
    address: '',
    brandName: '',
    contactEmail: '',
    shopPhone: ''
  });

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const shopData = {
        shopName: values.shopName,
        category: values.category,
        address: values.address,
        brandName: values.brandName,
        contactEmail: values.contactEmail,
        shopPhone: values.shopPhone
      
      };


      await createShop(shopData);
      navigate('/dashboard');
    } catch (error) {}
  };

  const fields = [
    {
      type: 'text' as const,
      name: 'shopName',
      label: 'Shop Name',
      placeholder: 'Enter your shop name*',
      required: true
    },
    {
      type: 'select' as const,
      name: 'category',
      label: 'Category',
      placeholder: 'Select a category*',
      required: true,
      options: [
        { value: 'food', label: 'Food & Beverages' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'fashion', label: 'Fashion' },
        { value: 'home', label: 'Home & Garden' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      type: 'text' as const,
      name: 'address',
      label: 'Address',
      placeholder: 'Enter your shop address*',
      required: true
    },
    {
      type: 'text' as const,
      name: 'brandName',
      label: 'Brand Name',
      placeholder: 'Enter your brand name*',
      required: true
    },
    {
      type: 'email' as const,
      name: 'contactEmail',
      label: 'Contact Email',
      placeholder: 'Enter your contact email*',
      required: true
    },
    {
      type: 'text' as const,
      name: 'shopPhone',
      label: 'Shop Phone',
      placeholder: 'Enter your shop phone number*',
      required: true
    }
  ];

  return (
    <CenteredBox height="600px">
      <div className="flex flex-col items-center mt-4">
        <div className="flex items-center mb-8">
          <span className="text-green-500 text-3xl mr-2">
            <FaStore size={28} color="skyblue" />
          </span>
          <h1 className="text-2xl font-bold text-sky-500">MercadoTiendas</h1>
        </div>

        <h2 className="text-2xl font-semibold mb-6">Create Your Shop</h2>
        <p className="text-center text-gray-600 text-sm mb-8">
          Fill in your shop details to get started
        </p>

        <Form
          fields={fields}
          values={values}
          onChange={(name, value) => {
            clearError();
            setValues(prev => ({ ...prev, [name]: value }));
          }}
          onSubmit={handleSubmit}
          errors={error ? { shopName: error } : {}}
          submitText="Create Shop"
          loading={isLoading}
        />

        <p className="mt-6 text-sm text-gray-500">
          By creating a shop, you agree to our{' '}
          <button className="text-sky-500 hover:text-sky-600 font-medium">
            Terms and Conditions
          </button>
        </p>
      </div>
    </CenteredBox>
  );
}

export default CreateShop;