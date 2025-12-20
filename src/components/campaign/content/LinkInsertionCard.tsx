import React from 'react';
import { Link } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import FormField from '../../ui/FormField';
import { useLanguage } from '../../../hooks/useLanguage';
import { contentI18n } from './contentTranslations';

interface LinkInsertionCardProps {
  insertLink: boolean;
  link: string;
  linkError: string;
  onInsertLinkChange: (value: boolean) => void;
  onLinkChange: (value: string) => void;
  title: string;
  onLabel: string;
  offLabel: string;
  enabledLabel: string;
  disabledLabel: string;
  linkLabel: string;
  linkPlaceholder: string;
  linkValidation: string;
  charactersLabel: string;
}

const LinkInsertionCard: React.FC<LinkInsertionCardProps> = ({
  insertLink,
  link,
  linkError,
  onInsertLinkChange,
  onLinkChange,
  title,
  onLabel,
  offLabel,
  enabledLabel,
  disabledLabel,
  linkLabel,
  linkPlaceholder,
  linkValidation,
  charactersLabel,
}) => {
  const linkCharacterCount = link?.length || 0;
  const maxLinkCharacters = 10000;
  const isLinkOverLimit = linkCharacterCount > maxLinkCharacters;
  const { language } = useLanguage();
  const t = contentI18n[language as keyof typeof contentI18n] || contentI18n.en;

  return (
    <Card className='h-full'>
      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900 flex items-center'>
          <Link className='h-5 w-5 mr-2 text-primary-600' />
          {title}
        </h3>
        <div className='flex items-center space-x-4'>
          <label className='inline-flex items-center space-x-2 cursor-pointer'>
            <input
              type='radio'
              name='insertLink'
              value='on'
              checked={insertLink === true}
              onChange={() => onInsertLinkChange(true)}
              className='h-4 w-4 text-primary-600 border-gray-300'
            />
            <span className='text-sm text-gray-700'>{onLabel}</span>
          </label>
          <label className='inline-flex items-center space-x-2 cursor-pointer'>
            <input
              type='radio'
              name='insertLink'
              value='off'
              checked={insertLink === false}
              onChange={() => onInsertLinkChange(false)}
              className='h-4 w-4 text-primary-600 border-gray-300'
            />
            <span className='text-sm text-gray-700'>{offLabel}</span>
          </label>
          <span className='text-sm text-gray-600'>
            {insertLink ? enabledLabel : disabledLabel}
          </span>
        </div>

        {insertLink && (
          <>
            <div className='bg-blue-50 border-l-4 border-primary-600 p-3 rounded text-sm text-gray-700'>
              {t.linkAnalysisInfo}
            </div>
            <div className='h-2' />
            <FormField
              id='link'
              label={linkLabel}
              type='text'
              placeholder={linkPlaceholder}
              value={link || ''}
              onChange={(val: string) => {
                // Force-remove any spaces from the link before propagating
                const sanitized = val.replace(/\s+/g, '');
                onLinkChange(sanitized);
              }}
              required
              validation={{
                max: 10000,
                message: linkValidation,
              }}
            />
            {linkError && <p className='text-sm text-red-600'>{linkError}</p>}
            <div
              className={`text-sm ${isLinkOverLimit ? 'text-red-600' : 'text-gray-500'}`}
            >
              {linkCharacterCount} / {maxLinkCharacters} {charactersLabel}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default LinkInsertionCard;
