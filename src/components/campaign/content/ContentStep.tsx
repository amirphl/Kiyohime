import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';
import { useCampaign } from '../../../hooks/useCampaign';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/useToast';
import { apiService } from '../../../services/api';
import StepHeader from '../../ui/StepHeader';
import Button from '../../ui/Button';
import LinkInsertionCard from './LinkInsertionCard';
import ScheduleCard from './ScheduleCard';
import MessageTextCard from './MessageTextCard';
import MessageMediaCard from './MessageMediaCard';
import RubikaMessageCard from './RubikaMessageCard';
import BaleMessageCard from './BaleMessageCard';
import SplusMessageCard from './SplusMessageCard';
import LineNumberCard from './LineNumberCard';
import ShortLinkDomainCard from './ShortLinkDomainCard';
import PlatformSettingsCard from './PlatformSettingsCard';
import PlatformSettingsCta from './PlatformSettingsCta';
import { CampaignMediaType } from '../../../types/campaign';
import { useUrlValidation } from './useUrlValidation';
import { useLinkCharacter } from './useLinkCharacter';
import { useScheduleTime } from './useScheduleTime';
import { contentI18n } from './contentTranslations';
import { useLineNumbers } from './useLineNumbers';
import { useMediaUpload } from '../../../hooks/useMediaUpload';
import { usePlatformSettingsList } from '../../../hooks/usePlatformSettingsList';
import { useNavigation } from '../../../contexts/NavigationContext';

