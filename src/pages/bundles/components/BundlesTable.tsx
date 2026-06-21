import React from 'react';
import { Eye, FlaskConical, Rocket, Send } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';
import { BundleListItem } from '../../../types/bundle';
import { BundlesCopy } from '../translations';
import {
  formatBundleNumber,
  formatBundleRate,
  getBundleCategory,
  getBundleClickRate,
  getBundleClicksCount,
  getBundleCustomerName,
  getBundleTotalRecordsCount,
  getBundleObjective,
  getBundlePersona,
  getBundleSentCount,
  getBundleTitle,
} from '../utils';
import BundlesPagination from './BundlesPagination';

interface BundlesTableProps {
  copy: BundlesCopy;
  items: BundleListItem[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onActionClick: (action: string, bundle: BundleListItem) => void;
}

const actionButtonClass =
  'inline-flex min-h-11 min-w-0 items-center justify-center gap-0.5 rounded-lg border border-gray-200 bg-white px-1 py-1 text-center text-[9px] font-medium leading-3 text-gray-700 transition hover:border-primary-200 hover:text-primary-700';

const TRUNCATION_LENGTHS = {
  title: 22,
  objective: 28,
  persona: 24,
  customer: 20,
  category: 18,
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
    <div className='grid grid-cols-2 gap-1 2xl:grid-cols-4'>
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
        onClick={() => onActionClick('executionCampaigns', bundle)}
      >
        <Send className='h-4 w-4 shrink-0' />
        <span className='max-w-full truncate'>
          {copy.actions.campaignsWithPhaseAsExecution}
        </span>
      </button>
      <button
        type='button'
        className={`${actionButtonClass} flex-col`}
        onClick={() => onActionClick('testCampaigns', bundle)}
      >
        <FlaskConical className='h-4 w-4 shrink-0' />
        <span className='max-w-full truncate'>
          {copy.actions.campaignsWithPhaseAsTest}
        </span>
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

  return (
    <section className='overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm'>
      <div className='hidden xl:block'>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-0 table-fixed divide-y divide-gray-200'>
            <colgroup>
              <col className='w-[11%]' />
              <col className='w-[12%]' />
              <col className='w-[11%]' />
              <col className='w-[10%]' />
              <col className='w-[9%]' />
              <col className='w-[6%]' />
              <col className='w-[6%]' />
              <col className='w-[6%]' />
              <col className='w-[7%]' />
              <col className='w-[22%]' />
            </colgroup>
            <thead className='bg-gray-50'>
              <tr>
                {[
                  copy.table.title,
                  copy.table.objective,
                  copy.table.persona,
                  copy.table.customer,
                  copy.table.category,
                  copy.table.totalSent,
                  copy.table.delivered,
                  copy.table.clicks,
                  copy.table.clickRate,
                  copy.table.actions,
                ].map(header => (
                  <th
                    key={header}
                    className='px-1.5 py-3 text-center text-[10px] font-semibold uppercase tracking-normal text-gray-500'
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {items.map(bundle => {
                return (
                  <tr key={`${bundle.id}`}>
                    <td className='px-1.5 py-3 text-center text-xs font-semibold text-gray-900'>
                      {renderTruncatedText(
                        getBundleTitle(bundle, copy.states.unknown),
                        TRUNCATION_LENGTHS.title
                      )}
                      {bundle.id > 0 && (
                        <div className='mt-1 truncate whitespace-nowrap text-[10px] font-medium text-gray-400'>
                          {copy.table.bundleId}: {bundle.id}
                        </div>
                      )}
                    </td>
                    <td className='px-1.5 py-3 text-center text-xs text-gray-600'>
                      {renderTruncatedText(
                        getBundleObjective(bundle, copy.states.unknown),
                        TRUNCATION_LENGTHS.objective
                      )}
                    </td>
                    <td className='px-1.5 py-3 text-center text-xs text-gray-600'>
                      {renderTruncatedText(
                        getBundlePersona(bundle, copy.states.unknown),
                        TRUNCATION_LENGTHS.persona
                      )}
                    </td>
                    <td className='px-1.5 py-3 text-center text-xs text-gray-600'>
                      {renderTruncatedText(
                        getBundleCustomerName(bundle),
                        TRUNCATION_LENGTHS.customer
                      )}
                    </td>
                    <td className='px-1.5 py-3 text-center text-xs text-gray-600'>
                      {renderTruncatedText(
                        getBundleCategory(bundle, copy.states.unknown),
                        TRUNCATION_LENGTHS.category
                      )}
                    </td>
                    <td className='px-1.5 py-3 text-center text-xs text-gray-900'>
                      {formatBundleNumber(
                        getBundleTotalRecordsCount(bundle),
                        locale
                      )}
                    </td>
                    <td className='px-1.5 py-3 text-center text-xs text-gray-900'>
                      {formatBundleNumber(getBundleSentCount(bundle), locale)}
                    </td>
                    <td className='px-1.5 py-3 text-center text-xs text-gray-900'>
                      {formatBundleNumber(getBundleClicksCount(bundle), locale)}
                    </td>
                    <td className='px-1.5 py-3 text-center text-xs font-semibold text-primary-700'>
                      {formatBundleRate(
                        getBundleClickRate(bundle),
                        locale,
                        copy.states.noClickRate
                      )}
                    </td>
                    <td className='px-1.5 py-3'>{renderActions(bundle)}</td>
                  </tr>
                );
              })}
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
                <div>
                  <dt className='text-gray-500'>{copy.table.objective}</dt>
                  <dd className='mt-1 font-medium text-gray-900'>
                    {getBundleObjective(bundle, copy.states.unknown)}
                  </dd>
                </div>
                <div>
                  <dt className='text-gray-500'>{copy.table.persona}</dt>
                  <dd className='mt-1 font-medium text-gray-900'>
                    {getBundlePersona(bundle, copy.states.unknown)}
                  </dd>
                </div>
                <div>
                  <dt className='text-gray-500'>{copy.table.customer}</dt>
                  <dd className='mt-1 font-medium text-gray-900'>
                    {getBundleCustomerName(bundle)}
                  </dd>
                </div>
                <div>
                  <dt className='text-gray-500'>{copy.table.category}</dt>
                  <dd className='mt-1 font-medium text-gray-900'>
                    {getBundleCategory(bundle, copy.states.unknown)}
                  </dd>
                </div>
                <div>
                  <dt className='text-gray-500'>{copy.table.delivered}</dt>
                  <dd className='mt-1 font-medium text-gray-900'>
                    {formatBundleNumber(getBundleSentCount(bundle), locale)}
                  </dd>
                </div>
                <div>
                  <dt className='text-gray-500'>{copy.table.totalSent}</dt>
                  <dd className='mt-1 font-medium text-gray-900'>
                    {formatBundleNumber(
                      getBundleTotalRecordsCount(bundle),
                      locale
                    )}
                  </dd>
                </div>
                <div>
                  <dt className='text-gray-500'>{copy.table.clicks}</dt>
                  <dd className='mt-1 font-medium text-gray-900'>
                    {formatBundleNumber(getBundleClicksCount(bundle), locale)}
                  </dd>
                </div>
                <div>
                  <dt className='text-gray-500'>{copy.table.clickRate}</dt>
                  <dd className='mt-1 font-semibold text-primary-700'>
                    {formatBundleRate(
                      getBundleClickRate(bundle),
                      locale,
                      copy.states.noClickRate
                    )}
                  </dd>
                </div>
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
