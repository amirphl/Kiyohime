import React, { useMemo } from 'react';
import { translations } from '../locales/translations';
import { useLanguage } from '../hooks/useLanguage';

const AdminSardisPage: React.FC = () => {
  const { language } = useLanguage();
  const t = useMemo(() => translations[language], [language]);

  const go = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new CustomEvent('navigation', { detail: { path } }));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">{t.adminSardis?.title || 'Sardis (Admin)'}</h1>
      <p className="text-gray-600 mb-6">{t.adminSardis?.subtitle || 'Admin landing page. Use the menu to navigate to sections.'}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button className="border rounded px-4 py-3 text-left hover:bg-gray-50" onClick={() => go('/satrap/sardis/line-numbers')}>
          <div className="font-medium">{t.adminLineNumbers?.managementTitle || 'Line Number Management'}</div>
          <div className="text-xs text-gray-500 mt-1">{t.adminSardis?.cards?.lineNumbers?.description || 'Create, manage, update and report line numbers'}</div>
        </button>
        <div className="border rounded px-4 py-3 text-left opacity-60 cursor-not-allowed">
          <div className="font-medium">Segments</div>
          <div className="text-xs text-gray-500 mt-1">{t.common?.comingSoon || 'Coming soon'}</div>
        </div>
        <div className="border rounded px-4 py-3 text-left opacity-60 cursor-not-allowed">
          <div className="font-medium">Tags</div>
          <div className="text-xs text-gray-500 mt-1">{t.common?.comingSoon || 'Coming soon'}</div>
        </div>
        <div className="border rounded px-4 py-3 text-left opacity-60 cursor-not-allowed">
          <div className="font-medium">Customers</div>
          <div className="text-xs text-gray-500 mt-1">{t.common?.comingSoon || 'Coming soon'}</div>
        </div>
        <button className="border rounded px-4 py-3 text-left hover:bg-gray-50" onClick={() => go('/satrap/campaigns')}>
          <div className="font-medium">{t.adminSardis?.cards?.campaigns?.title || 'Campaigns'}</div>
          <div className="text-xs text-gray-500 mt-1">{t.adminSardis?.cards?.campaigns?.description || 'Admin campaign management'}</div>
        </button>
        <div className="border rounded px-4 py-3 text-left opacity-60 cursor-not-allowed">
          <div className="font-medium">Support</div>
          <div className="text-xs text-gray-500 mt-1">{t.common?.comingSoon || 'Coming soon'}</div>
        </div>
        <div className="border rounded px-4 py-3 text-left opacity-60 cursor-not-allowed">
          <div className="font-medium">Finance</div>
          <div className="text-xs text-gray-500 mt-1">{t.common?.comingSoon || 'Coming soon'}</div>
        </div>
        <div className="border rounded px-4 py-3 text-left opacity-60 cursor-not-allowed">
          <div className="font-medium">Shortener</div>
          <div className="text-xs text-gray-500 mt-1">{t.common?.comingSoon || 'Coming soon'}</div>
        </div>
        <div className="border rounded px-4 py-3 text-left opacity-60 cursor-not-allowed">
          <div className="font-medium">Sent SMS</div>
          <div className="text-xs text-gray-500 mt-1">{t.common?.comingSoon || 'Coming soon'}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminSardisPage; 