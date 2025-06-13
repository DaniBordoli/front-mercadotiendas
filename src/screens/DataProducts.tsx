import * as React from 'react';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import MyProductsSection from './MyProductsSection';

const DataProducts: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F8F8] flex">
      <DataSideBar />
      <div className="flex flex-col flex-grow p-4 md:p-10 md:ml-[250px]">
        <MyProductsSection />
      </div>
    </div>
  );
};

export default DataProducts;
