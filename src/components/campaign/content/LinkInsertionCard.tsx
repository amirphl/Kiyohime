import React from 'react';
import { Link } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import FormField from '../../ui/FormField';

interface LinkInsertionCardProps {
    insertLink: boolean;
    link: string;
    linkError: string;
    onInsertLinkToggle: () => void;
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
    onInsertLinkToggle,
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

    return (
        <Card className="h-full">
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Link className="h-5 w-5 mr-2 text-primary-600" />
                    {title}
                </h3>
                <div className="flex items-center space-x-3">
                    <Button
                        variant={insertLink ? 'primary' : 'outline'}
                        onClick={onInsertLinkToggle}
                        size="sm"
                    >
                        {insertLink ? onLabel : offLabel}
                    </Button>
                    <span className="text-sm text-gray-600">
                        {insertLink ? enabledLabel : disabledLabel}
                    </span>
                </div>

                {insertLink && (
                    <>
                        <FormField
                            id="link"
                            label={linkLabel}
                            type="text"
                            placeholder={linkPlaceholder}
                            value={link || ''}
                            onChange={onLinkChange}
                            required
                            validation={{
                                max: 10000,
                                message: linkValidation
                            }}
                        />
                        {linkError && (
                            <p className="text-sm text-red-600">{linkError}</p>
                        )}
                        <div className={`text-sm ${isLinkOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
                            {linkCharacterCount} / {maxLinkCharacters} {charactersLabel}
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
};

export default LinkInsertionCard;