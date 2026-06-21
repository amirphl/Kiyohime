import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { BundlesCopy } from '../translations';

interface BundleFormHeaderProps {
  copy: BundlesCopy;
  onBack: () => void;
}

const BundleFormHeader: React.FC<BundleFormHeaderProps> = ({
  copy,
  onBack,
}) => {
  return (
    <section className='rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8'>
      <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
        <div>
          <div className='flex flex-wrap items-center gap-2 text-sm text-gray-500'>
            <span>{copy.breadcrumbs.dashboard}</span>
            <span>/</span>
            <span>{copy.breadcrumbs.bundles}</span>
            <span>/</span>
            <span className='font-medium text-primary-700'>
              {copy.breadcrumbs.create}
            </span>
          </div>
          <h1 className='mt-4 text-3xl font-bold text-gray-900 sm:text-4xl'>
            {copy.createPage.title}
          </h1>
          <p className='mt-3 max-w-3xl text-sm leading-7 text-gray-500 sm:text-base'>
            {copy.createPage.subtitle}
          </p>
        </div>

        <Button variant='outline' icon={ArrowLeft} onClick={onBack}>
          {copy.createPage.back}
        </Button>
      </div>
    </section>
  );
};

export default BundleFormHeader;
