import React from 'react';
import { MessageSquare } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import FormField from '../../ui/FormField';
import {
  countCharacters,
  calculateTotalCharacterCount,
  calculateSMSParts,
} from '../../../utils/campaignUtils';

interface MessageTextCardProps {
  text: string;
  insertLink: boolean;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  linkCharacterInserted: boolean;
  onTextChange: (value: string) => void;
  onInsertLinkCharacter: () => void;
  title: string;
  label: string;
  placeholder: string;
  insertLinkCharacterLabel: string;
  linkCharacterInsertedLabel: string;
  linkCharacterInsertedMessage: string;
  charactersLabel: string;
  totalLabel: string;
  partsLabel: string;
  partsCount: string;
  partsBreakdown: string;
  partsExplanation: string;
  withLinkExplanation: string;
  withoutLinkExplanation: string;
  textExceedsLimit: string;
}

const MessageTextCard: React.FC<MessageTextCardProps> = ({
  text,
  insertLink,
  textAreaRef,
  linkCharacterInserted,
  onTextChange,
  onInsertLinkCharacter,
  title,
  label,
  placeholder,
  insertLinkCharacterLabel,
  linkCharacterInsertedLabel,
  linkCharacterInsertedMessage,
  charactersLabel,
  totalLabel,
  partsLabel,
  partsCount,
  partsBreakdown,
  partsExplanation,
  withLinkExplanation,
  withoutLinkExplanation,
  textExceedsLimit,
}) => {
  const characterCount = countCharacters(text || '');
  const charCountResult = calculateTotalCharacterCount(text || '', insertLink);
  const totalCharacterCount = charCountResult.totalCharacterCount;
  const isOverLimit = charCountResult.isOverLimit;
  const maxCharacters = charCountResult.maxCharacters;
  const numberOfParts = calculateSMSParts(totalCharacterCount);

  return (
    <Card>
      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900 flex items-center'>
          <MessageSquare className='h-5 w-5 mr-2 text-primary-600' />
          {title}
        </h3>
        <FormField
          id='text'
          label={label}
          type='textarea'
          placeholder={placeholder}
          value={text || ''}
          onChange={onTextChange}
          required
          ref={textAreaRef}
        />
        {insertLink && !(text || '').includes('🔗') && (
          <p className='text-sm text-red-600'>{linkCharacterInsertedMessage}</p>
        )}
        {insertLink && (
          <div className='mt-4'>
            <Button
              variant='outline'
              onClick={onInsertLinkCharacter}
              size='sm'
              disabled={linkCharacterInserted || !text}
            >
              {linkCharacterInserted
                ? linkCharacterInsertedLabel
                : insertLinkCharacterLabel}
            </Button>
            {linkCharacterInserted && (
              <p className='text-sm text-green-600 mt-2'>
                {linkCharacterInsertedMessage}
              </p>
            )}
          </div>
        )}
        <div className='space-y-2'>
          <div
            className={`text-sm ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}
          >
            <div className='flex items-center justify-between'>
              <span>
                {charactersLabel.replace('{count}', String(characterCount))}
              </span>
              <span>
                {totalLabel
                  .replace('{count}', String(totalCharacterCount))
                  .replace('{max}', String(maxCharacters))}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span>
                {partsLabel.replace('{count}', String(numberOfParts))}
              </span>
              <span className='font-medium'>
                {partsCount
                  .replace('{total}', String(totalCharacterCount))
                  .replace('{parts}', String(numberOfParts))}
              </span>
            </div>
          </div>
          <div className='text-xs text-gray-500 bg-gray-50 p-2 rounded'>
            <div className='font-medium mb-1'>{partsBreakdown}</div>
            <div>{partsExplanation}</div>
            <div className='mt-1'>
              {insertLink ? withLinkExplanation : withoutLinkExplanation}
            </div>
          </div>
          {isOverLimit && (
            <div className='text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200'>
              {textExceedsLimit}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MessageTextCard;
