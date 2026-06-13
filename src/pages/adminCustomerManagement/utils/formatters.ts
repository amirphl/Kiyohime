export const formatNumber = (value?: number | null): string =>
  typeof value === 'number' ? value.toLocaleString() : '-';

export const toPct = (value?: number | null): string =>
  typeof value === 'number' ? `${(value * 100).toFixed(2)}%` : '-';

export const formatDateTime = (
  iso: string | null | undefined,
  language: string
): string => {
  if (!iso) return '-';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';

  if (language === 'fa') {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  }

  return date.toLocaleString();
};
