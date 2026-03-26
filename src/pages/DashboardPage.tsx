import React, { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { GetSMSCampaignResponse } from '../types/campaign';

import { useToast } from '../hooks/useToast';
import { Upload, X, Calculator } from 'lucide-react';
import AgencyCalculatorModal, {
  calculatorTranslations,
} from '../components/calculator/Calculator';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { language } = useLanguage();
  const { user, accessToken } = useAuth();
  const { showError, showSuccess } = useToast();

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketFile, setTicketFile] = useState<File | null>(null);
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketErrors, setTicketErrors] = useState<{
    title?: string;
    description?: string;
    file?: string;
  }>({});
  const [showCalcModal, setShowCalcModal] = useState(false);
  // Profile modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any | null>(null);
  // Campaigns summary state
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<{
    approved_count: number;
    running_count: number;
    total: number;
  } | null>(null);

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
  ];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateTicketForm = () => {
    const errs: { title?: string; description?: string; file?: string } = {};
    if (ticketTitle.length > 80) {
      errs.title = t('dashboard.supportModal.validation.titleMax');
    }
    if (!ticketDescription.trim()) {
      errs.description = t(
        'dashboard.supportModal.validation.descriptionRequired'
      );
    } else if (ticketDescription.length > 1000) {
      errs.description = t('dashboard.supportModal.validation.descriptionMax');
    }
    if (ticketFile) {
      if (!allowedTypes.includes(ticketFile.type)) {
        errs.file = t('dashboard.supportModal.validation.invalidType');
      } else if (ticketFile.size > maxFileSize) {
        errs.file = t('dashboard.supportModal.validation.maxSize');
      }
    }
    setTicketErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleTicketSubmit = async () => {
    if (!validateTicketForm()) return;
    setTicketSubmitting(true);
    try {
      const res = await apiService.createSupportTicket({
        title: ticketTitle,
        content: ticketDescription,
        file: ticketFile,
      });
      if (res.success) {
        showSuccess(t('dashboard.supportModal.success'));
        setShowTicketModal(false);
        setTicketTitle('');
        setTicketDescription('');
        setTicketFile(null);
        setTicketErrors({});
      } else {
        showError(res.message || t('dashboard.supportModal.error'));
      }
    } catch (e) {
      showError(t('dashboard.supportModal.error'));
    } finally {
      setTicketSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setTicketFile(file);
    // Clear previous file error on change
    if (ticketErrors.file)
      setTicketErrors(prev => ({ ...prev, file: undefined }));
  };

  const fetchProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    setProfileData(null);
    try {
      if (accessToken) apiService.setAccessToken(accessToken);
      const res = await apiService.getProfile();
      if (res.success && res.data) {
        const customer = (res.data as any).customer;
        const parent = (res.data as any).parent_agency ?? (res.data as any).parentAgency ?? null;
        setProfileData({ customer, parent });
      } else {
        setProfileError(res.message || 'Failed to load profile');
      }
    } catch (e) {
      setProfileError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchCampaignsSummary = async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    setSummaryData(null);
    try {
      const res = await apiService.getCampaignsSummary();
      if (res.success && res.data) {
        setSummaryData(
          res.data as {
            approved_count: number;
            running_count: number;
            total: number;
          }
        );
      } else {
        setSummaryError(res.message || 'Failed to load campaigns summary');
      }
    } catch (e) {
      setSummaryError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setSummaryLoading(false);
    }
  };

  const isAgency = user?.account_type === 'marketing_agency';
  const calcT =
    calculatorTranslations[
      language as keyof typeof calculatorTranslations
    ] || calculatorTranslations.en;
  const formatNum = (n: number) =>
    n.toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US');

  const isReportsView = window.location.pathname === '/dashboard/reports';

  const formatReportDateTime = (iso?: string) => {
    if (!iso) return '-';
    try {
      const jsDate = new Date(iso);
      if (language === 'fa') {
        // Convert to Tehran local then format in Shamsi
        const tehranMs = jsDate.getTime() + 3.5 * 60 * 60 * 1000;
        const tehranDate = new Date(tehranMs);
        const dobj = new DateObject({ date: tehranDate, calendar: persian, locale: persian_fa });
        return dobj.format('YYYY/MM/DD HH:mm:ss');
      }
      // For EN (and others): show user's local time
      return jsDate.toLocaleString();
    } catch {
      return '-';
    }
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Scroll to top when switching between dashboard and reports view
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isReportsView, accessToken]);

  const [loadingReports, setLoadingReports] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<GetSMSCampaignResponse[]>([]);

  useEffect(() => {
    if (!isReportsView) return;
    let mounted = true;
    setLoadingReports(true);
    setReportsError(null);
    (async () => {
      try {
        if (accessToken) apiService.setAccessToken(accessToken);
      } catch { }
      const res = await apiService.listCampaigns({
        page: 1,
        limit: 20,
        orderby: 'newest',
      });
      if (!mounted) return;
      if (res.success && res.data) {
        setCampaigns(res.data.items || []);
      } else {
        setReportsError(res.message || 'Failed to load campaigns');
      }
      setLoadingReports(false);
    })();
    return () => {
      mounted = false;
    };
  }, [isReportsView]);

  // Fetch campaigns summary once when dashboard loads for authenticated users
  useEffect(() => {
    if (isReportsView) return;
    if (!user) return;
    // Ensure access token is attached to apiService before calling summary
    if (!accessToken) return;
    // Re-sync apiService token in case AuthProvider effect hasn't run yet
    try {
      apiService.setAccessToken(accessToken);
    } catch (e) {
      console.warn(
        'Failed to sync access token to apiService before fetching campaigns summary',
        e
      );
    }
    // fetch once, no retries
    fetchCampaignsSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReportsView, user, accessToken]);

  return (
    <div className='p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900'>
            {isReportsView ? (
              t('dashboard.reports')
            ) : (
              <>
                {user?.representative_first_name ||
                  user?.email?.split('@')[0] ||
                  'User'}
                ! {t('dashboard.welcome')}
              </>
            )}
          </h2>
          {/* {user && (
                <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
                  <p className='text-sm text-blue-800'>
                    <strong>{t('dashboard.accountTypeLabel')}:</strong>{" "}
                    {
                      user.account_type === 'individual'
                        ? signupT.individual
                        : user.account_type === 'independent_company'
                          ? signupT.independentCompany
                          : user.account_type === 'marketing_agency'
                            ? signupT.marketingAgency
                            : ""
                    }
                  </p>
                  {user.company_name && (
                    <p className='text-sm text-blue-800 mt-1'>
                      <strong>{t('dashboard.companyNameLabel')}:</strong> {user.company_name}
                    </p>
                  )}
                  <p className='text-sm text-blue-800 mt-1'>
                    <strong>{t('dashboard.emailAddressLabel')}:</strong> {user.email}
                  </p>
                </div>
              )} */}
        </div>

        {/* Content */}
        {!isReportsView ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {user && (
              <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    fetchProfile();
                  }}
                  className='btn-primary flex items-center justify-center w-full'
                >
                  {t('dashboard.profile.profile') || 'Profile'}
                </button>
              </div>
            )}
            {/* Campaigns Summary Card */}
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                {t('dashboard.campaignStats.campaignsSummary') ||
                  'Campaigns Summary'}
              </h3>
              <div className='text-sm text-gray-700'>
                {summaryLoading ? (
                  <div className='text-gray-600'>Loading...</div>
                ) : summaryError ? (
                  <div className='text-red-600'>{summaryError}</div>
                ) : summaryData ? (
                  <div className='space-y-2'>
                    {/* <div>
                      <strong>
                        {t('dashboard.campaignStats.approved') || 'Approved'}:
                      </strong>{' '}
                      {formatNum(summaryData.approved_count)}
                    </div>
                    <div>
                      <strong>
                        {t('dashboard.campaignStats.running') || 'Running'}:
                      </strong>{' '}
                      {formatNum(summaryData.running_count)}
                    </div> */}
                    <div>
                      <strong>
                        {t('dashboard.campaignStats.total') || 'Total'}:
                      </strong>{' '}
                      {formatNum(summaryData.total)}
                    </div>
                  </div>
                ) : (
                  <div className='text-gray-600'>No data</div>
                )}
              </div>
            </div>
            {/* Support: New Ticket Button */}
            {/* <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2 lg:col-span-1'>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    {t('dashboard.support')}
                  </h3>
                  <button
                    onClick={() => setShowTicketModal(true)}
                    className='btn-primary flex items-center justify-center w-full'
                  >
                    <Plus className='h-4 w-4 mr-2' /> {t('dashboard.supportModal.newTicket')}
                  </button>
                </div> */}

            {/* Quick Stats */}
            {/* <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    {t('dashboard.stats.totalCampaigns')}
                  </h3>
                  <p className='text-3xl font-bold text-primary-600'>0</p>
                </div>

                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    {t('dashboard.stats.totalCustomers')}
                  </h3>
                  <p className='text-3xl font-bold text-primary-600'>0</p>
                </div> */}

            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                {t('dashboard.stats.walletBalance')}
              </h3>
              <p className='text-3xl font-bold text-primary-600'>0 تومان</p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                {t('dashboard.stats.activeTickets')}
              </h3>
              <p className='text-3xl font-bold text-primary-600'>0</p>
            </div>

            {isAgency && (
              <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2 lg:col-span-1'>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  {calcT.title}
                </h3>
                <button
                  onClick={() => setShowCalcModal(true)}
                  className='btn-primary flex items-center justify-center w-full'
                >
                  <Calculator className='h-4 w-4 mr-2' /> {calcT.openCalculator}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
            <div className='p-6'>
              {loadingReports ? (
                <div className='text-center text-gray-600'>Loading...</div>
              ) : reportsError ? (
                <div className='text-center text-red-600'>{reportsError}</div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          #
                        </th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Title
                        </th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Text
                        </th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Line Number
                        </th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Segment
                        </th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Sent
                        </th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Status
                        </th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Total
                        </th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Created At
                        </th>
                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Schedule At
                        </th>
                        <th className='px-4 py-2'></th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {campaigns.map((c, idx) => (
                        <tr key={c.uuid}>
                          <td className='px-4 py-2 text-sm text-gray-900'>
                            {idx + 1}
                          </td>
                          <td className='px-4 py-2 text-sm text-gray-900'>
                            {c.title || '-'}
                          </td>
                          <td className='px-4 py-2 text-sm text-gray-700 max-w-xs truncate'>
                            {c.content || '-'}
                          </td>
                          <td className='px-4 py-2 text-sm text-gray-900'>
                            {c.line_number || '-'}
                          </td>
                          <td className='px-4 py-2 text-sm text-gray-900'>
                            {c.level1 || '-'}
                          </td>
                          <td className='px-4 py-2 text-sm text-gray-500'>-</td>
                          <td className='px-4 py-2 text-sm text-gray-900'>
                            {c.status}
                          </td>
                          <td className='px-4 py-2 text-sm text-gray-500'>-</td>
                          <td className='px-4 py-2 text-sm text-gray-900'>
                            {formatReportDateTime(c.created_at)}
                          </td>
                          <td className='px-4 py-2 text-sm text-gray-900'>
                            {formatReportDateTime(c.scheduleat)}
                          </td>
                          <td className='px-4 py-2 text-right'>
                            <button className='px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700'>
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showTicketModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-lg w-full p-6'>
            <div
              className={`flex justify-between items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <h3 className='text-lg font-medium text-gray-900'>
                {t('dashboard.supportModal.title')}
              </h3>
              <button
                onClick={() => setShowTicketModal(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t('dashboard.supportModal.fields.ticketTitle')}
                </label>
                <input
                  type='text'
                  className='input-field'
                  placeholder={t(
                    'dashboard.supportModal.placeholders.ticketTitle'
                  )}
                  value={ticketTitle}
                  onChange={e => {
                    setTicketTitle(e.target.value.slice(0, 80));
                    if (ticketErrors.title)
                      setTicketErrors(prev => ({ ...prev, title: undefined }));
                  }}
                  maxLength={80}
                />
                {ticketErrors.title && (
                  <p className='mt-1 text-sm text-red-600'>
                    {ticketErrors.title}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t('dashboard.supportModal.fields.description')}{' '}
                  <span className='text-red-500'>*</span>
                </label>
                <textarea
                  className='input-field'
                  placeholder={t(
                    'dashboard.supportModal.placeholders.description'
                  )}
                  value={ticketDescription}
                  onChange={e => {
                    setTicketDescription(e.target.value.slice(0, 1000));
                    if (ticketErrors.description)
                      setTicketErrors(prev => ({
                        ...prev,
                        description: undefined,
                      }));
                  }}
                  rows={5}
                  maxLength={1000}
                />
                <div className='text-xs text-gray-500 mt-1'>
                  {ticketDescription.length} / 1000
                </div>
                {ticketErrors.description && (
                  <p className='mt-1 text-sm text-red-600'>
                    {ticketErrors.description}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t('dashboard.supportModal.fields.attachment')}{' '}
                  <span className='text-gray-400'>
                    ({t('dashboard.supportModal.fields.attachmentHelp')})
                  </span>
                </label>
                <input
                  type='file'
                  accept='.jpg,.jpeg,.png,.pdf,.docx,.xlsx,.zip'
                  onChange={handleFileChange}
                />
                {ticketFile && (
                  <div className='text-xs text-gray-500 mt-1'>
                    {ticketFile.name} ({Math.ceil(ticketFile.size / 1024)} KB)
                  </div>
                )}
                {ticketErrors.file && (
                  <p className='mt-1 text-sm text-red-600'>
                    {ticketErrors.file}
                  </p>
                )}
              </div>

              <div
                className={`flex ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} justify-end`}
              >
                <button
                  className='btn-secondary'
                  onClick={() => setShowTicketModal(false)}
                  disabled={ticketSubmitting}
                >
                  {t('common.cancel')}
                </button>
                <button
                  className='btn-primary flex items-center justify-center'
                  onClick={handleTicketSubmit}
                  disabled={ticketSubmitting}
                >
                  {ticketSubmitting ? (
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                  ) : (
                    <>
                      <Upload className='h-4 w-4 mr-2' />{' '}
                      {t('dashboard.supportModal.submit')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-lg w-full p-6'>
            <div
              className={`flex justify-between items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <h3 className='text-lg font-medium text-gray-900'>
                {t('dashboard.profile.profile') || 'Profile'}
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <div>
              {profileLoading ? (
                <div className='text-center text-gray-600'>Loading...</div>
              ) : profileError ? (
                <div className='text-center text-red-600'>{profileError}</div>
              ) : profileData ? (
                <div className='space-y-3 text-sm text-gray-700'>
                  <div>
                    <strong>
                      {t('dashboard.profile.fields.email') || 'Email'}:
                    </strong>{' '}
                    {profileData.customer.email}
                  </div>
                  <div>
                    <strong>
                      {t('dashboard.profile.fields.name') || 'Name'}:
                    </strong>{' '}
                    {profileData.customer.representative_first_name}{' '}
                    {profileData.customer.representative_last_name}
                  </div>
                  <div>
                    <strong>
                      {t('dashboard.profile.fields.accountType') ||
                        'Account Type'}
                      :
                    </strong>{' '}
                    {profileData.customer.account_type_display_name ||
                      profileData.customer.account_type}
                  </div>
                  {profileData.customer.company_name && (
                    <div>
                      <strong>
                        {t('dashboard.profile.fields.companyName') || 'Company'}
                        :
                      </strong>{' '}
                      {profileData.customer.company_name}
                    </div>
                  )}
                  {profileData.customer.category && (
                    <div>
                      <strong>
                        {t('dashboard.profile.fields.category') || 'Category'}:
                      </strong>{' '}
                      {profileData.customer.category}
                    </div>
                  )}
                  {profileData.customer.job && (
                    <div>
                      <strong>
                        {t('dashboard.profile.fields.job') || 'Job'}:
                      </strong>{' '}
                      {profileData.customer.job}
                    </div>
                  )}
                  <div>
                    <strong>
                      {t('dashboard.profile.fields.status') || 'Status'}:
                    </strong>{' '}
                    {profileData.customer.is_active
                      ? t('common.active') || 'Active'
                      : t('common.inactive') || 'Inactive'}
                  </div>
                  {profileData.customer.account_type === 'marketing_agency' &&
                    profileData.customer.referrer_agency_id && (
                      <div>
                        <strong>
                          {t('dashboard.profile.fields.agencyRefererCode') ||
                            'Agency Referrer Code'}
                          :
                        </strong>{' '}
                        {profileData.customer.agency_referer_code}
                      </div>
                    )}
                  {profileData.parent &&
                    profileData.parent.agency_referer_code && (
                      <div>
                        <strong>
                          {t('dashboard.profile.fields.parentAgency') ||
                            'Parent Agency'}
                          :
                        </strong>{' '}
                        {profileData.parent.agency_referer_code}{' '}
                        {profileData.parent.display_name && '-'}{' '}
                        {profileData.parent.display_name}
                      </div>
                    )}
                </div>
              ) : (
                <div className='text-center text-gray-600'>No data</div>
              )}
            </div>
          </div>
        </div>
      )}

      <AgencyCalculatorModal
        isOpen={showCalcModal}
        onClose={() => setShowCalcModal(false)}
        translations={calcT}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
    </div>
  );
};

export default DashboardPage;
