import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import { contactI18n } from '../locales/contact';

const ContactUsPage: React.FC = () => {
  useTranslation();
  const { isRTL } = useLanguage();
  const { language } = useLanguage();
  const t =
    contactI18n[language as keyof typeof contactI18n] || contactI18n.en;

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-50 px-4 ${isRTL ? 'rtl' : 'ltr'}`}
    >
      <div className='max-w-2xl w-full bg-white shadow rounded-lg p-6 sm:p-8'>
        <h1 className='text-2xl font-bold mb-4'>{t.title}</h1>
        <div className='space-y-3 text-gray-700'>
          <p>{t.companyName}</p>
          <p>{t.address}</p>
          <p>{t.postalCode}</p>
          <p>
            <a
              href='mailto:info@jazebeh.ir'
              className='text-blue-600 hover:underline'
            >
              {t.email}
            </a>
          </p>
          <p>
            {/** Render phone label and clickable tel: links for each number */}
            {(() => {
              const raw = t.phone || '';
              const parts = raw.split(/[:：]/);
              const label = parts.length > 1 ? parts[0] + ':' : '';
              const numbersPart =
                parts.length > 1 ? parts.slice(1).join(':') : raw;

              const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
              const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
              const toEnglishDigits = (input: string) => {
                if (!input) return input;
                return input
                  .replace(/[۰-۹]/g, d => String(persianDigits.indexOf(d)))
                  .replace(/[٠-٩]/g, d => String(arabicDigits.indexOf(d)));
              };

              const normalizeForHref = (token: string) => {
                if (!token) return '';
                // convert Persian/Arabic digits to Latin
                let s = toEnglishDigits(token);
                // remove everything except digits and leading +
                s = s.replace(/[^+\d]/g, '');
                // handle common patterns
                if (s.startsWith('+')) return s;
                if (s.startsWith('00')) return '+' + s.slice(2);
                if (s.startsWith('0')) return '+98' + s.slice(1);
                if (s.startsWith('98')) return '+' + s;
                if (s.startsWith('9')) return '+98' + s;
                return s;
              };

              // Split on common separators to get individual numbers
              const rawTokens = numbersPart
                .split(/[,;\\/|\u2022\u00B7–—-]+/)
                .map(t => t.trim())
                .filter(Boolean);

              if (rawTokens.length === 0) {
                return (
                  <>
                    {label && (
                      <span className='text-gray-700 mr-2'>{label}</span>
                    )}
                    <span>{raw}</span>
                  </>
                );
              }

              return (
                <>
                  {label && <span className='text-gray-700 mr-2'>{label}</span>}
                  {rawTokens.map((token, idx) => {
                    const href = normalizeForHref(token);
                    return (
                      <span key={`${token}-${idx}`}>
                        {href ? (
                          <a
                            href={`tel:${href}`}
                            className='text-blue-600 hover:underline'
                          >
                            {token}
                          </a>
                        ) : (
                          <span>{token}</span>
                        )}
                        {idx < rawTokens.length - 1 && (
                          <span className='mx-2 text-gray-500'>-</span>
                        )}
                      </span>
                    );
                  })}
                </>
              );
            })()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
