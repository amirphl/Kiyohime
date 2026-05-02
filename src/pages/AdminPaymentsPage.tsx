import React, { useState } from 'react';
import AdminChargeWalletSection from './adminPayments/components/AdminChargeWalletSection';
import AdminDepositReceiptsSection from './adminPayments/components/AdminDepositReceiptsSection';
import AdminTransactionsSection from './adminPayments/components/AdminTransactionsSection';

const AdminPaymentsPage: React.FC = () => {
  const [transactionsRefreshKey, setTransactionsRefreshKey] = useState(0);

  return (
    <div className='p-4'>
      <div className='max-w-5xl mx-auto space-y-4'>
        <AdminChargeWalletSection />
        <AdminDepositReceiptsSection
          onReceiptStatusUpdated={() =>
            setTransactionsRefreshKey(prev => prev + 1)
          }
        />
        <AdminTransactionsSection refreshSignal={transactionsRefreshKey} />
      </div>
    </div>
  );
};

export default AdminPaymentsPage;
