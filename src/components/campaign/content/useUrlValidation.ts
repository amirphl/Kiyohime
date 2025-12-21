import { useState, useEffect } from 'react';

export const useUrlValidation = (url: string, insertLink: boolean, errorMessage: string) => {
    const [linkError, setLinkError] = useState<string>('');

    const validateUrl = (urlToValidate: string) => {
        // empty is considered valid (handled elsewhere if required)
        if (!urlToValidate.trim()) return true;

        // Reject strings containing control characters (such as backspace \u0008)
        // or other non-printable ASCII control codes
        const controlCharRegex = /[\x00-\x1F\x7F]/;
        if (controlCharRegex.test(urlToValidate)) return false;

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