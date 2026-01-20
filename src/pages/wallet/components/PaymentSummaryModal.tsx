import React from 'react';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { useTranslation } from '../../../hooks/useTranslation';
import { WalletCopy } from '../translations';

interface PaymentSummaryModalProps {
  isOpen: boolean;
  amount: number;
  currencyLabel: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  copy: WalletCopy;
}

const PaymentSummaryModal: React.FC<PaymentSummaryModalProps> = ({
  isOpen,
  amount,
  currencyLabel,
  loading,
  onConfirm,
  onCancel,
  copy,
}) => {
  const tax = Math.round(amount * 0.1);
  const total = amount + tax;
  const { t } = useTranslation();

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onConfirm={onConfirm}
      onCancel={onCancel}
      title={copy.modalTitle}
      confirmText={t('common.continue')}
      cancelText={t('common.cancel')}
      loading={loading}
    >
      <div className='space-y-3'>
        <div className='flex justify-between'>
          <span className='text-gray-600'>{copy.modalChargeAmount}</span>
          <span className='font-medium'>
            {amount.toLocaleString()} {currencyLabel}
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-600'>{copy.modalTax}</span>
          <span className='font-medium'>
            {tax.toLocaleString()} {currencyLabel}
          </span>
        </div>
        <div className='flex justify-between border-t border-gray-200 pt-2'>
          <span className='text-gray-800 font-medium'>
            {copy.modalTotal}
          </span>
          <span className='font-bold'>
            {total.toLocaleString()} {currencyLabel}
          </span>
        </div>
      </div>
    </ConfirmationModal>
  );
};

export default PaymentSummaryModal;
