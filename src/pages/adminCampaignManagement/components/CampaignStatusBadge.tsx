import React from 'react';

interface CampaignStatusBadgeProps {
  label: string;
}

const CampaignStatusBadge: React.FC<CampaignStatusBadgeProps> = ({ label }) => {
  return (
    <span className='inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700'>
      {label}
    </span>
  );
};

export default CampaignStatusBadge;
