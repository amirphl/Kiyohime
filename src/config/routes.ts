export interface RouteConfig {
  path: string;
  page: string;
  requiresAuth: boolean;
  title: string;
  description?: string;
}

export const ROUTES: Record<string, RouteConfig> = {
  HOME: {
    path: '/',
    page: 'home',
    requiresAuth: false,
    title: 'Home',
    description: 'Welcome to Marketing Platform',
  },
  LOGIN: {
    path: '/signin',
    page: 'login',
    requiresAuth: false,
    title: 'Sign In',
    description: 'Sign in to your account',
  },
  LOGIN_ALT: {
    path: '/signin',
    page: 'login',
    requiresAuth: false,
    title: 'Sign In',
    description: 'Sign in to your account',
  },
  SIGNUP: {
    path: '/signup',
    page: 'signup',
    requiresAuth: false,
    title: 'Sign Up',
    description: 'Create a new account',
  },
  FORGOT_PASSWORD: {
    path: '/forgot-password',
    page: 'forgotPassword',
    requiresAuth: false,
    title: 'Forgot Password',
    description: 'Reset your password',
  },
  RESET_PASSWORD: {
    path: '/reset-password',
    page: 'resetPassword',
    requiresAuth: false,
    title: 'Reset Password',
    description: 'Set your new password',
  },
  DASHBOARD: {
    path: '/dashboard',
    page: 'dashboard',
    requiresAuth: true,
    title: 'Dashboard',
    description: 'Your SMS marketing dashboard',
  },
  CAMPAIGN_CREATION: {
    path: '/campaign-creation',
    page: 'campaign-creation',
    requiresAuth: true,
    title: 'Create Campaign',
    description: 'Create a new SMS campaign',
  },
  WALLET: {
    path: '/dashboard/wallet',
    page: 'wallet',
    requiresAuth: true,
    title: 'Wallet & Charge',
    description: 'Manage your wallet balance and add funds',
  },
  REPORTS: {
    path: '/dashboard/reports',
    page: 'reports',
    requiresAuth: true,
    title: 'Reports',
    description: 'Campaign reports and history',
  },
  SUPPORT: {
    path: '/dashboard/support',
    page: 'support',
    requiresAuth: true,
    title: 'Ticket & Support',
    description: 'Create and manage support tickets',
  },
  CUSTOMER_MANAGEMENT: {
    path: '/dashboard/customer-management',
    page: 'customer-management',
    requiresAuth: true,
    title: 'Customer & Discount Management',
    description: 'Manage customers and discounts',
  },
  CONTACT_US: {
    path: '/contact',
    page: 'contact',
    requiresAuth: false,
    title: 'Contact Us',
    description: 'Get in touch with us',
  },
  TERMS: {
    path: '/terms',
    page: 'terms',
    requiresAuth: false,
    title: 'Terms of Service',
    description: 'Service terms and conditions',
  },
  PRICING: {
    path: '/pricing',
    page: 'pricing',
    requiresAuth: false,
    title: 'Pricing',
    description: 'View our pricing plans and packages',
  },
  ADMIN_LOGIN: {
    path: '/satrap',
    page: 'admin-login',
    requiresAuth: false,
    title: 'Admin Login',
    description: 'Administrator sign in'
  },
  ADMIN_SARDIS: {
    path: '/satrap/sardis',
    page: 'admin-sardis',
    requiresAuth: false,
    title: 'Sardis',
    description: 'Admin Sardis'
  },
  ADMIN_LINE_NUMBERS: {
    path: '/satrap/sardis/line-numbers',
    page: 'admin-line-numbers',
    requiresAuth: false,
    title: 'Line Numbers',
    description: 'Admin Line Numbers Management'
  },
  ADMIN_CAMPAIGNS: {
    path: '/satrap/campaigns',
    page: 'admin-campaigns',
    requiresAuth: false,
    title: 'Admin Campaigns',
    description: 'Admin campaign management',
  },
  ADMIN_TICKETS: {
    path: '/satrap/tickets',
    page: 'admin-tickets',
    requiresAuth: false,
    title: 'Admin Tickets',
    description: 'Admin ticket management',
  },
  ADMIN_CUSTOMERS: {
    path: '/satrap/sardis/customers',
    page: 'admin-customers',
    requiresAuth: false,
    title: 'Admin Customers',
    description: 'Admin customer management',
  },
  ADMIN_SHORT_LINKS: {
    path: '/satrap/sardis/short-links',
    page: 'admin-short-links',
    requiresAuth: false,
    title: 'Admin Short Links',
    description: 'Admin short link management',
  },
  ADMIN_SEGMENT_PRICE_FACTORS: {
    path: '/satrap/sardis/segment-price-factors',
    page: 'admin-segment-price-factors',
    requiresAuth: false,
    title: 'Segment Price Factors',
    description: 'Admin segment price factor management',
  },
};

export const getRouteByPath = (path: string): RouteConfig | null => {
  return Object.values(ROUTES).find(route => route.path === path) || null;
};

export const getRouteByPage = (page: string): RouteConfig | null => {
  return Object.values(ROUTES).find(route => route.page === page) || null;
};

export const isProtectedRoute = (path: string): boolean => {
  const route = getRouteByPath(path);
  return route?.requiresAuth || false;
}; 
