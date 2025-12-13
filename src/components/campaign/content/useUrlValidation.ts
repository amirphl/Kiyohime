import { useState, useEffect } from 'react';

export const useUrlValidation = (url: string, insertLink: boolean, errorMessage: string) => {
    const [linkError, setLinkError] = useState<string>('');

    const validateUrl = (urlToValidate: string) => {
        if (!urlToValidate.trim()) return true;

        try {
            const urlObj = new URL(urlToValidate);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    };

    // Validate link when loaded from localStorage
    useEffect(() => {
        if (url && insertLink) {
            setLinkError('');
            if (!validateUrl(url)) {
                setLinkError(errorMessage);
            }
        }
    }, [url, insertLink, errorMessage]);

    const handleLinkChange = (value: string, onChange: (value: string) => void) => {
        setLinkError('');
        if (value.trim() && !validateUrl(value)) {
            setLinkError(errorMessage);
        }
        onChange(value);
    };

    const clearError = () => setLinkError('');

    return {
        linkError,
        validateUrl,
        handleLinkChange,
        clearError,
    };
}; 