import { useState, useEffect, useCallback } from 'react';

export const useUrlValidation = (url: string, insertLink: boolean, errorMessage: string) => {
    const [linkError, setLinkError] = useState<string>('');
    const hasControlChars = useCallback((value: string) => {
        for (let i = 0; i < value.length; i += 1) {
            const code = value.charCodeAt(i);
            if ((code >= 0 && code <= 8) || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127) {
                return true;
            }
        }
        return false;
    }, []);

    const validateUrl = useCallback((urlToValidate: string) => {
        // empty is considered valid (handled elsewhere if required)
        if (!urlToValidate.trim()) return true;

        // Reject strings containing control characters (such as backspace \u0008)
        // or other non-printable ASCII control codes
        if (hasControlChars(urlToValidate)) return false;

        try {
            const urlObj = new URL(urlToValidate);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    }, [hasControlChars]);

    // Validate link when loaded from localStorage
    useEffect(() => {
        if (url && insertLink) {
            setLinkError('');
            if (!validateUrl(url)) {
                setLinkError(errorMessage);
            }
        }
    }, [url, insertLink, errorMessage, validateUrl]);

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
