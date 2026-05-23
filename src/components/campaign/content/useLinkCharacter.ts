import { useState, useEffect } from 'react';
import {
  LINK_PLACEHOLDER,
  hasLinkPlaceholder,
  normalizeLinkPlaceholder,
} from '../../../utils/campaignUtils';

export const useLinkCharacter = (text: string) => {
  const [linkCharacterInserted, setLinkCharacterInserted] =
    useState<boolean>(false);

  // Check if link placeholder is already in text
  useEffect(() => {
    if (text && hasLinkPlaceholder(text)) {
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

    const safeText = normalizeLinkPlaceholder(currentText || '');
    if (linkCharacterInserted || hasLinkPlaceholder(safeText)) {
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
      LINK_PLACEHOLDER +
      lineBreak +
      safeText.substring(end);

    onTextChange(newText);
    setLinkCharacterInserted(true);

    // Set cursor position on the new line after the inserted placeholder.
    setTimeout(() => {
      textarea.focus();
      const nextCursorPosition =
        start + LINK_PLACEHOLDER.length + lineBreak.length;
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
