import React from 'react';
import {
  BarChart3,
  FlaskConical,
  MessageCircle,
  MousePointerClick,
  Send,
} from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';
import { BundleListItem } from '../../../types/bundle';
import { BundlesCopy } from '../translations';
import {
  formatBundleNumber,
  getBundleClicksCount,
  getBundleExecutionCampaigns,
  getBundleSentCount,
  getBundleTestCampaigns,
  getBundleTotalCampaigns,
} from '../utils';

interface BundlePerformanceSectionProps {
  bundle: BundleListItem;
  copy: BundlesCopy;
}

const BundlePerformanceSection: React.FC<BundlePerformanceSectionProps> = ({
  bundle,
  copy,
}) => {
  const { language } = useLanguage();
  const locale: 'fa-IR' | 'en-US' = language === 'fa' ? 'fa-IR' : 'en-US';

  const cards = [
    {
      label: copy.detailPage.stats.totalCampaigns,
      value: formatBundleNumber(getBundleTotalCampaigns(bundle), locale),
      icon: <Send className='h-5 w-5 text-primary-600' />,
    },
    {
      label: copy.detailPage.stats.testCampaigns,
      value: formatBundleNumber(getBundleTestCampaigns(bundle), locale),
      icon: <FlaskConical className='h-5 w-5 text-primary-600' />,
    },
    {
      label: copy.detailPage.stats.executionCampaigns,
      value: formatBundleNumber(getBundleExecutionCampaigns(bundle), locale),
      icon: <BarChart3 className='h-5 w-5 text-primary-600' />,
    },
    {
      label: copy.detailPage.stats.totalSent,
      value: formatBundleNumber(getBundleSentCount(bundle), locale),
      icon: <MessageCircle className='h-5 w-5 text-primary-600' />,
    },
    {
      label: copy.detailPage.stats.totalClicks,
      value: formatBundleNumber(getBundleClicksCount(bundle), locale),
      icon: <MousePointerClick className='h-5 w-5 text-primary-600' />,
    },
  ];

  return (
    <section className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>
          {copy.detailPage.sections.performance}
        </h2>
        <p className='mt-2 text-sm text-gray-500'>
          {copy.detailPage.subtitles.performance}
        </p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
        {cards.map(card => (
          <article
            key={card.label}
            className='rounded-2xl border border-gray-200 bg-gray-50/70 p-4 shadow-sm'
          >
            <div className='mb-3 flex items-center justify-between gap-3'>
              <h3 className='text-sm font-semibold text-gray-700'>
                {card.label}
              </h3>
              <div className='rounded-full bg-primary-50 p-2'>{card.icon}</div>
            </div>
            <p className='text-3xl font-bold text-primary-700'>{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BundlePerformanceSection;
