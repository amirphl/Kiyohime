import { useState, useEffect } from 'react';

export const useLinkCharacter = (text: string) => {
    const [linkCharacterInserted, setLinkCharacterInserted] = useState<boolean>(false);
    const linkMarker = '🔗';
    const displayPlaceholder = 'jo1n.ir/xxxxxx';

    // Check if link character is already in text
    useEffect(() => {
        if (text && (text.includes(linkMarker) || text.includes(displayPlaceholder))) {
            setLinkCharacterInserted(true);
        } else {
            setLinkCharacterInserted(false);
        }
    }, [text]);

    const insertLinkCharacter = (
        textAreaRef: React.RefObject<HTMLTextAreaElement>,
        currentText: string,
        onTextChange: (text: string) => void
    ) => {
        if (!textAreaRef.current) return;

        // Normalize any displayed placeholder back to marker before processing
        const normalizedText = (currentText || '').replace(new RegExp(displayPlaceholder, 'g'), linkMarker);

        if (linkCharacterInserted || normalizedText.includes(linkMarker)) {
            return;
        }

        const textarea = textAreaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Insert the link marker at cursor position (store actual marker for backend)
        const newText = normalizedText.substring(0, start) + linkMarker + normalizedText.substring(end);

        onTextChange(newText);
        setLinkCharacterInserted(true);

        // Set cursor position after the inserted character
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + linkMarker.length, start + linkMarker.length);
        }, 0);
    };

    const resetLinkCharacter = () => setLinkCharacterInserted(false);

    return {
        linkCharacterInserted,
        insertLinkCharacter,
        resetLinkCharacter,
    };
}; 
