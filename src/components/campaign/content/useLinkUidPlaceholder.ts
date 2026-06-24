import { useRef } from 'react';

export const UID_PLACEHOLDER = '{uid}';
export const ENCODED_UID_PLACEHOLDER = encodeURIComponent(UID_PLACEHOLDER);

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const hasUidPlaceholder = (link: string): boolean => {
  if (!link) return false;

  return (
    link.includes(UID_PLACEHOLDER) ||
    new RegExp(escapeRegExp(ENCODED_UID_PLACEHOLDER), 'i').test(link)
  );
};

export const replaceUidPlaceholder = (
  link: string,
  replacement: string
): string => {
  if (!link) return '';

  return link
    .split(UID_PLACEHOLDER)
    .join(replacement)
    .replace(
      new RegExp(escapeRegExp(ENCODED_UID_PLACEHOLDER), 'gi'),
      replacement
    );
};

export const useLinkUidPlaceholder = (link: string) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const savedCursor = useRef<number>((link || '').length);

  const hasPlaceholder = hasUidPlaceholder(link || '');

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
