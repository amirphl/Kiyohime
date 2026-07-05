import React from 'react';
import { BarChart3, Eye, Rocket } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';
import { BundleListItem } from '../../../types/bundle';
import { BundlesCopy } from '../translations';
import {
  formatBundleRate,
  formatBundleNumber,
  getBundleClickRate,
  getBundleCustomerName,
  getBundleTotalCampaigns,
  getBundleSentCount,
  getBundleTitle,
} from '../utils';
import BundlesPagination from './BundlesPagination';

interface BundlesTableProps {
  copy: BundlesCopy;
  isAgency: boolean;
  items: BundleListItem[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onActionClick: (action: string, bundle: BundleListItem) => void;
}

interface BundleDesktopColumn {
  key: string;
  header: string;
  className: string;
  cellClassName: string;
  render: (bundle: BundleListItem) => React.ReactNode;
}

interface BundleMobileField {
  key: string;
  label: string;
  value: (bundle: BundleListItem) => string;
  valueClassName: string;
}

const actionButtonClass =
  'inline-flex min-h-11 min-w-0 items-center justify-center gap-0.5 rounded-lg border border-gray-200 bg-white px-1 py-1 text-center text-[9px] font-medium leading-3 text-gray-700 transition hover:border-primary-200 hover:text-primary-700';

const TRUNCATION_LENGTHS = {
  title: 22,
  customer: 20,
};

const truncateText = (value: string, maxLength: number): string => {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;

  return `${normalized.slice(0, maxLength - 3)}...`;
};

const renderTruncatedText = (
  value: string,
  maxLength: number,
  className = ''
) => {
  const normalized = value.replace(/\s+/g, ' ').trim();
  const isTruncated = normalized.length > maxLength;

  return (
    <div
      className={`mx-auto max-w-full truncate whitespace-nowrap ${className}`}
      title={isTruncated ? normalized : undefined}
    >
      {isTruncated ? truncateText(normalized, maxLength) : normalized}
    </div>
  );
};

const BundlesTable: React.FC<BundlesTableProps> = ({
  copy,
  isAgency,
  items,
  page,
  limit,
  totalItems,
  totalPages,
  onPageChange,
  onLimitChange,
  onActionClick,
}) => {
  const { language } = useLanguage();
  const locale = language === 'fa' ? 'fa-IR' : 'en-US';

  const renderActions = (bundle: BundleListItem) => (
    <div className='grid grid-cols-2 gap-1 xl:grid-cols-3'>
      <button
        type='button'
        className={`${actionButtonClass} flex-col`}
        onClick={() => onActionClick('view', bundle)}
      >
        <Eye className='h-4 w-4 shrink-0' />
        <span className='max-w-full truncate'>{copy.actions.view}</span>
      </button>
      <button
        type='button'
        className={`${actionButtonClass} flex-col`}
        onClick={() => onActionClick('reports', bundle)}
      >
        <BarChart3 className='h-4 w-4 shrink-0' />
        <span className='max-w-full truncate'>{copy.actions.reports}</span>
      </button>
      <button
        type='button'
        className={`${actionButtonClass} flex-col`}
        onClick={() => onActionClick('runNow', bundle)}
      >
        <Rocket className='h-4 w-4 shrink-0' />
        <span className='max-w-full truncate'>{copy.actions.new}</span>
      </button>
    </div>
  );

  const desktopColumns: BundleDesktopColumn[] = [
    {
      key: 'title',
      header: copy.table.title,
      className: 'w-[17%]',
      render: (bundle: BundleListItem) => (
        <>
          {renderTruncatedText(
            getBundleTitle(bundle, copy.states.unknown),
            TRUNCATION_LENGTHS.title
          )}
          {bundle.id > 0 && (
            <div className='mt-1 truncate whitespace-nowrap text-[10px] font-medium text-gray-400'>
              {copy.table.bundleId}: {bundle.id}
            </div>
          )}
        </>
      ),
      cellClassName: 'text-xs font-semibold text-gray-900',
    },
    ...(isAgency
      ? [
          {
            key: 'customer',
            header: copy.table.customer,
            className: 'w-[14%]',
            render: (bundle: BundleListItem) =>
              renderTruncatedText(
                getBundleCustomerName(bundle),
                TRUNCATION_LENGTHS.customer
              ),
            cellClassName: 'text-xs text-gray-600',
          },
        ]
      : []),
    {
      key: 'totalCampaigns',
      header: copy.table.totalCampaigns,
      className: isAgency ? 'w-[11%]' : 'w-[14%]',
      render: (bundle: BundleListItem) =>
        formatBundleNumber(getBundleTotalCampaigns(bundle), locale),
      cellClassName: 'text-xs text-gray-900',
    },
    {
      key: 'delivered',
      header: copy.table.delivered,
      className: isAgency ? 'w-[11%]' : 'w-[14%]',
      render: (bundle: BundleListItem) =>
        formatBundleNumber(getBundleSentCount(bundle), locale),
      cellClassName: 'text-xs text-gray-900',
    },
    {
      key: 'averageClickRate',
      header: copy.table.averageClickRate,
      className: isAgency ? 'w-[12%]' : 'w-[15%]',
      render: (bundle: BundleListItem) =>
        formatBundleRate(
          getBundleClickRate(bundle),
          locale,
          copy.states.noClickRate
        ),
      cellClassName: 'text-xs font-semibold text-primary-700',
    },
    {
      key: 'actions',
      header: copy.table.actions,
      className: isAgency ? 'w-[22%]' : 'w-[23%]',
      render: (bundle: BundleListItem) => renderActions(bundle),
      cellClassName: '',
    },
  ];

  const mobileFields: BundleMobileField[] = [
    ...(isAgency
      ? [
          {
            key: 'customer',
            label: copy.table.customer,
            value: (bundle: BundleListItem) => getBundleCustomerName(bundle),
            valueClassName: 'font-medium text-gray-900',
          },
        ]
      : []),
    {
      key: 'delivered',
      label: copy.table.delivered,
      value: (bundle: BundleListItem) =>
        formatBundleNumber(getBundleSentCount(bundle), locale),
      valueClassName: 'font-medium text-gray-900',
    },
    {
      key: 'totalCampaigns',
      label: copy.table.totalCampaigns,
      value: (bundle: BundleListItem) =>
        formatBundleNumber(getBundleTotalCampaigns(bundle), locale),
      valueClassName: 'font-medium text-gray-900',
    },
    {
      key: 'averageClickRate',
      label: copy.table.averageClickRate,
      value: (bundle: BundleListItem) =>
        formatBundleRate(
          getBundleClickRate(bundle),
          locale,
          copy.states.noClickRate
        ),
      valueClassName: 'font-semibold text-primary-700',
    },
  ];

  return (
    <section className='overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm'>
      <div className='hidden xl:block'>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-0 table-fixed divide-y divide-gray-200'>
            <colgroup>
              {desktopColumns.map(column => (
                <col key={column.key} className={column.className} />
              ))}
            </colgroup>
            <thead className='bg-gray-50'>
              <tr>
                {desktopColumns.map(column => (
                  <th
                    key={column.key}
                    className='px-1.5 py-3 text-center text-[10px] font-semibold uppercase tracking-normal text-gray-500'
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {items.map(bundle => (
                <tr key={`${bundle.id}`}>
                  {desktopColumns.map(column => (
                    <td
                      key={column.key}
                      className={`px-1.5 py-3 text-center ${column.cellClassName}`}
                    >
                      {column.render(bundle)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className='space-y-4 p-4 xl:hidden sm:p-6'>
        {items.map(bundle => {
          return (
            <article
              key={`${bundle.id}-${bundle.title}`}
              className='rounded-2xl border border-gray-200 p-4 shadow-sm'
            >
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <h3 className='text-base font-semibold text-gray-900'>
                    {getBundleTitle(bundle, copy.states.unknown)}
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    {copy.table.bundleId}: {bundle.id}
                  </p>
                </div>
              </div>

              <dl className='mt-4 grid grid-cols-2 gap-3 text-sm'>
                {mobileFields.map(field => (
                  <div key={field.key}>
                    <dt className='text-gray-500'>{field.label}</dt>
                    <dd className={`mt-1 ${field.valueClassName}`}>
                      {field.value(bundle)}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className='mt-4'>{renderActions(bundle)}</div>
            </article>
          );
        })}
      </div>

      <BundlesPagination
        copy={copy}
        page={page}
        limit={limit}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </section>
  );
};

export default BundlesTable;
