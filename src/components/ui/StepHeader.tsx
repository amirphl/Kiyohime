import React from 'react';

interface StepHeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  className?: string;
}

const StepHeader: React.FC<StepHeaderProps> = ({
  title,
  subtitle,
  icon,
  className = '',
}) => {
  return (
    <div className={`text-center space-y-2 ${className}`}>
      {icon && (
        <div className="flex justify-center">
          <div className="p-3 bg-primary-100 rounded-full">
            {icon}
          </div>
        </div>
      )}
      
      <h2 className="text-2xl font-bold text-gray-900">
        {title}
      </h2>
      
      <p className="text-gray-600 max-w-md mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

export default StepHeader; 