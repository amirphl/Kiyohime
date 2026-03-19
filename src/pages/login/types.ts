export type LoginMethod = 'password' | 'otp';

export interface LoginFormValues {
  identifier: string;
  password: string;
}

export interface LoginPageProps {
  onNavigateToSignup?: () => void;
  onNavigateToForgotPassword?: () => void;
}
