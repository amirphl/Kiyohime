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
import { GetSMSCampaignResponse, ListSMSCampaignsResponse } from '../types/campaign';

import {
  LayoutDashboard,
  Send,
  BarChart3,
  Users,
  Wallet,
  Ticket,
  UserCog,
  Percent,
  LogOut,
} from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';

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

  const navigateToPage = (path: string) => {
    navigate(path);
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
      id: 'customer-management',
      icon: <UserCog className='h-5 w-5' />,
      label: 'Customer Management',
      translationKey: 'dashboard.customerManagement',
      href: '/dashboard/customer-management',
      showForAgency: true,
      onClick: () => navigateToPage('/dashboard/customer-management'),
    },
    {
      id: 'discount-management',
      icon: <Percent className='h-5 w-5' />,
      label: 'Discount Management',
      translationKey: 'dashboard.discountManagement',
      href: '/dashboard/discount-management',
      showForAgency: true,
      onClick: () => navigateToPage('/dashboard/discount-management'),
    },
  ];

  const handleLogout = () => {
    logout();
    // TODO: Redirect to login page
  };

  const isAgency = user?.account_type === 'marketing_agency';

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
    </div>
  );
};

export default DashboardPage;