const ContentStep: React.FC = () => {
  const { campaignData, updateContent } = useCampaign();
  const { language } = useLanguage();
  const t = contentI18n[language as keyof typeof contentI18n] || contentI18n.en;
  const isEnglish = language === 'en';
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { accessToken } = useAuth();
  const { showError } = useToast();
  const showErrorRef = useRef(showError);
  const { uploadMedia, isUploading } = useMediaUpload(accessToken);
  const { navigate } = useNavigation();
  const platform = campaignData.level.platform || 'sms';
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<CampaignMediaType | null>(
    null
  );
  const { options: platformOptions, error: platformOptionsError } =
    usePlatformSettingsList(
      accessToken,
      platform === 'sms' ? 'bale' : platform
    );

  useEffect(() => {
    showErrorRef.current = showError;
  }, [showError]);

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

  const handlePlatformSettingsChange = (value: string) => {
    const parsed = Number(value);
    updateContent({
      platformSettingsId: Number.isFinite(parsed) ? parsed : null,
    });
  };

  const handleMediaChange = async (payload: {
    file: File;
    previewUrl: string;
    name: string;
    type: CampaignMediaType;
  }) => {
    setPreviewUrl(payload.previewUrl);
    setPreviewName(payload.name);
    setPreviewType(payload.type);
    updateContent({ mediaUuid: null });
    const uuid = await uploadMedia(payload.file);
    if (!uuid) {
      setPreviewUrl(null);
      setPreviewName(null);
      setPreviewType(null);
      updateContent({ mediaUuid: null });
      return;
    }
    updateContent({ mediaUuid: uuid });
  };

  const handleMediaClear = useCallback(() => {
    setPreviewUrl(null);
    setPreviewName(null);
    setPreviewType(null);
    updateContent({ mediaUuid: null });
  }, [updateContent]);

  const handleMediaDownload = useCallback(async () => {
    if (!campaignData.content.mediaUuid) return;
    if (!accessToken) {
      showError('Please log in again');
      return;
    }
    apiService.setAccessToken(accessToken);
    const res = await apiService.downloadMultimedia(
      campaignData.content.mediaUuid
    );
    if (!res.success || !res.blob) {
      showError(res.message || 'Failed to download media');
      return;
    }
    const url = URL.createObjectURL(res.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = res.filename || 'media';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [accessToken, campaignData.content.mediaUuid, showError]);

  useEffect(() => {
    if (!campaignData.content.mediaUuid) return;
    if (!accessToken) return;
    let isActive = true;
    apiService.setAccessToken(accessToken);
    apiService
      .previewMultimedia(campaignData.content.mediaUuid)
      .then(res => {
        if (!isActive) return;
        if (!res.success || !res.blob) {
          showErrorRef.current(res.message || 'Failed to load preview');
          return;
        }
        const url = URL.createObjectURL(res.blob);
        setPreviewUrl(url);
        setPreviewType('image');
        setPreviewName(res.filename || 'media');
      })
      .catch(() => {
        if (isActive) showErrorRef.current('Failed to load preview');
      });
    return () => {
      isActive = false;
    };
  }, [accessToken, campaignData.content.mediaUuid]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const {
    lineNumberOptions,
    isLoading: isLoadingLineNumbers,
    error: lineNumbersError,
  } = useLineNumbers(accessToken);
  useEffect(() => {
    if (platform === 'sms') {
      if (
        campaignData.content.platformSettingsId ||
        campaignData.content.mediaUuid
      ) {
        handleMediaClear();
        updateContent({ platformSettingsId: null });
      }
      return;
    }
    if (campaignData.content.lineNumber) {
      updateContent({ lineNumber: '' });
    }
  }, [
    campaignData.content.platformSettingsId,
    campaignData.content.lineNumber,
    campaignData.content.mediaUuid,
    platform,
    updateContent,
    handleMediaClear,
  ]);
  const handleReset = () => {
    clearError();
    resetLinkCharacter();
    setDateTimePicker(false, scheduleAt => updateContent({ scheduleAt }));
    updateContent({
      insertLink: false,
      link: '',
      text: '',
      scheduleAt: undefined,
      shortLinkDomain: 'jo1n.ir',
      lineNumber: '',
      platformSettingsId: null,
      mediaUuid: null,
    });
  };

  const renderPlatformMessageCard = () => {
    const commonProps = {
      title: t.mediaMessageTitle,
      label: t.campaignText,
      placeholder: t.textPlaceholder,
      mediaLabel: t.mediaLabel,
      mediaHelp: t.mediaHelp,
      removeLabel: t.removeMedia,
      text: campaignData.content.text,
      previewUrl,
      previewName,
      previewType,
      onTextChange: handleTextChange,
      onMediaChange: handleMediaChange,
      onMediaClear: handleMediaClear,
      onMediaDownload: campaignData.content.mediaUuid
        ? handleMediaDownload
        : undefined,
      downloadLabel: t.downloadMedia,
      maxCharactersLabel: t.maxCharactersLabel,
      maxCharacters: 1000,
      isUploading,
      onMediaError: showError,
    };

    switch (platform) {
      case 'rubika':
        return <RubikaMessageCard {...commonProps} />;
      case 'bale':
        return <BaleMessageCard {...commonProps} />;
      case 'splus':
        return <SplusMessageCard {...commonProps} />;
      default:
        return <MessageMediaCard {...commonProps} />;
    }
  };

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
          {campaignData.content.insertLink && (
            // <div className='mt-6'>
            <ShortLinkDomainCard
              value={campaignData.content.shortLinkDomain || 'jo1n.ir'}
              onChange={handleShortLinkDomainChange}
              title={t.shortLinkDomain}
              placeholder={t.shortLinkDomainPlaceholder}
            />
            // </div>
          )}
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
          {platform === 'sms' ? (
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
          ) : (
            renderPlatformMessageCard()
          )}
        </div>

        <div className='md:col-span-2'>
          {platform === 'sms' ? (
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
          ) : (
            <div className='space-y-2'>
              {platformOptionsError && (
                <div className='text-xs text-red-600'>
                  {platformOptionsError}
                </div>
              )}
              {!platformOptionsError && platformOptions.length === 0 ? (
                <PlatformSettingsCta
                  label={t.createPlatformInSettings}
                  actionRequiredLabel={t.platformSettingsActionRequired}
                  goToSettingsLabel={t.platformSettingsGoToSettings}
                  onClick={() => navigate('/dashboard/settings')}
                />
              ) : (
                <PlatformSettingsCard
                  value={
                    campaignData.content.platformSettingsId
                      ? String(campaignData.content.platformSettingsId)
                      : ''
                  }
                  options={platformOptions}
                  onChange={handlePlatformSettingsChange}
                  title={t.platformSettings}
                  placeholder={t.platformSettingsPlaceholder}
                />
              )}
            </div>
          )}
        </div>

        <div className='md:col-span-2 flex items-center'>
          <Button variant='outline' onClick={handleReset}>
            {t.reset}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentStep;
