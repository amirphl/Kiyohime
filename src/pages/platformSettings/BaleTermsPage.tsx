import React from 'react';

interface BaleTermsPageProps {
  title: string;
  content: string;
}

const BaleTermsPage: React.FC<BaleTermsPageProps> = ({ title, content }) => {
  return (
    <div className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'>
      <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
      <p className='whitespace-pre-line text-sm leading-7 text-gray-700'>
        {content}
      </p>
    </div>
  );
};

export default BaleTermsPage;
