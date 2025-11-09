import React, { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '../contexts/NavigationContext';
import { useCampaign } from '../hooks/useCampaign';
import { apiService } from '../services/api';
import { GetSMSCampaignResponse } from '../types/campaign';

import {
  LayoutDashboard,
  Send,
  BarChart3,
  Users,
  Wallet,
  Ticket,
  UserCog,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useToast } from '../hooks/useToast';
import { Plus, Upload, X, Calculator } from 'lucide-react';
import { calcI18n } from '../locales/calc';

interface SidebarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  translationKey: string;
  href: string;
  showForAgency?: boolean;
  onClick?: () => void;
}

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { language } = useLanguage();
  const { user, logout } = useAuth();
  const { navigate } = useNavigation();
  const { resetCampaign } = useCampaign();
  const { showError, showSuccess } = useToast();

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketFile, setTicketFile] = useState<File | null>(null);
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketErrors, setTicketErrors] = useState<{ title?: string; description?: string; file?: string }>({});
  const [enamadImageOk, setEnamadImageOk] = useState(true);
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [calcAmount, setCalcAmount] = useState<number>(100000);
  const [calcDiscount, setCalcDiscount] = useState<number>(20);

  const navigateToPage = (path: string) => {
    navigate(path);
  };

  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateTicketForm = () => {
    const errs: { title?: string; description?: string; file?: string } = {};
    if (ticketTitle.length > 80) {
      errs.title = t('dashboard.supportModal.validation.titleMax');
    }
    if (!ticketDescription.trim()) {
      errs.description = t('dashboard.supportModal.validation.descriptionRequired');
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
      const res = await apiService.createSupportTicket({ title: ticketTitle, content: ticketDescription, file: ticketFile });
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
    if (ticketErrors.file) setTicketErrors(prev => ({ ...prev, file: undefined }));
  };

  const handleTargetedSend = () => {
    // Check if there's existing campaign data
    const existingData = localStorage.getItem('campaign_creation_data');
    
    if (existingData) {
      try {
        const parsedData = JSON.parse(existingData);
        console.log('🔄 Found existing campaign data, preserving it:', parsedData);
        
        // Navigate to campaign creation with existing data
        navigate('/campaign-creation');
        return;
      } catch (error) {
        console.warn('Failed to parse existing campaign data, will create new campaign');
      }
    }
    
    // Only reset if no existing data found
    console.log('🆕 No existing campaign data found, creating fresh campaign');
    resetCampaign();
    
    // Initialize campaign data in localStorage
    const initialCampaignData = {
      uuid: '',
      segment: {
        campaignTitle: '',
        segment: '',
        subsegments: [],
        sex: '',
        city: [],
      },
      content: {
        insertLink: false,
        link: '',
        text: '',
        scheduleAt: undefined,
      },
      budget: {
        lineNumber: '',
        totalBudget: 0,
        estimatedMessages: undefined,
      },
      payment: {
        paymentMethod: '',
        termsAccepted: false,
      },
    };
    
    localStorage.setItem('campaign_creation_data', JSON.stringify(initialCampaignData));
    localStorage.setItem('campaign_creation_step', '1');
    
    // Navigate to campaign creation
    navigate('/campaign-creation');
  };


  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      icon: <LayoutDashboard className='h-5 w-5' />,
      label: 'Dashboard',
      translationKey: 'dashboard.dashboard',
      href: '/dashboard',
      onClick: () => navigateToPage('/dashboard'),
    },
    {
      id: 'targeted-send',
      icon: <Send className='h-5 w-5' />,
      label: 'targeted send',
      translationKey: 'dashboard.targetedSend',
      href: '/campaign-creation',
      onClick: handleTargetedSend,
    },
    {
      id: 'reports',
      icon: <BarChart3 className='h-5 w-5' />,
      label: 'reports',
      translationKey: 'dashboard.reports',
      href: '/dashboard/reports',
      onClick: () => navigateToPage('/dashboard/reports'),
    },
    {
      id: 'campaigns',
      icon: <Users className='h-5 w-5' />,
      label: 'Campaign and Customer',
      translationKey: 'dashboard.campaigns',
      href: '/dashboard/campaigns',
      onClick: () => navigateToPage('/dashboard/campaigns'),
    },
    {
      id: 'wallet',
      icon: <Wallet className='h-5 w-5' />,
      label: 'Wallet and Charge',
      translationKey: 'dashboard.wallet',
      href: '/dashboard/wallet',
      onClick: () => navigateToPage('/dashboard/wallet'),
    },
    {
      id: 'support',
      icon: <Ticket className='h-5 w-5' />,
      label: 'Ticket and Support',
      translationKey: 'dashboard.support',
      href: '/dashboard/support',
      onClick: () => navigateToPage('/dashboard/support'),
    },
    {
      id: 'customer-discount-management',
      icon: <UserCog className='h-5 w-5' />,
      label: 'Customer & Discount Management',
      translationKey: 'dashboard.customerDiscountManagement',
      href: '/dashboard/customer-management',
      showForAgency: true,
      onClick: () => navigateToPage('/dashboard/customer-management'),
    },
  ];

  const handleLogout = () => {
    logout();
    // TODO: Redirect to login page
  };

  const isAgency = user?.account_type === 'marketing_agency';
  const calcT = calcI18n[language as keyof typeof calcI18n] || calcI18n.en;
  const formatNum = (n: number) => n.toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US');
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const extraPct = () => (1 / (1 - ((clamp(calcDiscount, 0, 100) / 100) / 2))) - 1; // d/(2-d)
  const gift = () => Math.max(0, Math.round(calcAmount * extraPct()));
  const yourRevenue = () => Math.max(0, Math.round(calcAmount - (calcAmount / (2 - (clamp(calcDiscount, 0, 100) / 100)))));
  const baselineAgency = () => Math.round(calcAmount * 0.5);
  const reduction = () => Math.max(0, baselineAgency() - yourRevenue());

  const isReportsView = window.location.pathname === '/dashboard/reports';

  const formatReportDateTime = (iso?: string) => {
    if (!iso) return '-';
    try {
      const jsDate = new Date(iso);
      if (language === 'en') {
        return jsDate.toLocaleString('en-US', {
          timeZone: 'Asia/Tehran',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
      }
      const tehranMs = jsDate.getTime() + 3.5 * 60 * 60 * 1000;
      const tehranDate = new Date(tehranMs);
      const dobj = new DateObject({ date: tehranDate, calendar: persian, locale: persian_fa });
      return dobj.format('YYYY/MM/DD HH:mm:ss');
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
  }, [isReportsView]);

  const [loadingReports, setLoadingReports] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<GetSMSCampaignResponse[]>([]);

  useEffect(() => {
    if (!isReportsView) return;
    let mounted = true;
    setLoadingReports(true);
    setReportsError(null);
    (async () => {
      const res = await apiService.listCampaigns({ page: 1, limit: 20, orderby: 'newest' });
      if (!mounted) return;
      if (res.success && res.data) {
        setCampaigns(res.data.items || []);
      } else {
        setReportsError(res.message || 'Failed to load campaigns');
      }
      setLoadingReports(false);
    })();
    return () => { mounted = false; };
  }, [isReportsView]);

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Sidebar */}
      <div
        className={`w-64 bg-white shadow-lg ${isRTL ? 'border-l' : 'border-r'} border-gray-200`}
      >
        <div className='p-6'>
          <h1 className='text-xl font-bold text-gray-900 mb-8'>
            {t('dashboard.title')}
          </h1>

          <nav className='space-y-2'>
            {sidebarItems.map(item => {
              // Skip agency-only items for non-agency users
              if (item.showForAgency && !isAgency) {
                return null;
              }

              const isActive = window.location.pathname === item.href;
              
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'
                  } ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span>{t(item.translationKey)}</span>
                </button>
              );
            })}
          </nav>

          {/* Language Switcher */}
          <div className='mt-6 pt-6 border-t border-gray-200'>
            <div className='flex items-center justify-between mb-4'>
              <span className='text-sm font-medium text-gray-700'>
                {t('dashboard.language')}
              </span>
            </div>
            <LanguageSwitcher />
          </div>

          {/* Logout Button */}
          <div className='mt-6 pt-6 border-t border-gray-200'>
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors ${
                isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'
              }`}
            >
              <LogOut className='h-5 w-5' />
              <span>{t('dashboard.logout')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1'>
        <div className='p-8'>
          <div className='max-w-7xl mx-auto'>
            <div className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900'>
                {isReportsView ? t('dashboard.reports') : (<>
                  {t('dashboard.welcome')},{' '}
                  {user?.representative_first_name || user?.email?.split('@')[0] || 'User'}!
                </>)}
              </h2>
              {!isReportsView && <p className='text-gray-600 mt-2'>{t('dashboard.subtitle')}</p>}
              {user && (
                <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
                  <p className='text-sm text-blue-800'>
                    <strong>Account Type:</strong> {user.account_type}
                  </p>
                  {user.company_name && (
                    <p className='text-sm text-blue-800 mt-1'>
                      <strong>Company:</strong> {user.company_name}
                    </p>
                  )}
                  <p className='text-sm text-blue-800 mt-1'>
                    <strong>Email:</strong> {user.email}
                  </p>
                </div>
              )}
            </div>

            {/* Content */}
            {!isReportsView ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {/* Support: New Ticket Button */}
                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2 lg:col-span-1'>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    {t('dashboard.support')}
                  </h3>
                  <button
                    onClick={() => setShowTicketModal(true)}
                    className='btn-primary flex items-center justify-center w-full'
                  >
                    <Plus className='h-4 w-4 mr-2' /> {t('dashboard.supportModal.newTicket')}
                  </button>
                </div>

                {/* Quick Stats */}
                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
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
                </div>

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
                            <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>#</th>
                            <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Title</th>
                            <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Text</th>
                            <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Line Number</th>
                            <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Segment</th>
                            <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Sent</th>
                            <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                            <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Total</th>
                            <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Created At</th>
                            <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Schedule At</th>
                            <th className='px-4 py-2'></th>
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                          {campaigns.map((c, idx) => (
                            <tr key={c.uuid}>
                              <td className='px-4 py-2 text-sm text-gray-900'>{idx + 1}</td>
                              <td className='px-4 py-2 text-sm text-gray-900'>{c.title || '-'}</td>
                              <td className='px-4 py-2 text-sm text-gray-700 max-w-xs truncate'>{c.content || '-'}</td>
                              <td className='px-4 py-2 text-sm text-gray-900'>{c.line_number || '-'}</td>
                              <td className='px-4 py-2 text-sm text-gray-900'>{c.segment || '-'}</td>
                              <td className='px-4 py-2 text-sm text-gray-500'>-</td>
                              <td className='px-4 py-2 text-sm text-gray-900'>{c.status}</td>
                              <td className='px-4 py-2 text-sm text-gray-500'>-</td>
                              <td className='px-4 py-2 text-sm text-gray-900'>{formatReportDateTime(c.created_at)}</td>
                              <td className='px-4 py-2 text-sm text-gray-900'>{formatReportDateTime(c.scheduleat)}</td>
                              <td className='px-4 py-2 text-right'>
                                <button className='px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700'>Details</button>
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
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showTicketModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-lg w-full p-6'>
            <div className={`flex justify-between items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h3 className='text-lg font-medium text-gray-900'>{t('dashboard.supportModal.title')}</h3>
              <button onClick={() => setShowTicketModal(false)} className='text-gray-400 hover:text-gray-600'>
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
                  placeholder={t('dashboard.supportModal.placeholders.ticketTitle')}
                  value={ticketTitle}
                  onChange={e => {
                    setTicketTitle(e.target.value.slice(0, 80));
                    if (ticketErrors.title) setTicketErrors(prev => ({ ...prev, title: undefined }));
                  }}
                  maxLength={80}
                />
                {ticketErrors.title && (
                  <p className='mt-1 text-sm text-red-600'>{ticketErrors.title}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t('dashboard.supportModal.fields.description')} <span className='text-red-500'>*</span>
                </label>
                <textarea
                  className='input-field'
                  placeholder={t('dashboard.supportModal.placeholders.description')}
                  value={ticketDescription}
                  onChange={e => {
                    setTicketDescription(e.target.value.slice(0, 1000));
                    if (ticketErrors.description) setTicketErrors(prev => ({ ...prev, description: undefined }));
                  }}
                  rows={5}
                  maxLength={1000}
                />
                <div className='text-xs text-gray-500 mt-1'>
                  {ticketDescription.length} / 1000
                </div>
                {ticketErrors.description && (
                  <p className='mt-1 text-sm text-red-600'>{ticketErrors.description}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t('dashboard.supportModal.fields.attachment')} <span className='text-gray-400'>({t('dashboard.supportModal.fields.attachmentHelp')})</span>
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
                  <p className='mt-1 text-sm text-red-600'>{ticketErrors.file}</p>
                )}
              </div>

              <div className={`flex ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} justify-end`}>
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
                      <Upload className='h-4 w-4 mr-2' /> {t('dashboard.supportModal.submit')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calculator Modal */}
      {showCalcModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg w-full p-6 max-w-[69.12rem]'>
            <div className={`flex justify-between items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h3 className='text-lg font-medium text-gray-900'>{calcT.title}</h3>
              <button onClick={() => setShowCalcModal(false)} className='text-gray-400 hover:text-gray-600'>
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>{calcT.amountLabel}</label>
                <input
                  type='number'
                  min={0}
                  step={1000}
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value || 0)))}
                  className='input-field'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>{calcT.discountLabel}</label>
                <div className='flex items-center gap-2'>
                  <input
                    type='number'
                    min={0}
                    max={100}
                    step={1}
                    value={calcDiscount}
                    onChange={(e) => setCalcDiscount(clamp(Number(e.target.value || 0), 0, 100))}
                    className='input-field max-w-[120px]'
                  />
                  <div className='flex flex-wrap gap-2'>
                    {[0,20,40,60,80,90,100].map((d, idx) => (
                      <button
                        key={d}
                        className={`px-3 py-1 rounded-full text-xs border ${calcDiscount===d ? 'border-primary-600 text-primary-700 bg-primary-50' : 'border-gray-300 text-gray-600 bg-white'}`}
                        onClick={() => setCalcDiscount(d)}
                      >
                        {calcT.chips[idx] || `${d}%`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-4 overflow-x-auto'>
              <table dir={isRTL ? 'rtl' : 'ltr'} className='min-w-full table-fixed border text-sm'>
                <colgroup>
                  <col className='w-4/5' />
                  <col className='w-1/5' />
                </colgroup>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='border px-2 py-2 text-center'>{calcT.tableHeadDesc}</th>
                    <th className='border px-2 py-2 text-center'>{calcT.tableHeadValue}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='border px-2 py-2 text-center' dir={isRTL ? undefined : 'ltr'}>
                      {calcT.reductionLabel}
                      <span className='relative inline-block group ml-1 align-middle'>
                        <span className='inline-flex items-center justify-center w-4 h-4 rounded-full border text-[10px] border-primary-600 text-primary-600 select-none'>?</span>
                        <span className={`absolute ${isRTL ? 'left-full ml-2' : 'right-full mr-2'} top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity max-w-[360px] w-64`} dir={isRTL ? 'rtl' : 'ltr'}>
                          {calcT.reductionTip}
                        </span>
                      </span>
                    </td>
                    <td className='border px-2 py-2 text-center text-orange-600 font-medium' dir={isRTL ? undefined : 'ltr'}>{formatNum(reduction())}</td>
                  </tr>
                  <tr>
                    <td className='border px-2 py-2 text-center' dir={isRTL ? undefined : 'ltr'}>
                      {calcT.giftLabel}
                      <span className='relative inline-block group ml-1 align-middle'>
                        <span className='inline-flex items-center justify-center w-4 h-4 rounded-full border text-[10px] border-primary-600 text-primary-600 select-none'>?</span>
                        <span className={`absolute ${isRTL ? 'left-full ml-2' : 'right-full mr-2'} top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity max-w-[360px] w-64`} dir={isRTL ? 'rtl' : 'ltr'}>
                          {calcT.giftTip}
                        </span>
                      </span>
                    </td>
                    <td className='border px-2 py-2 text-center text-green-600 font-medium' dir={isRTL ? undefined : 'ltr'}>{formatNum(gift())}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className='border px-2 py-2 bg-gray-50 text-center' dir={isRTL ? undefined : 'ltr'}>
                      <strong>{calcT.ruleFixed}</strong> {`${formatNum(reduction())} ${calcT.times} 2 = ${formatNum(gift())}`}
                    </td>
                  </tr>
                  <tr>
                    <td className='border px-2 py-2 text-center' dir={isRTL ? undefined : 'ltr'}><strong>{calcT.yourRevenueLabel}</strong></td>
                    <td className='border px-2 py-2 text-center' dir={isRTL ? undefined : 'ltr'}>{formatNum(yourRevenue())}</td>
                  </tr>
                </tbody>
              </table>
              <div className='mt-3 flex justify-between items-center text-xs text-gray-500'>
                <div />
                <button className='btn-secondary' onClick={() => { setCalcAmount(100000); setCalcDiscount(80); }}>
                  {calcT.reset}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
