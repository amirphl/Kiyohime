import React from 'react';
import AdminChargeWalletSection from './adminPayments/components/AdminChargeWalletSection';
import AdminDepositReceiptsSection from './adminPayments/components/AdminDepositReceiptsSection';

const AdminPaymentsPage: React.FC = () => {
  return (
    <div className='p-4'>
      <div className='max-w-5xl mx-auto space-y-4'>
        <AdminChargeWalletSection />
        <AdminDepositReceiptsSection />
      </div>
    </div>
  );
};

export default AdminPaymentsPage;
