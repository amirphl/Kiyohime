import React from 'react';
import { ExternalLink, Link2, Tag } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { contentI18n } from '../../../components/campaign/content/contentTranslations';
import { replaceUidPlaceholder } from '../../../components/campaign/content/useLinkUidPlaceholder';
import { useLanguage } from '../../../hooks/useLanguage';
import { BundleListItem } from '../../../types/bundle';
import { BundlesCopy } from '../translations';
import {
  getBundleShortLinkDomain,
  hasBundleTrackingPlaceholder,
} from '../utils';

interface BundleLinkDetailsSectionProps {
  bundle: BundleListItem;
  copy: BundlesCopy;
}

const BundleLinkDetailsSection: React.FC<BundleLinkDetailsSectionProps> = ({
  bundle,
  copy,
}) => {
  const { language } = useLanguage();
  const contentCopy =
    contentI18n[language as keyof typeof contentI18n] || contentI18n.en;
  const link = bundle.adlink?.trim() || '';
  const resolvedPreviewLink = replaceUidPlaceholder(link, '123456');
  const shortLinkDomain = getBundleShortLinkDomain(bundle);
  const hasTracking = hasBundleTrackingPlaceholder(bundle);
  const canOpen = Boolean(resolvedPreviewLink);

  return (
    <section className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>
          {copy.detailPage.sections.link}
        </h2>
      </div>

      <div className='grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]'>
        <Card className='h-full'>
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-lg font-medium text-gray-900'>
              <Link2 className='h-5 w-5 text-primary-600' />
              {contentCopy.insertLink}
            </h3>

            <div className='rounded-xl border-l-4 border-primary-600 bg-blue-50 p-3 text-sm text-gray-700'>
              {contentCopy.linkAnalysisInfo}
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                {copy.detailPage.fields.link}
              </label>
              <div className='rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-left text-sm text-gray-900'>
                {link || copy.detailPage.values.notAvailable}
              </div>
            </div>

            <div className='flex flex-wrap items-center gap-2'>
              <span
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium ${
                  hasTracking
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 bg-white text-gray-700'
                }`}
              >
                <Tag className='h-4 w-4' />
                {copy.detailPage.fields.trackingPlaceholder}:{' '}
                {hasTracking
                  ? copy.detailPage.values.enabled
                  : copy.detailPage.values.disabled}
              </span>

              <button
                type='button'
                disabled={!canOpen}
                onClick={() => {
                  if (canOpen) {
                    window.open(
                      resolvedPreviewLink,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }
                }}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                  canOpen
                    ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                }`}
              >
                <ExternalLink className='h-4 w-4' />
                {contentCopy.previewUidLink}
              </button>
            </div>
          </div>
        </Card>

        <Card className='h-full'>
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900'>
              {copy.detailPage.fields.linkTracking}
            </h3>

            <div className='rounded-2xl border border-gray-200 bg-gray-50 p-4'>
              <p className='text-sm font-semibold text-gray-700'>
                {copy.detailPage.fields.shortLinkDomain}
              </p>
              <p className='mt-2 text-base text-gray-900'>
                {shortLinkDomain || copy.detailPage.values.disabled}
              </p>
            </div>

            <div className='rounded-2xl border border-gray-200 bg-gray-50 p-4'>
              <p className='text-sm font-semibold text-gray-700'>
                {copy.detailPage.fields.trackingPlaceholder}
              </p>
              <p className='mt-2 text-base text-gray-900'>
                {hasTracking ? '{uid}' : copy.detailPage.values.notAvailable}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default BundleLinkDetailsSection;
