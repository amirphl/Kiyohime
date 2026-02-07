import React from 'react';
import { MessageSquare } from 'lucide-react';
import Card from '../../ui/Card';

interface MessageCountCardProps {
  messageCount?: number;
  maxMessageCount?: number;
  isLoading: boolean;
  error: string | null;
  lineNumber: string;
  totalBudget: number;
  title: string;
  calculatingLabel: string;
  messagesLabel: string;
  calculatingText: string;
  enterBudgetText: string;
  sentLabel: string;
  capacityLabel: string;
}

const MessageCountCard: React.FC<MessageCountCardProps> = ({
  messageCount,
  maxMessageCount,
  isLoading,
  error,
  lineNumber,
  totalBudget,
  title,
  calculatingLabel,
  messagesLabel,
  calculatingText,
  enterBudgetText,
  sentLabel,
  capacityLabel,
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='flex items-center space-x-2 text-gray-600'>
          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600'></div>
          <span>{calculatingLabel}</span>
        </div>
      );
    }

    if (messageCount !== undefined) {
      return (
        <div className='space-y-2'>
          <div className='flex items-center justify-between text-sm text-gray-700'>
            <span>{sentLabel}</span>
            <span className='font-semibold text-primary-600 text-lg'>
              {messageCount.toLocaleString()}
            </span>
          </div>
          <div className='flex items-center justify-between text-sm text-gray-700'>
            <span>{capacityLabel}</span>
            <span className='font-semibold text-indigo-600 text-lg'>
              {typeof maxMessageCount === 'number'
                ? maxMessageCount.toLocaleString()
                : '-'}
            </span>
          </div>
        </div>
      );
    }

    if (error) {
      return <div className='text-red-600 text-center'>{error}</div>;
    }

    return (
      <div className='text-gray-500 text-center'>
        {lineNumber && totalBudget > 0 ? calculatingText : enterBudgetText}
      </div>
    );
  };

  return (
    <Card>
      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900 flex items-center'>
          <MessageSquare className='h-5 w-5 mr-2 text-primary-600' />
          {title}
        </h3>

        <div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
          {renderContent()}
        </div>
      </div>
    </Card>
  );
};

export default MessageCountCard;
