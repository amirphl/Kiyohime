import React, { useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';
import { useCampaign } from '../../../hooks/useCampaign';
import { useAuth } from '../../../hooks/useAuth';
import StepHeader from '../../ui/StepHeader';
import LinkInsertionCard from './LinkInsertionCard';
import ScheduleCard from './ScheduleCard';
import MessageTextCard from './MessageTextCard';
import LineNumberCard from './LineNumberCard';
import ShortLinkDomainCard from './ShortLinkDomainCard';
import { useUrlValidation } from './useUrlValidation';
import { useLinkCharacter } from './useLinkCharacter';
import { useScheduleTime } from './useScheduleTime';
import { contentI18n } from './contentTranslations';
import { useLineNumbers } from './useLineNumbers';

const ContentStep: React.FC = () => {
  const { campaignData, updateContent } = useCampaign();
  const { language } = useLanguage();
  const t = contentI18n[language as keyof typeof contentI18n] || contentI18n.en;
  const isEnglish = language === 'en';
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { accessToken } = useAuth();

  // Custom hooks for business logic
  const { linkError, handleLinkChange, clearError } = useUrlValidation(
    campaignData.content.link,
    campaignData.content.insertLink,
    t.linkInvalidUrl
  );

  const { linkCharacterInserted, insertLinkCharacter, resetLinkCharacter } =
    useLinkCharacter(campaignData.content.text);

  const { showDateTimePicker, setDateTimePicker } = useScheduleTime(
    campaignData.content.scheduleAt
  );

  // Event handlers
  const handleInsertLinkChange = (value: boolean) => {
    const newInsertLink = value;
    updateContent({
      insertLink: newInsertLink,
      link: newInsertLink ? campaignData.content.link : '',
    });
    clearError();
    if (!newInsertLink) {
      resetLinkCharacter();
    }
  };

  const handleLinkChangeWrapper = (value: string) => {
    handleLinkChange(value, val => updateContent({ link: val }));
  };

  const handleTextChange = (value: string) => {
    updateContent({ text: value });
  };

  const handleInsertLinkCharacter = () => {
    insertLinkCharacter(
      textAreaRef,
      campaignData.content.text || '',
      handleTextChange
    );
  };

  const handleDateTimeChange = (value: boolean) => {
    setDateTimePicker(value, scheduleAt => updateContent({ scheduleAt }));
  };

  const handleScheduleChange = (scheduleAt?: string) => {
    updateContent({ scheduleAt });
  };

  const handleLineNumberChange = (value: string) => {
    updateContent({ lineNumber: value });
  };

  const handleShortLinkDomainChange = (value: string) => {
    updateContent({ shortLinkDomain: value });
  };

  const { lineNumberOptions, isLoading: isLoadingLineNumbers, error: lineNumbersError } = useLineNumbers(accessToken);

  return (
    <div className='space-y-8'>
      <StepHeader
        title={t.title}
        subtitle={''}
        icon={<MessageSquare className='h-6 w-6 text-primary-600' />}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch'>
        {/* Row 1 - Col 1: Insert Link */}
        <div className='flex flex-col'>
          <LinkInsertionCard
            insertLink={campaignData.content.insertLink}
            link={campaignData.content.link}
            linkError={linkError}
            onInsertLinkChange={handleInsertLinkChange}
            onLinkChange={handleLinkChangeWrapper}
            title={t.insertLink}
            onLabel={t.on}
            offLabel={t.off}
            enabledLabel={t.linkInsertionEnabled}
            disabledLabel={t.linkInsertionDisabled}
            linkLabel={t.campaignLink}
            linkPlaceholder={t.linkPlaceholder}
            linkValidation={t.linkValidation}
            charactersLabel={t.characters}
          />
        </div>

        {/* Row 1 - Col 2: DateTime Picker */}
        <div className='flex flex-col'>
          <ScheduleCard
            showDateTimePicker={showDateTimePicker}
            scheduleAt={campaignData.content.scheduleAt}
            isEnglish={isEnglish}
            onToggleChange={handleDateTimeChange}
            onScheduleChange={handleScheduleChange}
            title={t.scheduleAt}
            disableLabel={t.disableSchedule}
            enableLabel={t.enableSchedule}
            scheduledLabel={t.campaignScheduled}
            immediateLabel={t.campaignImmediate}
            dateTimeLabel={t.scheduleDateTime}
            tooSoonError={t.scheduleTooSoon}
          />
        </div>

        {/* Row 2: Text Box (Full Width) */}
        <div className='md:col-span-2'>
          <MessageTextCard
            text={campaignData.content.text}
            insertLink={campaignData.content.insertLink}
            textAreaRef={textAreaRef}
            linkCharacterInserted={linkCharacterInserted}
            onTextChange={handleTextChange}
            onInsertLinkCharacter={handleInsertLinkCharacter}
            title={t.text}
            label={t.campaignText}
            placeholder={t.textPlaceholder}
            insertLinkCharacterLabel={t.insertLinkCharacter}
            linkCharacterInsertedLabel={t.linkCharacterInserted}
            linkCharacterInsertedMessage={t.linkCharacterInsertedMessage}
            charactersLabel={t.charactersLabel}
            totalLabel={t.totalLabel}
            partsLabel={t.partsLabel}
            partsCount={t.partsCount}
            partsBreakdown={t.partsBreakdown}
            partsExplanation={t.partsExplanation}
            withLinkExplanation={t.withLinkExplanation}
            withoutLinkExplanation={t.withoutLinkExplanation}
            textExceedsLimit={t.textExceedsLimit}
          />
        </div>

        <div className='md:col-span-2'>
          <ShortLinkDomainCard
            value={campaignData.content.shortLinkDomain || 'jo1n.ir'}
            onChange={handleShortLinkDomainChange}
            title={t.shortLinkDomain}
            placeholder={t.shortLinkDomainPlaceholder}
          />
        </div>

        <div className='md:col-span-2'>
          <LineNumberCard
            value={campaignData.content.lineNumber || ''}
            options={lineNumberOptions}
            isLoading={isLoadingLineNumbers}
            error={lineNumbersError}
            onChange={handleLineNumberChange}
            title={t.lineNumber}
            label={''}
            placeholder={t.lineNumberPlaceholder}
            helpText={''}
            priceFactorLabel={t.linePriceFactor}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentStep;
