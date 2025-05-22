import { useLanguage } from './useLanguage';
import { translations } from '../locales/translations';

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: string, params?: Record<string, any>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if not found in fallback
          }
        }
        break;
      }
    }
    
    let result = typeof value === 'string' ? value : key;
    
    // Replace parameters if provided
    if (params) {
      Object.keys(params).forEach(paramKey => {
        result = result.replace(new RegExp(`{${paramKey}}`, 'g'), String(params[paramKey]));
      });
    }
    
    return result;
  };

  return { t };
}; 