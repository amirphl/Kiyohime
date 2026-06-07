import React, { useState } from 'react';
import { AdminLineNumberDTO } from '../../../types/admin';
import { AdminLineNumbersCopy } from '../translations';
import { formatBooleanLabel, getDisplayValue } from '../utils';

interface LineNumbersTableProps {
  copy: AdminLineNumbersCopy;
  items: AdminLineNumberDTO[];
  loading: boolean;
  error: string | null;
  hasOrderChanges: boolean;
  savingOrder: boolean;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onSaveOrder: () => void;
}

const LineNumbersTable: React.FC<LineNumbersTableProps> = ({
  copy,
  items,
  loading,
  error,
  hasOrderChanges,
  savingOrder,
  onReorder,
  onSaveOrder,
}) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDrop = (targetIndex: number) => {
    if (dragIndex == null) {
      return;
    }

    onReorder(dragIndex, targetIndex);
    setDragIndex(null);
  };

  return (
    <section className='mt-6'>
      <div className='mb-3 flex items-center justify-between gap-4'>
        <div>
          <h2 className='text-lg font-medium text-gray-900'>
            {copy.table.title}
          </h2>
          <p className='mt-1 text-sm text-gray-500'>{copy.reorderHint}</p>
        </div>
        <button
          type='button'
          className='rounded bg-green-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60'
          onClick={onSaveOrder}
          disabled={savingOrder || !hasOrderChanges || Boolean(error)}
        >
          {savingOrder ? copy.common.loading : copy.common.save}
        </button>
      </div>

      {loading ? (
        <div className='rounded border border-dashed border-gray-300 px-4 py-8 text-sm text-gray-500'>
          {copy.common.loading}
        </div>
      ) : (
        <div className='overflow-x-auto rounded border border-gray-200'>
          <table className='min-w-full text-sm'>
            <thead className='bg-gray-50 text-gray-700'>
              <tr>
                <th className='border-b px-3 py-2 text-left'>
                  {copy.table.row}
                </th>
                <th className='border-b px-3 py-2 text-left'>
                  {copy.table.lineNumber}
                </th>
                <th className='border-b px-3 py-2 text-left'>
                  {copy.table.priority}
                </th>
                <th className='border-b px-3 py-2 text-left'>
                  {copy.table.priceFactor}
                </th>
                <th className='border-b px-3 py-2 text-left'>
                  {copy.table.active}
                </th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td
                    colSpan={5}
                    className='px-3 py-6 text-center text-red-600'
                  >
                    {error}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className='px-3 py-6 text-center text-gray-500'
                  >
                    {copy.table.noItems}
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr
                    key={item.uuid || item.id}
                    className='cursor-move border-b last:border-b-0 odd:bg-white even:bg-gray-50'
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragOver={event => event.preventDefault()}
                    onDrop={() => handleDrop(index)}
                    onDragEnd={() => setDragIndex(null)}
                  >
                    <td className='px-3 py-2'>{index + 1}</td>
                    <td className='px-3 py-2'>
                      {getDisplayValue(item.line_number, copy.common.empty)}
                    </td>
                    <td className='px-3 py-2'>
                      {getDisplayValue(item.priority, copy.common.empty)}
                    </td>
                    <td className='px-3 py-2'>
                      {getDisplayValue(item.price_factor, copy.common.empty)}
                    </td>
                    <td className='px-3 py-2'>
                      {formatBooleanLabel(item.is_active, copy)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default LineNumbersTable;
