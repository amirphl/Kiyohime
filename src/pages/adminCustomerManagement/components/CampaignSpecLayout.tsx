import React from 'react';

export const CampaignSpecSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <section className='space-y-3'>
    <div className='flex items-center gap-3'>
      <h4 className='whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-slate-400'>
        {title}
      </h4>
      <div className='h-px flex-1 bg-slate-100' />
    </div>
    {children}
  </section>
);

export const CampaignSpecInfoGrid: React.FC<{
  children: React.ReactNode;
  columns?: 2 | 3;
}> = ({ children, columns = 2 }) => (
  <div
    className={`grid grid-cols-1 gap-3 ${
      columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
    }`}
  >
    {children}
  </div>
);

export const CampaignSpecInfoItem: React.FC<{
  label: string;
  value: React.ReactNode;
}> = ({ label, value }) => (
  <div className='rounded-xl border border-slate-100 bg-slate-50 px-4 py-3'>
    <p className='mb-1 text-xs text-slate-400'>{label}</p>
    <div className='break-words text-sm font-medium text-slate-800'>
      {value ?? '—'}
    </div>
  </div>
);

export const CampaignSpecTextBlock: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className='rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-800'>
    {children}
  </div>
);
