import React from 'react';
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
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface SidebarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  translationKey: string;
  href: string;
  showForAgency?: boolean;
}

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { user, logout } = useAuth();

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      icon: <LayoutDashboard className='h-5 w-5' />,
      label: 'Dashboard',
      translationKey: 'dashboard.dashboard',
      href: '/dashboard',
    },
    {
      id: 'targeted-send',
      icon: <Send className='h-5 w-5' />,
      label: 'targeted send',
      translationKey: 'dashboard.targetedSend',
      href: '/dashboard/targeted-send',
    },
    {
      id: 'reports',
      icon: <BarChart3 className='h-5 w-5' />,
      label: 'reports',
      translationKey: 'dashboard.reports',
      href: '/dashboard/reports',
    },
    {
      id: 'campaigns',
      icon: <Users className='h-5 w-5' />,
      label: 'Campaign and Customer',
      translationKey: 'dashboard.campaigns',
      href: '/dashboard/campaigns',
    },
    {
      id: 'wallet',
      icon: <Wallet className='h-5 w-5' />,
      label: 'Wallet and Charge',
      translationKey: 'dashboard.wallet',
      href: '/dashboard/wallet',
    },
    {
      id: 'support',
      icon: <Ticket className='h-5 w-5' />,
      label: 'Ticket and Support',
      translationKey: 'dashboard.support',
      href: '/dashboard/support',
    },
    {
      id: 'customer-management',
      icon: <UserCog className='h-5 w-5' />,
      label: 'Customer Management',
      translationKey: 'dashboard.customerManagement',
      href: '/dashboard/customer-management',
      showForAgency: true,
    },
    {
      id: 'discount-management',
      icon: <Percent className='h-5 w-5' />,
      label: 'Discount Management',
      translationKey: 'dashboard.discountManagement',
      href: '/dashboard/discount-management',
      showForAgency: true,
    },
  ];

  const handleLogout = () => {
    logout();
    // TODO: Redirect to login page
  };

  const isAgency = user?.account_type === 'marketing_agency';

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

              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'
                  } ${
                    window.location.pathname === item.href
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span>{t(item.translationKey)}</span>
                </a>
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
                {t('dashboard.welcome')},{' '}
                {user?.representative_first_name ||
                  user?.email?.split('@')[0] ||
                  'User'}
                !
              </h2>
              <p className='text-gray-600 mt-2'>{t('dashboard.subtitle')}</p>
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

            {/* Dashboard Content */}
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

            {/* Recent Activity */}
            <div className='mt-8'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                {t('dashboard.recentActivity')}
              </h3>
              <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
                <div className='p-6'>
                  <p className='text-gray-500 text-center'>
                    {t('dashboard.noActivity')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
