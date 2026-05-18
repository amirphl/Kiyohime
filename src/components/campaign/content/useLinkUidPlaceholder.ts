import { useRef } from 'react';

export const UID_PLACEHOLDER = '{uid}';

export const useLinkUidPlaceholder = (link: string) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const savedCursor = useRef<number>((link || '').length);

  const hasPlaceholder = (link || '').includes(UID_PLACEHOLDER);

  const saveCursor = () => {
    if (inputRef.current) {
      savedCursor.current =
        inputRef.current.selectionStart ?? (link || '').length;
    }
  };

  const toggle = (onLinkChange: (val: string) => void) => {
    const current = link || '';
    if (hasPlaceholder) {
      onLinkChange(current.replace(UID_PLACEHOLDER, ''));
    } else {
      const pos = savedCursor.current ?? current.length;
      const newLink =
        current.slice(0, pos) + UID_PLACEHOLDER + current.slice(pos);
      onLinkChange(newLink);
      setTimeout(() => {
        inputRef.current?.focus();
        const newPos = pos + UID_PLACEHOLDER.length;
        inputRef.current?.setSelectionRange(newPos, newPos);
      }, 0);
    }
  };

  return { hasPlaceholder, inputRef, saveCursor, toggle };
};
