import React from 'react';
import MessageMediaCard from './MessageMediaCard';
import { CampaignMediaType } from '../../../types/campaign';

interface RubikaMessageCardProps {
  title: string;
  label: string;
  placeholder: string;
  mediaLabel: string;
  mediaHelp: string;
  removeLabel: string;
  text: string;
  insertLink: boolean;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  linkCharacterInserted: boolean;
  onInsertLinkCharacter: () => void;
  insertLinkCharacterLabel: string;
  linkCharacterInsertedLabel: string;
  linkCharacterInsertedMessage: string;
  previewUrl?: string | null;
  previewName?: string | null;
  previewType?: CampaignMediaType | null;
  onTextChange: (value: string) => void;
  onMediaChange: (payload: { file: File; previewUrl: string; name: string; type: CampaignMediaType }) => void;
  onMediaClear: () => void;
  onMediaDownload?: () => void;
  downloadLabel: string;
  maxCharactersLabel: string;
  maxCharacters: number;
  isUploading?: boolean;
  onMediaError?: (message: string) => void;
}

const RubikaMessageCard: React.FC<RubikaMessageCardProps> = props => (
  <MessageMediaCard {...props} />
);

export default RubikaMessageCard;
