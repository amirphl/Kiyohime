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
    description: 'Welcome to SMS Marketing Platform',
  },
  LOGIN: {
    path: '/signin',
    page: 'login',
    requiresAuth: false,
    title: 'Sign In',
    description: 'Sign in to your account',
  },
  LOGIN_ALT: {
    path: '/login',
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