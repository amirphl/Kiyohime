import React from 'react';
import ModalShell from './ModalShell';
import Button from '../../../components/ui/Button';
import { AdminCustomerManagementCopy } from '../translations';
import { AdminCustomerWithCampaignsResponse } from '../../../types/admin';

interface DetailsModalProps {
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  details: AdminCustomerWithCampaignsResponse | null;
  copy: AdminCustomerManagementCopy;
  onClose: () => void;
  onViewCampaign: (campaignId: number) => void;
  formatDateTime: (iso?: string | null) => string;
  formatNumber: (n?: number | null) => string;
  toPct: (v?: number | null) => string;
}

const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  loading,
  error,
  details,
  copy,
  onClose,
  onViewCampaign,
  formatDateTime,
  formatNumber,
  toPct,
}) => {
  const fields = copy.detailsFields;

  return (
    <ModalShell
      isOpen={isOpen}
      title={copy.modals.detailsTitle}
      onClose={onClose}
      maxWidthClassName="max-w-6xl"
    >
      {loading && (
        <div className="text-sm text-gray-500">{copy.common.loading}</div>
      )}
      {error && !loading && (
        <div className="text-sm text-red-600">{error}</div>
      )}
      {!loading && !error && !details && (
        <div className="text-sm text-gray-500">{copy.modals.detailsNoData}</div>
      )}
      {!loading && !error && details && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem label={fields.id} value={details.customer.id} />
            <InfoItem label={fields.uuid} value={details.customer.uuid} />
            <InfoItem label={fields.agencyRefererCode} value={details.customer.agency_referer_code} />
            <InfoItem label={fields.accountType} value={details.customer.account_type_name} />
            <InfoItem label={fields.company} value={details.customer.company_name || '-'} />
            <InfoItem label={fields.nationalId} value={details.customer.national_id || '-'} />
            <InfoItem label={fields.companyPhone} value={details.customer.company_phone || '-'} />
            <InfoItem label={fields.companyAddress} value={details.customer.company_address || '-'} />
            <InfoItem label={fields.postalCode} value={details.customer.postal_code || '-'} />
            <InfoItem label={fields.representativeFirstName} value={details.customer.representative_first_name} />
            <InfoItem label={fields.representativeLastName} value={details.customer.representative_last_name} />
            <InfoItem label={fields.mobile} value={details.customer.representative_mobile} />
            <InfoItem label={fields.email} value={details.customer.email} />
            <InfoItem label={fields.shebaNumber} value={details.customer.sheba_number || '-'} />
            <InfoItem label={fields.referrerAgencyId} value={typeof details.customer.referrer_agency_id === 'number' ? details.customer.referrer_agency_id : '-'} />
            <InfoItem label={fields.isEmailVerified} value={details.customer.is_email_verified ? copy.common.yes : copy.common.no} />
            <InfoItem label={fields.isMobileVerified} value={details.customer.is_mobile_verified ? copy.common.yes : copy.common.no} />
            <InfoItem label={fields.isActive} value={details.customer.is_active ? copy.common.yes : copy.common.no} />
            <InfoItem label={fields.createdAt} value={formatDateTime(details.customer.created_at)} />
            <InfoItem label={fields.updatedAt} value={formatDateTime(details.customer.updated_at)} />
            <InfoItem label={fields.emailVerifiedAt} value={formatDateTime(details.customer.email_verified_at)} />
            <InfoItem label={fields.mobileVerifiedAt} value={formatDateTime(details.customer.mobile_verified_at)} />
            <InfoItem label={fields.lastLoginAt} value={formatDateTime(details.customer.last_login_at)} />
          </div>

          <div className="border-t border-gray-200 pt-5 text-center">
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">
              {copy.modals.campaignsSectionTitle}
            </div>
            <div className="mt-3 overflow-x-auto rounded-xl border border-gray-100 mx-auto">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-centered text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                    <th className="px-3 py-2 text-centered text-xs font-semibold text-gray-500 uppercase tracking-wide">{copy.campaignsTable.title}</th>
                    <th className="px-3 py-2 text-centered text-xs font-semibold text-gray-500 uppercase tracking-wide">{copy.campaignsTable.lineNumber}</th>
                    <th className="px-3 py-2 text-centered text-xs font-semibold text-gray-500 uppercase tracking-wide">{copy.campaignsTable.level3s}</th>
                    <th className="px-3 py-2 text-centered text-xs font-semibold text-gray-500 uppercase tracking-wide">{copy.campaignsTable.audience}</th>
                    <th className="px-3 py-2 text-centered text-xs font-semibold text-gray-500 uppercase tracking-wide">{copy.campaignsTable.sent}</th>
                    <th className="px-3 py-2 text-centered text-xs font-semibold text-gray-500 uppercase tracking-wide">{copy.campaignsTable.clickRate}</th>
                    <th className="px-3 py-2 text-centered text-xs font-semibold text-gray-500 uppercase tracking-wide">{copy.campaignsTable.status}</th>
                    <th className="px-3 py-2 text-centered text-xs font-semibold text-gray-500 uppercase tracking-wide">{copy.campaignsTable.created}</th>
                    <th className="px-3 py-2 text-centered text-xs font-semibold text-gray-500 uppercase tracking-wide">{copy.campaignsTable.schedule}</th>
                    {/* <th className="px-3 py-2 text-centered text-xs font-semibold text-gray-500 uppercase tracking-wide">{copy.campaignsTable.delivered}</th> */}
                    <th className="px-3 py-2 text-centered text-xs font-semibold text-gray-500 uppercase tracking-wide">{copy.campaignsTable.details}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {details.campaigns.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="px-4 py-4 text-center text-gray-500">
                        {copy.campaignsTable.noData}
                      </td>
                    </tr>
                  ) : details.campaigns.map((c, idx) => (
                    <tr key={`${c.title || 'untitled'}-${idx}`} className="hover:bg-gray-50">
                      <td className="px-3 py-2">{idx + 1}</td>
                      <td className="px-3 py-2">{c.title || '-'}</td>
                      <td className="px-3 py-2">{c.line_number || '-'}</td>
                      <td className="px-3 py-2">{c.level3s?.length ? c.level3s.join('، ') : '-'}</td>
                      <td className="px-3 py-2 text-right">{formatNumber(c.num_audience)}</td>
                      <td className="px-3 py-2 text-right">{formatNumber(c.total_sent)}</td>
                      <td className="px-3 py-2 text-right">{toPct(c.click_rate)}</td>
                      <td className="px-3 py-2">{c.status}</td>
                      <td className="px-3 py-2">{formatDateTime(c.created_at)}</td>
                      <td className="px-3 py-2">{formatDateTime(c.schedule_at)}</td>
                      {/* <td className="px-3 py-2 text-right">{formatNumber(c.total_delivered)}</td> */}
                      <td className="px-3 py-2 text-center">
                        <Button variant="outline" size="sm" onClick={() => onViewCampaign(c.campaign_id || 0)}>
                          {copy.actions.view}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
    <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
    <div className="mt-1 text-sm text-gray-900 break-words">{value}</div>
  </div>
);

export default DetailsModal;
