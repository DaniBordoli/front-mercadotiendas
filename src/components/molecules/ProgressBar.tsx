import React from 'react';

interface ProgressBarProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: 'Revisión del carrito' },
  { number: 2, label: 'Datos de envío' },
  { number: 3, label: 'Pago' },
  { number: 4, label: 'Confirmación' }
];

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center mb-6 px-2">
      {/* Mobile Layout */}
      <div className="md:hidden flex items-center justify-between w-full px-1 overflow-x-auto">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          const isUpcoming = step.number > currentStep;
          
          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center min-w-0 flex-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white font-semibold text-xs ${
                  isCompleted 
                    ? 'bg-[#00a699]' 
                    : isActive 
                    ? 'bg-[#ff4f41]' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {isCompleted ? (
                    <i className="fa-solid fa-check" style={{fontSize: '8px'}}></i>
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`mt-1 text-[10px] font-medium text-center leading-tight px-1 ${
                  isCompleted 
                    ? 'text-[#00a699]' 
                    : isActive 
                    ? 'text-[#ff4f41]' 
                    : 'text-gray-600'
                }`} style={{fontSize: '9px', lineHeight: '10px'}}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-4 h-0.5 flex-shrink-0 mx-1 ${
                  step.number < currentStep ? 'bg-[#00a699]' : 'bg-gray-300'
                }`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center space-x-8">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          const isUpcoming = step.number > currentStep;
          
          return (
            <React.Fragment key={step.number}>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                  isCompleted 
                    ? 'bg-[#00a699]' 
                    : isActive 
                    ? 'bg-[#ff4f41]' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {isCompleted ? (
                    <i className="fa-solid fa-check text-xs"></i>
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`ml-3 font-medium ${
                  isCompleted 
                    ? 'text-[#00a699]' 
                    : isActive 
                    ? 'text-[#ff4f41]' 
                    : 'text-gray-600'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 ${
                  step.number < currentStep ? 'bg-[#00a699]' : 'bg-gray-300'
                }`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;