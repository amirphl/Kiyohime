import { useState, useEffect } from 'react';

export const useLinkCharacter = (text: string) => {
    const [linkCharacterInserted, setLinkCharacterInserted] = useState<boolean>(false);

    // Check if link character is already in text
    useEffect(() => {
        if (text && text.includes('🔗')) {
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
        if (linkCharacterInserted || !textAreaRef.current) return;

        const textarea = textAreaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Insert the link character at cursor position
        const newText = currentText.substring(0, start) + '🔗' + currentText.substring(end);

        onTextChange(newText);
        setLinkCharacterInserted(true);

        // Set cursor position after the inserted character
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + 1, start + 1);
        }, 0);
    };

    const resetLinkCharacter = () => setLinkCharacterInserted(false);

    return {
        linkCharacterInserted,
        insertLinkCharacter,
        resetLinkCharacter,
    };
}; 