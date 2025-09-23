import React, { useEffect, useMemo, useState } from 'react';
import adminApi from '../services/adminApi';
import { AdminCaptchaInitResponse } from '../types/admin';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';

const toDataSrc = (raw?: string | null): string => {
  if (!raw) return '';
  return raw.startsWith('data:image') ? raw : `data:image/png;base64,${raw}`;
};

const clampAngle0to360 = (n: number): number => {
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 360) return 360;
  return Math.round(n);
};

const AdminLoginPage: React.FC = () => {
  const { language } = useLanguage();
  const { showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState<AdminCaptchaInitResponse | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [angle, setAngle] = useState(0);

  const masterSrc = useMemo(() => toDataSrc(captcha?.master_image_base64), [captcha]);
  const thumbSrc = useMemo(() => toDataSrc(captcha?.thumb_image_base64), [captcha]);

  const loadCaptcha = async () => {
    setError(null);
    setLoading(true);
    const res = await adminApi.initCaptcha();
    setLoading(false);
    if (!res.success) {
      const msg = res.message || 'Failed to initialize captcha';
      setError(msg);
      showError(msg);
      return;
    }
    setCaptcha(res.data!);
    setAngle(0);
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!captcha) {
      const msg = 'Captcha not ready';
      setError(msg);
      showError(msg);
      return;
    }
    if (!username.trim() || !password.trim()) {
      const msg = 'Username and password are required';
      setError(msg);
      showError(msg);
      return;
    }
    setLoading(true);
    const resp = await adminApi.verifyLogin({
      challenge_id: captcha.challenge_id,
      username: username.trim(),
      password: password,
      user_angle: clampAngle0to360(angle),
    });
    setLoading(false);
    if (!resp.success) {
      const msg = resp.message || 'Login failed';
      setError(msg);
      showError(msg);
      // Re-init captcha on any login error
      loadCaptcha();
      return;
    }
    // Admin logged in: keep admin tokens separate in adminApi
    // Redirect to admin dashboard (placeholder)
    window.location.href = '/satrap/sardis';
  };

  return (
    <div dir={language === 'fa' ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
        {error && (
          <div className="mb-3 text-sm text-red-600">{error}</div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rotate Captcha</label>
            <div className="flex flex-col items-center gap-3">
              {masterSrc ? (
                <img src={masterSrc} alt="captcha-master" className="rounded border" />
              ) : (
                <div className="h-40 w-full bg-gray-100 animate-pulse" />
              )}

              <div className="flex items-center gap-3 w-full justify-center">
                {thumbSrc ? (
                  <img
                    src={thumbSrc}
                    alt="captcha-thumb"
                    className="w-16 h-16 rounded-full border"
                    style={{ transform: `rotate(${angle}deg)` }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-100" />
                )}
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={angle}
                  onChange={(e) => setAngle(clampAngle0to360(Number(e.target.value)))}
                  className="flex-1 max-w-xs"
                />
                <span className="w-16 text-right text-sm">{angle}°</span>
              </div>
              <button type="button" onClick={loadCaptcha} className="text-sm text-blue-600">Reload Captcha</button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage; 