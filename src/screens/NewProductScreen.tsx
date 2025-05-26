import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DesignButton } from '../components/atoms/DesignButton/DesignButton';
import { FaArrowLeft } from 'react-icons/fa6';
import { FaCheck } from 'react-icons/fa';
import { colors } from '../design/colors';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import StepBasicInfo from '../components/organisms/NewProductComponents/StepBasicInfo';
import ImageStep from '../components/organisms/NewProductComponents/ImageStep';
import VariantsStep from '../components/organisms/NewProductComponents/VariantsStep';
import ProductSuccessModal from '../components/organisms/NewProductComponents/ProductSuccessModal';
const steps = [
  { label: 'Información Básica' },
  { label: 'Imágenes' },
  { label: 'Variantes' },
];

const NewProductScreen: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [showModal, setShowModal] = React.useState(false);

  const handlePublish = () => setShowModal(true);

  return (
    <div className="min-h-screen flex">
      <DataSideBar />
      <div className="flex flex-col flex-grow ml-[250px]">

        <div className="w-full flex items-center justify-between px-8 h-[80px] bg-white border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              aria-label="Volver"
            >
              <FaArrowLeft className="text-gray-500" />
            </button>
            <h1 className="text-2xl font-space">Nuevo Producto</h1>
          </div>
          <div className="flex items-center gap-2">
            <DesignButton variant="neutral">Cancelar</DesignButton>
            <DesignButton variant="secondary">Guardar Borrador</DesignButton>
            <DesignButton
              variant="primary"
              disabled={step !== 3}
              onClick={step === 3 ? handlePublish : undefined}
            >
              Publicar Producto
            </DesignButton>
          </div>
        </div>
       
        <div className="w-full flex items-center px-8 py-6 bg-white border-b border-gray-100">
          <div className="flex items-center gap-8">
            {steps.map((s, idx) => {
              const stepNum = idx + 1;
              const isActive = step === stepNum;
              const isCompleted = step > stepNum;
              return (
                <React.Fragment key={s.label}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center border-2"
                      style={{
                        borderColor: isActive || isCompleted ? colors.primaryRed : '#E5E5E7',
                        background: isActive
                          ? colors.primaryRed
                          : isCompleted
                          ? colors.primaryRed
                          : '#fff',
                        color: isActive || isCompleted ? '#fff' : colors.primaryRed,
                        fontWeight: 600,
                        transition: 'background 0.2s, border 0.2s',
                      }}
                    >
                      {isCompleted ? <FaCheck size={14} /> : stepNum}
                    </div>
                    <span
                      className="font-space text-sm"
                      style={{
                        color: isActive
                          ? colors.primaryRed
                          : isCompleted
                          ? colors.primaryRed
                          : '#aaa',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="h-0.5 w-12 bg-gray-200" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        
        {step === 1 && <StepBasicInfo onNext={() => setStep(2)} />}
        {step === 2 && <ImageStep onNext={() => setStep(3)} />}
        {step === 3 && <VariantsStep />}
      
        {showModal && <ProductSuccessModal onClose={() => setShowModal(false)} />}
      </div>
    </div>
  );
};

export default NewProductScreen;
