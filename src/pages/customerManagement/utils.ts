import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

export const formatDatetime = (iso: string, language: string) => {
  try {
    const jsDate = new Date(iso);
    if (language === 'fa') {
      const tehranMs = jsDate.getTime() + 3.5 * 60 * 60 * 1000;
      const tehranDate = new Date(tehranMs);
      const dobj = new DateObject({
        date: tehranDate,
        calendar: persian,
        locale: persian_fa,
      });
      return dobj.format('YYYY/MM/DD HH:mm:ss');
    }
    return jsDate.toLocaleString(undefined, { hour12: false });
  } catch {
    return iso;
  }
};
