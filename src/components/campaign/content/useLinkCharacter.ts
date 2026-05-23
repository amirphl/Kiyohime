import { useState, useEffect } from 'react';

export const useLinkCharacter = (text: string) => {
  const [linkCharacterInserted, setLinkCharacterInserted] =
    useState<boolean>(false);
  const linkPlaceholder = '{YOUR_LINK}';

  // Check if link placeholder is already in text
  useEffect(() => {
    if (text && text.includes(linkPlaceholder)) {
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

    const safeText = currentText || '';
    if (linkCharacterInserted || safeText.includes(linkPlaceholder)) {
      return;
    }

    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Insert the backend placeholder at cursor position, then place the caret
    // on the following line so users can keep typing message text naturally.
    const lineBreak = '\n';
    const newText =
      safeText.substring(0, start) +
      linkPlaceholder +
      lineBreak +
      safeText.substring(end);

    onTextChange(newText);
    setLinkCharacterInserted(true);

    // Set cursor position on the new line after the inserted placeholder.
    setTimeout(() => {
      textarea.focus();
      const nextCursorPosition =
        start + linkPlaceholder.length + lineBreak.length;
      textarea.setSelectionRange(nextCursorPosition, nextCursorPosition);
    }, 0);
  };

  const resetLinkCharacter = () => setLinkCharacterInserted(false);

  return {
    linkCharacterInserted,
    insertLinkCharacter,
    resetLinkCharacter,
  };
};
