import React from 'react';
import MessageMediaCard from './MessageMediaCard';
import { CampaignMediaAttachment } from '../../../types/campaign';

interface SplusMessageCardProps {
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

const SplusMessageCard: React.FC<SplusMessageCardProps> = props => (
  <MessageMediaCard {...props} />
);

export default SplusMessageCard;
