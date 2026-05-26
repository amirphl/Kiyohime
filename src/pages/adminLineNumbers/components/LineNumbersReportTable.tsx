import React from 'react';
import { AdminLineNumberReportItem } from '../../../types/admin';
import { AdminLineNumbersCopy } from '../translations';

interface LineNumbersReportTableProps {
  copy: AdminLineNumbersCopy;
  items: AdminLineNumberReportItem[];
  loading: boolean;
  error: string | null;
}

const LineNumbersReportTable: React.FC<LineNumbersReportTableProps> = ({
  copy,
  items,
  loading,
  error,
}) => (
  <section className='mt-8'>
    <h2 className='mb-3 text-lg font-medium text-gray-900'>{copy.report.title}</h2>

    {loading ? (
      <div className='rounded border border-dashed border-gray-300 px-4 py-8 text-sm text-gray-500'>
        {copy.common.loading}
      </div>
    ) : (
      <div className='overflow-x-auto rounded border border-gray-200'>
        <table className='min-w-full text-sm'>
          <thead className='bg-gray-50 text-gray-700'>
            <tr>
              <th className='border-b px-3 py-2 text-left'>{copy.report.lineNumber}</th>
              <th className='border-b px-3 py-2 text-left'>{copy.report.totalSent}</th>
              <th className='border-b px-3 py-2 text-left'>
                {copy.report.totalPartsSent}
              </th>
              <th className='border-b px-3 py-2 text-left'>
                {copy.report.totalArrivedPartsSent}
              </th>
              <th className='border-b px-3 py-2 text-left'>
                {copy.report.totalNonArrivedPartsSent}
              </th>
              <th className='border-b px-3 py-2 text-left'>{copy.report.totalIncome}</th>
              <th className='border-b px-3 py-2 text-left'>{copy.report.totalCost}</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={7} className='px-3 py-6 text-center text-red-600'>
                  {error}
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className='px-3 py-6 text-center text-gray-500'>
                  {copy.report.noItems}
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr
                  key={`${item.line_number}-${index}`}
                  className='border-b last:border-b-0 odd:bg-white even:bg-gray-50'
                >
                  <td className='px-3 py-2'>{item.line_number}</td>
                  <td className='px-3 py-2'>{item.total_sent}</td>
                  <td className='px-3 py-2'>{item.total_parts_sent}</td>
                  <td className='px-3 py-2'>{item.total_arrived_parts_sent}</td>
                  <td className='px-3 py-2'>{item.total_non_arrived_parts_sent}</td>
                  <td className='px-3 py-2'>{item.total_income}</td>
                  <td className='px-3 py-2'>{item.total_cost}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

export default LineNumbersReportTable;

