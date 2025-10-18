import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../hooks/useLanguage';
import { useCampaign } from '../../hooks/useCampaign';
import StepHeader from '../ui/StepHeader';
import Card from '../ui/Card';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import { Link, MessageSquare, Calendar } from 'lucide-react';
import { countCharacters, calculateTotalCharacterCount, calculateSMSParts } from '../../utils/campaignUtils';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import gregorian from 'react-date-object/calendars/gregorian';
import gregorian_en from 'react-date-object/locales/gregorian_en';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';

const CampaignContentStep: React.FC = () => {
  const { t } = useTranslation();
  const { campaignData, updateContent } = useCampaign();
  const { language } = useLanguage();
  const isEnglish = language === 'en';
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [linkError, setLinkError] = useState<string>('');
  const [linkCharacterInserted, setLinkCharacterInserted] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize showDateTimePicker based on existing scheduleAt value
  useEffect(() => {
    if (campaignData.content.scheduleAt) {
      setShowDateTimePicker(true);
    }
  }, [campaignData.content.scheduleAt]);

  // Check if link character is already in text
  useEffect(() => {
    if (campaignData.content.text && campaignData.content.text.includes('🔗')) {
      setLinkCharacterInserted(true);
    } else {
      setLinkCharacterInserted(false);
    }
  }, [campaignData.content.text]);

  // Validate link when loaded from localStorage
  useEffect(() => {
    if (campaignData.content.link && campaignData.content.insertLink) {
      // Clear previous error first
      setLinkError('');
      
      // Validate the loaded link
      if (!validateUrl(campaignData.content.link)) {
        setLinkError(t('campaign.content.linkInvalidUrl'));
      }
    }
  }, [campaignData.content.link, campaignData.content.insertLink, t]);

  // URL validation function
  const validateUrl = (url: string) => {
    if (!url.trim()) return true; // Empty is valid (not required)
    
    try {
      // Check if it's a valid URL
      const urlObj = new URL(url);
      // Ensure it has http or https protocol
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleInsertLinkToggle = () => {
    const newInsertLink = !campaignData.content.insertLink;
    updateContent({ 
      insertLink: newInsertLink,
      // Clear link if turning off
      link: newInsertLink ? campaignData.content.link : ''
    });
    // Clear link error when toggling
    setLinkError('');
    // Reset link character inserted state when turning off link insertion
    if (!newInsertLink) {
      setLinkCharacterInserted(false);
    }
  };

  const handleLinkChange = (value: string) => {
    // Clear previous error
    setLinkError('');
    
    // Validate URL if not empty
    if (value.trim() && !validateUrl(value)) {
      setLinkError(t('campaign.content.linkInvalidUrl'));
    }
    
    updateContent({ link: value });
  };

  const handleTextChange = (value: string) => {
    updateContent({ text: value });
  };

  const handleInsertLinkCharacter = () => {
    if (linkCharacterInserted || !textAreaRef.current) return;
    
    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = campaignData.content.text || '';
    
    // Insert the link character at cursor position
    const newText = text.substring(0, start) + '🔗' + text.substring(end);
    
    updateContent({ text: newText });
    setLinkCharacterInserted(true);
    
    // Set cursor position after the inserted character
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 1, start + 1);
    }, 0);
  };

  const handleScheduleAtChange = (value: string) => {
    updateContent({ scheduleAt: value });
  };

  const handleDateTimeToggle = () => {
    setShowDateTimePicker(!showDateTimePicker);
    if (!showDateTimePicker) {
      // Set default schedule to now + 20 minutes (Tehran timezone formatting is handled on display)
      const now = new Date();
      const plus20 = new Date(now.getTime() + 20 * 60 * 1000);
      updateContent({ scheduleAt: plus20.toISOString() });
    } else {
      // Clear schedule when disabling
      updateContent({ scheduleAt: undefined });
    }
  };

  const formatTehranDateTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  // Character counting logic with Farsi support (excluding link character)
  const characterCount = countCharacters(campaignData.content.text || '');
  
  // Calculate total character count using utility function
  const charCountResult = calculateTotalCharacterCount(campaignData.content.text || '', campaignData.content.insertLink);
  
  const totalCharacterCount = charCountResult.totalCharacterCount;
  const isOverLimit = charCountResult.isOverLimit;
  const maxCharacters = charCountResult.maxCharacters;
  
  // Calculate number of parts
  const numberOfParts = calculateSMSParts(totalCharacterCount);

  const linkCharacterCount = campaignData.content.link?.length || 0;
  const maxLinkCharacters = 10000;
  const isLinkOverLimit = linkCharacterCount > maxLinkCharacters;

  return (
    <div className="space-y-8">
      <StepHeader
        title={t('campaign.content.title')}
        subtitle={t('campaign.content.subtitle')}
        icon={<MessageSquare className="h-6 w-6 text-red-600" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Row 1 - Col 1: Insert Link + Link Text Box */}
        <div className="flex flex-col">
          <Card className="h-full">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Link className="h-5 w-5 mr-2 text-red-600" />
                {t('campaign.content.insertLink')}
              </h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant={campaignData.content.insertLink ? 'primary' : 'outline'}
                  onClick={handleInsertLinkToggle}
                  size="sm"
                >
                  {campaignData.content.insertLink ? t('campaign.content.on') : t('campaign.content.off')}
                </Button>
                <span className="text-sm text-gray-600">
                  {campaignData.content.insertLink ? t('campaign.content.linkInsertionEnabled') : t('campaign.content.linkInsertionDisabled')}
                </span>
      </div>

              {campaignData.content.insertLink && (
                <>
                  <FormField
                    id="link"
                    label={t('campaign.content.campaignLink')}
                    type="text"
                    placeholder={t('campaign.content.linkPlaceholder')}
                    value={campaignData.content.link || ''}
                    onChange={handleLinkChange}
                    required
                    validation={{
                      max: 10000,
                      message: t('campaign.content.linkValidation')
                    }}
                  />
                  {linkError && (
                    <p className="text-sm text-red-600">{linkError}</p>
                  )}
                  <div className={`text-sm ${isLinkOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
                    {linkCharacterCount} / {maxLinkCharacters} {t('campaign.content.characters')}
                  </div>
                </>
              )}
          </div>
          </Card>
        </div>

        {/* Row 1 - Col 2: DateTime Picker */}
        <div className="flex flex-col">
          <Card className="h-full">
        <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-red-600" />
                {t('campaign.content.scheduleAt')}
              </h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant={showDateTimePicker ? 'primary' : 'outline'}
                  onClick={handleDateTimeToggle}
                  size="sm"
                >
                  {showDateTimePicker ? t('campaign.content.disableSchedule') : t('campaign.content.enableSchedule')}
                </Button>
                <span className="text-sm text-gray-600">
                  {showDateTimePicker ? t('campaign.content.campaignScheduled') : t('campaign.content.campaignImmediate')}
                </span>
              </div>
              {showDateTimePicker && (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="scheduleAt" className="block text-sm font-medium text-gray-700">
                      {t('campaign.content.scheduleDateTime')}
                    </label>
                    <DatePicker
                      calendar={isEnglish ? gregorian : persian}
                      locale={isEnglish ? gregorian_en : persian_fa}
                      plugins={[<TimePicker hideSeconds={false} />]}
                      value={campaignData.content.scheduleAt ? new Date(campaignData.content.scheduleAt) : undefined}
                      onChange={(val: any) => {
                        if (!val) {
                          updateContent({ scheduleAt: undefined });
                          return;
                        }
                        try {
                          const jsDate = val.toDate ? val.toDate() : new Date(val);
                          updateContent({ scheduleAt: jsDate.toISOString() });
                        } catch {
                          updateContent({ scheduleAt: undefined });
                        }
                      }}
                      format="YYYY/MM/DD HH:mm:ss"
                      className="w-full mt-1"
                    />
                    {/* Inline validation message for < now+10m */}
                    {(() => {
                      const nowMs = Date.now();
                      const minMs = nowMs + 20 * 60 * 1000;
                      const schedMs = campaignData.content.scheduleAt ? new Date(campaignData.content.scheduleAt).getTime() : NaN;
                      const invalid = campaignData.content.scheduleAt ? (Number.isNaN(schedMs) || schedMs < minMs) : false;
                      return invalid ? (
                        <p className="text-sm text-red-600 mt-2">{t('campaign.content.scheduleTooSoon')}</p>
                      ) : null;
                    })()}
                  </div>
                </div>
              )}
            </div>
          </Card>
              </div>

        {/* Row 2: Text Box (Full Width) */}
        <div className="md:col-span-2">
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-red-600" />
                {t('campaign.content.text')}
              </h3>
              <FormField
                id="text"
                label={t('campaign.content.campaignText')}
                type="textarea"
                placeholder={t('campaign.content.textPlaceholder')}
                value={campaignData.content.text || ''}
                onChange={handleTextChange}
                required
                ref={textAreaRef}
              />
              {campaignData.content.insertLink && !(campaignData.content.text || '').includes('🔗') && (
                <p className="text-sm text-red-600">{t('campaign.content.linkCharacterInsertedMessage')}</p>
              )}
              {campaignData.content.insertLink && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={handleInsertLinkCharacter}
                    size="sm"
                    disabled={linkCharacterInserted || !campaignData.content.text}
                  >
                    {linkCharacterInserted ? t('campaign.content.linkCharacterInserted') : t('campaign.content.insertLinkCharacter')}
                  </Button>
                  {linkCharacterInserted && (
                    <p className="text-sm text-green-600 mt-2">
                      {t('campaign.content.linkCharacterInsertedMessage')}
                    </p>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <div className={`text-sm ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
                  <div className="flex items-center justify-between">
                    <span>{t('campaign.content.charactersLabel', { count: characterCount })}</span>
                    <span>{t('campaign.content.totalLabel', { count: totalCharacterCount, max: maxCharacters })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('campaign.content.partsLabel', { count: numberOfParts })}</span>
                    <span className="font-medium">{t('campaign.content.partsCount', { total: totalCharacterCount, parts: numberOfParts })}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <div className="font-medium mb-1">{t('campaign.content.partsBreakdown')}</div>
                  <div>{t('campaign.content.partsExplanation')}</div>
                  <div className="mt-1">
                    {campaignData.content.insertLink ? t('campaign.content.withLinkExplanation') : t('campaign.content.withoutLinkExplanation')}
              </div>
              </div>
                {isOverLimit && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                    {t('campaign.content.textExceedsLimit')}
              </div>
                )}
              </div>
          </div>
          </Card>
        </div> 
      </div>
    </div>
  );
};

export default CampaignContentStep; 