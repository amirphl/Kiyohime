import React, { useMemo } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import Card from '../../ui/Card';
import FormField from '../../ui/FormField';
import { CampaignMediaAttachment } from '../../../types/campaign';

interface MessageMediaCardProps {
  title: string;
  label: string;
  placeholder: string;
  mediaLabel: string;
  mediaHelp: string;
  removeLabel: string;
  text: string;
  mediaAttachment?: CampaignMediaAttachment | null;
  onTextChange: (value: string) => void;
  onMediaChange: (payload: CampaignMediaAttachment) => void;
  onMediaClear: () => void;
  maxCharactersLabel: string;
  maxCharacters: number;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'video/mp4'];

const MessageMediaCard: React.FC<MessageMediaCardProps> = ({
  title,
  label,
  placeholder,
  mediaLabel,
  mediaHelp,
  removeLabel,
  text,
  mediaAttachment,
  onTextChange,
  onMediaChange,
  onMediaClear,
  maxCharactersLabel,
  maxCharacters,
}) => {
  const remaining = Math.max(0, maxCharacters - (text?.length || 0));
  const remainingLabel = useMemo(
    () => maxCharactersLabel.replace('{count}', String(remaining)),
    [maxCharactersLabel, remaining]
  );

  const handleTextChange = (value: string) => {
    const nextValue = value.length > maxCharacters ? value.slice(0, maxCharacters) : value;
    onTextChange(nextValue);
  };

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      onMediaChange({ dataUrl: result, type, name: file.name });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card>
      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900 flex items-center gap-1'>
          <ImageIcon className='h-5 w-5 text-primary-600' />
          {title}
        </h3>

        <FormField
          id='messageText'
          label={label}
          type='textarea'
          placeholder={placeholder}
          value={text}
          onChange={handleTextChange}
          required
          rows={8}
        />
        <p className='text-sm text-gray-500'>{remainingLabel}</p>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>{mediaLabel}</label>
          <input
            type='file'
            accept='image/jpeg,image/png,video/mp4'
            onChange={handleMediaChange}
            className='block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100'
          />
          <p className='text-xs text-gray-500'>{mediaHelp}</p>
        </div>

        {mediaAttachment?.dataUrl && (
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-700'>{mediaAttachment.name}</span>
              <button
                type='button'
                onClick={onMediaClear}
                className='text-sm text-red-600 hover:text-red-700'
              >
                {removeLabel}
              </button>
            </div>
            {mediaAttachment.type === 'image' ? (
              <img src={mediaAttachment.dataUrl} alt={mediaAttachment.name || 'media preview'} className='max-h-64 rounded-md border' />
            ) : (
              <video controls className='w-full max-h-64 rounded-md border'>
                <source src={mediaAttachment.dataUrl} />
              </video>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MessageMediaCard;
