import React, { useEffect, useMemo, useRef, useState } from 'react';
import adminApi from '../services/adminApi';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';
import { useNavigation } from '../contexts/NavigationContext';
import { ROUTES } from '../config/routes';
import { segmentPriceFactorTranslations } from './segmentPriceFactors/translations';
import { translations } from '../locales/translations';
import { AdminSegmentPriceFactorItem } from '../types/admin';
import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

const PLATFORM_OPTIONS = ['sms', 'splus', 'rubika', 'bale'] as const;
type SegmentPriceFactorPlatform = (typeof PLATFORM_OPTIONS)[number];

const AdminSegmentPriceFactorsPage: React.FC = () => {
  const { language } = useLanguage();
  const copy = useMemo(
    () =>
      segmentPriceFactorTranslations[language as keyof typeof segmentPriceFactorTranslations] ||
      segmentPriceFactorTranslations.en,
    [language]
  );
  const t = useMemo(() => translations[language], [language]);
  const isRTL = language === 'fa';
  const { showError, showSuccess } = useToast();
  const { navigate } = useNavigation();

  const [level3Options, setLevel3Options] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const [factors, setFactors] = useState<AdminSegmentPriceFactorItem[]>([]);
  const [loadingFactors, setLoadingFactors] = useState(false);
  const [factorsError, setFactorsError] = useState<string | null>(null);

  const [platform, setPlatform] = useState<SegmentPriceFactorPlatform>('sms');
  const [level3, setLevel3] = useState<string>('');
  const [priceFactor, setPriceFactor] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const initRef = useRef(false);

  const loadLevel3Options = async (platformValue: SegmentPriceFactorPlatform = platform) => {
    setLoadingOptions(true);
    setOptionsError(null);
    const resp = await adminApi.listLevel3Options(platformValue);
    setLoadingOptions(false);
    if (!resp.success) {
      const msg = resp.message || copy.errors.loadOptions;
      setOptionsError(msg);
      showError(msg);
      return;
    }
    setLevel3Options(resp.data?.items || []);
  };

  const loadFactors = async (platformValue: SegmentPriceFactorPlatform = platform) => {
    setLoadingFactors(true);
    setFactorsError(null);
    const resp = await adminApi.listSegmentPriceFactors(platformValue);
    setLoadingFactors(false);
    if (!resp.success) {
      const msg = resp.message || copy.errors.loadFactors;
      setFactorsError(msg);
      showError(msg);
      return;
    }
    setFactors(resp.data?.items || []);
  };

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    loadLevel3Options();
    loadFactors();
    // eslint-disable-next-line
  }, []);

  const validate = (): string | null => {
    if (!PLATFORM_OPTIONS.includes(platform)) return copy.errors.missingPlatform;
    if (!level3) return copy.errors.missingLevel3;
    const num = Number(priceFactor);
    if (!Number.isFinite(num) || num <= 0) return copy.errors.invalidPriceFactor;
    return null;
  };

  const submit = async () => {
    const v = validate();
    if (v) {
      showError(v);
      return;
    }
    setSubmitting(true);
    const resp = await adminApi.createSegmentPriceFactor({
      platform,
      level3,
      price_factor: Number(priceFactor),
    });
    setSubmitting(false);
    if (!resp.success) {
      const msg = resp.message || copy.errors.createFailed;
      showError(msg);
      return;
    }
    showSuccess(copy.successSaved);
    loadFactors();
  };

  const formatDate = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      if (isRTL) {
        const dobj = new DateObject({
          date: d,
          calendar: persian,
          locale: persian_fa,
        });
        return dobj.format('YYYY/MM/DD HH:mm:ss');
      }
      return d.toLocaleString(undefined, { hour12: false });
    } catch {
      return iso;
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">{copy.title}</h1>
          <p className="text-gray-600 text-sm mt-1">{copy.subtitle}</p>
        </div>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded"
          onClick={() => navigate(ROUTES.ADMIN_SARDIS.path)}
        >
          {t.adminCommon?.backToSardis || 'Back to Sardis'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{copy.platformLabel}</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={platform}
              onChange={(e) => {
                const nextPlatform = e.target.value as SegmentPriceFactorPlatform;
                setPlatform(nextPlatform);
                setLevel3('');
                loadLevel3Options(nextPlatform);
                loadFactors(nextPlatform);
              }}
            >
              <option value="">{copy.platformPlaceholder}</option>
              {PLATFORM_OPTIONS.map((item) => (
                <option key={item} value={item}>{item.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{copy.level3Label}</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={level3}
              onChange={(e) => setLevel3(e.target.value)}
            >
              <option value="">{copy.level3Placeholder}</option>
              {level3Options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {loadingOptions && (
              <div className="text-xs text-gray-500 mt-1">{t.common?.loading || 'Loading...'}</div>
            )}
            {optionsError && (
              <div className="text-xs text-red-600 mt-1">{optionsError}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{copy.priceFactorLabel}</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={priceFactor}
              onChange={(e) => setPriceFactor(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder={copy.priceFactorPlaceholder}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={submit}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-70"
          >
            {submitting ? (t.common?.loading || 'Loading...') : copy.createButton}
          </button>
          <button
            onClick={() => {
              loadLevel3Options();
              loadFactors();
            }}
            disabled={loadingOptions || loadingFactors}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded disabled:opacity-70"
          >
            {copy.refreshButton}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">{copy.listTitle}</h2>
          {factorsError && <span className="text-sm text-red-600">{factorsError}</span>}
        </div>
        <div className="overflow-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className={`border px-2 py-2 ${isRTL ? 'text-right' : 'text-left'}`}>{copy.columns.platform}</th>
                <th className={`border px-2 py-2 ${isRTL ? 'text-right' : 'text-left'}`}>{copy.columns.level3}</th>
                <th className={`border px-2 py-2 ${isRTL ? 'text-right' : 'text-left'}`}>{copy.columns.priceFactor}</th>
                <th className={`border px-2 py-2 ${isRTL ? 'text-right' : 'text-left'}`}>{copy.columns.createdAt}</th>
              </tr>
            </thead>
            <tbody>
              {loadingFactors ? (
                <tr>
                  <td className="px-2 py-3 border text-center" colSpan={4}>
                    {t.common?.loading || 'Loading...'}
                  </td>
                </tr>
              ) : factors.length === 0 ? (
                <tr>
                  <td className="px-2 py-3 border text-center" colSpan={4}>
                    {copy.empty}
                  </td>
                </tr>
              ) : (
                factors.map(item => (
                  <tr key={`${item.platform}-${item.level3}-${item.created_at}`}>
                    <td className={`px-2 py-2 border ${isRTL ? 'text-right' : 'text-left'}`}>{item.platform}</td>
                    <td className={`px-2 py-2 border ${isRTL ? 'text-right' : 'text-left'}`}>{item.level3}</td>
                    <td className={`px-2 py-2 border ${isRTL ? 'text-right' : 'text-left'}`}>{item.price_factor}</td>
                    <td className={`px-2 py-2 border ${isRTL ? 'text-right' : 'text-left'}`}>{formatDate(item.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSegmentPriceFactorsPage;
