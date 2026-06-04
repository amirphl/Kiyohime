// Lightweight proforma renderer: builds styled HTML and opens in a new tab.
// The user can then print/save as PDF from the browser.

export interface ProformaData {
  invoice_number?: string;
  date?: string;
  service?: { description?: string };
  amount?: number;
  tax?: number;
  amount_with_tax?: number;
  notes?: string;
  buyer?: Record<string, any>;
  seller?: Record<string, any>;
  lang?: string;
}

const numberFmt = (n: any) =>
  n === undefined || n === null || Number.isNaN(Number(n))
    ? ''
    : Number(n).toLocaleString();

export const buildProformaHtml = (raw: ProformaData, language: string) => {
  const data = (raw as any)?.data ? (raw as any).data : raw;
  const isFa = (language || data?.lang || '').toLowerCase() === 'fa';
  const dir = isFa ? 'rtl' : 'ltr';
  const fontFamily = isFa
    ? "'Vazirmatn', 'IRANSans', 'Tahoma', sans-serif"
    : "'Inter', 'Helvetica', sans-serif";
  const displayDate = isFa ? toJalaliTehran(data?.date) : data?.date;

  const buyer = data?.buyer || {};
  const seller = data?.seller || {};

  return `<!doctype html>
<html lang="${isFa ? 'fa' : 'en'}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <title>Proforma ${data?.invoice_number || ''}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 24px; background: #f7f7f8; font-family: ${fontFamily}; }
    .page { max-width: 800px; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; }
    h1 { margin: 0 0 16px; font-size: 20px; }
    h2 { margin: 16px 0 8px; font-size: 16px; }
    .row { display: flex; gap: 16px; margin: 8px 0; }
    .col { flex: 1; }
    .box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
    .label { color: #6b7280; font-size: 12px; margin-bottom: 2px; }
    .value { font-size: 14px; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    th, td { padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: ${isFa ? 'right' : 'left'}; font-size: 14px; }
    .totals { margin-top: 12px; }
    .totals div { display: flex; justify-content: space-between; margin: 4px 0; }
    .muted { color: #6b7280; font-size: 12px; margin-top: 12px; }
    .notes { margin-top: 8px; font-size: 13px; line-height: 1.5; }
    @media print { body { background: #fff; } .page { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="page">
    <h1>${isFa ? 'پیش‌فاکتور' : 'Proforma Invoice'}</h1>
    <div class="row">
      <div class="col box">
        <div class="label">${isFa ? 'شماره' : 'Number'}</div>
        <div class="value">${data?.invoice_number || '-'}</div>
      </div>
      <div class="col box">
        <div class="label">${isFa ? 'تاریخ' : 'Date'}</div>
        <div class="value">${displayDate || '-'}</div>
      </div>
    </div>

    <div class="row">
      <div class="col box">
        <h2>${isFa ? 'فروشنده' : 'Seller'}</h2>
        <div class="label">${isFa ? 'نام' : 'Name'}</div>
        <div class="value">${seller.name || '-'}</div>
        <div class="label">${isFa ? 'کد اقتصادی' : 'Economic Code'}</div>
        <div class="value">${seller.economic_code || '-'}</div>
        <div class="label">${isFa ? 'شناسه ملی' : 'National ID'}</div>
        <div class="value">${seller.national_id || '-'}</div>
      </div>
      <div class="col box">
        <h2>${isFa ? 'خریدار' : 'Buyer'}</h2>
        <div class="label">${isFa ? 'نام' : 'Name'}</div>
        <div class="value">${buyer.name || buyer.company_name || '-'}</div>
        <div class="label">${isFa ? 'شناسه ملی' : 'National ID'}</div>
        <div class="value">${buyer.national_id || '-'}</div>
        <div class="label">${isFa ? 'موبایل' : 'Mobile'}</div>
        <div class="value">${buyer.mobile || buyer.company_phone || '-'}</div>
        <div class="label">${isFa ? 'تلفن شرکت' : 'Company Phone'}</div>
        <div class="value">${buyer.company_phone || '-'}</div>
        <div class="label">${isFa ? 'ایمیل' : 'Email'}</div>
        <div class="value">${buyer.email || '-'}</div>
        <div class="label">${isFa ? 'آدرس' : 'Address'}</div>
        <div class="value">${buyer.address || '-'}</div>
        <div class="label">${isFa ? 'کد پستی' : 'Postal Code'}</div>
        <div class="value">${buyer.postal_code || '-'}</div>
        <div class="label">${isFa ? 'نام شرکت' : 'Company Name'}</div>
        <div class="value">${buyer.company_name || '-'}</div>
      </div>
    </div>

    <div class="box">
      <h2>${isFa ? 'خدمت / شرح' : 'Service / Description'}</h2>
      <table>
        <thead>
          <tr>
            <th>${isFa ? 'شرح' : 'Description'}</th>
            <th>${isFa ? 'مبلغ' : 'Amount'}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${data?.service?.description || (isFa ? 'خدمت' : 'Service')}</td>
            <td>${numberFmt(data?.amount)}</td>
          </tr>
        </tbody>
      </table>

      <div class="totals">
        <div><span>${isFa ? 'مالیات' : 'Tax'}</span><strong>${numberFmt(data?.tax)}</strong></div>
        <div><span>${isFa ? 'جمع کل' : 'Total with Tax'}</span><strong>${numberFmt(data?.amount_with_tax)}</strong></div>
      </div>
    </div>

    <div class="box">
      <h2>${isFa ? 'اطلاعات بانکی' : 'Bank Details'}</h2>
      <div class="label">${isFa ? 'بانک' : 'Bank'}</div>
      <div class="value">${seller.bank_name || '-'}</div>
      <div class="label">${isFa ? 'شماره حساب' : 'Account Number'}</div>
      <div class="value">${seller.account_number || '-'}</div>
      <div class="label">${isFa ? 'کارت' : 'Card'}</div>
      <div class="value">${seller.card_number || '-'}</div>
      <div class="label">${isFa ? 'شبا' : 'IBAN'}</div>
      <div class="value">${seller.iban || seller.sheba || '-'}</div>
    </div>

    ${data.notes ? `<div class="notes">${data.notes}</div>` : ''}
    <div class="muted">${isFa ? 'این پیش‌فاکتور است؛ فاکتور نهایی پس از پرداخت و تأیید صادر می‌شود.' : 'This is a proforma invoice; the final invoice is issued after payment and approval.'}</div>
  </div>
  <script>
    window.onload = () => { setTimeout(() => window.print(), 300); };
  </script>
</body>
</html>`;
};

export const openProformaPreview = (data: ProformaData, language: string) => {
  const html = buildProformaHtml(data, language);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (!win) {
    // fallback: trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `proforma-${data.invoice_number || 'preview'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  } else {
    win.focus();
    win.onload = () => URL.revokeObjectURL(url);
  }
};

function toJalaliTehran(iso?: string) {
  try {
    if (!iso) return '';
    const date = new Date(iso);
    const fmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const faDate = fmt.format(date);
    return faDate.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
  } catch {
    return iso || '';
  }
}
