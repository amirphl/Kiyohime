import React from 'react';
import { Check } from 'lucide-react';
import { CampaignStep } from '../../types/campaign';

interface StepperProps {
  steps: CampaignStep[];
  currentStep: number;
  onStepClick: (step: number) => void;
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  className = '',
}) => {
  return (
    <div className={`py-6 ${className}`}>
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => onStepClick(step.id)}
                disabled={!step.isAccessible}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  step.id === currentStep
                    ? 'border-primary-600 bg-red-600 text-white'
                    : step.isCompleted
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-500'
                } ${
                  step.isAccessible
                    ? 'hover:border-primary-400 cursor-pointer'
                    : 'cursor-not-allowed'
                }`}
              >
                {step.isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </button>
              
              {/* Step label */}
              <div className="ml-3 text-left">
                <div className={`text-sm font-medium ${
                  step.id === currentStep
                    ? 'text-red-600'
                    : step.isCompleted
                      ? 'text-green-600'
                      : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-400">
                  {step.subtitle}
                </div>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  step.isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stepper; 