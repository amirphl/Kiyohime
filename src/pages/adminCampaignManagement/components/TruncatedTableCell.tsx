import React from 'react';
import { truncateText } from '../utils';

interface TruncatedTableCellProps {
  value?: string | null;
  emptyLabel: string;
  alignClass: 'text-left' | 'text-right';
  maxLength?: number;
}

const TruncatedTableCell: React.FC<TruncatedTableCellProps> = ({
  value,
  emptyLabel,
  alignClass,
  maxLength = 48,
}) => {
  const normalized = value?.trim() || '';

  return (
    <td
      className={`border px-2 py-2 align-top ${alignClass}`}
      title={normalized || undefined}
    >
      <div className='max-w-full truncate whitespace-nowrap'>
        {normalized ? truncateText(normalized, maxLength) : emptyLabel}
      </div>
    </td>
  );
};

export default TruncatedTableCell;
