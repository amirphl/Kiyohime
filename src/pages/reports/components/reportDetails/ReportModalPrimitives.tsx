import React from 'react';

interface ReportModalShellProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const ReportModalShell: React.FC<ReportModalShellProps> = ({
  title,
  subtitle,
  badge,
  actions,
  children,
}) => {
  return (
    <div className='fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4'>
      <div className='flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[92vh] sm:max-w-6xl sm:rounded-[2rem]'>
        <div className='bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_32%),linear-gradient(135deg,_#0f172a,_#1e293b_55%,_#334155)] px-5 pb-6 pt-5 text-white sm:px-8 sm:pt-7'>
          <div className='flex items-start justify-between gap-4'>
            <div className='min-w-0 flex-1'>
              <div className='mb-3 flex flex-wrap items-center gap-3'>
                <h2 className='truncate text-xl font-semibold sm:text-2xl'>
                  {title}
                </h2>
                {badge}
              </div>
              {subtitle ? (
                <p className='font-mono text-xs text-slate-300 sm:text-sm'>
                  {subtitle}
                </p>
              ) : null}
            </div>
            {actions}
          </div>
        </div>

        <div className='min-h-0 flex-1 overflow-y-auto bg-slate-100/80 px-4 py-4 sm:px-8 sm:py-6'>
          <div className='space-y-4'>{children}</div>
        </div>
      </div>
    </div>
  );
};

interface ReportSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const ReportSection: React.FC<ReportSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <section className='overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]'>
      <div className='border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6'>
        <h3 className='text-base font-semibold text-slate-900'>{title}</h3>
        {description ? (
          <p className='mt-1 text-sm text-slate-500'>{description}</p>
        ) : null}
      </div>
      <div className='px-5 py-5 sm:px-6'>{children}</div>
    </section>
  );
};

export const ReportFieldGrid: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>{children}</div>
  );
};

interface ReportFieldProps {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}

export const ReportField: React.FC<ReportFieldProps> = ({
  label,
  value,
  fullWidth = false,
}) => {
  return (
    <article
      className={`rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 ${fullWidth ? 'md:col-span-2 xl:col-span-3' : ''}`}
    >
      <p className='mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400'>
        {label}
      </p>
      <div className='text-sm leading-7 text-slate-900 break-words'>
        {value}
      </div>
    </article>
  );
};
