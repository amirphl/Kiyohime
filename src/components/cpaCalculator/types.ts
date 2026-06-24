export type CpaFieldId =
  | 'delivered'
  | 'conversions'
  | 'conversionRate'
  | 'sendCost'
  | 'mainClicks'
  | 'clickRate'
  | 'suppDelivered'
  | 'suppConversions'
  | 'suppRate'
  | 'suppSendCost'
  | 'capacity'
  | 'offerPrice'
  | 'breakEven'
  | 'possibleConversions'
  | 'revenue'
  | 'totalCost'
  | 'profit'
  | 'profitPercent';

export type CpaFieldValues = Record<CpaFieldId, string>;

export type CpaFieldType = 'int' | 'percent' | 'money';

export interface CpaFieldDefinition {
  id: CpaFieldId;
  label: string;
  formula: string;
  type: CpaFieldType;
  emphasized?: 'success' | 'danger' | 'highlight';
}

export interface CpaCalculatorTranslations {
  openCalculator: string;
  title: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  mainSendSectionTitle: string;
  mainSendLabel: string;
  mainSendPlaceholder: string;
  mainSendFormula: string;
  supplementSendLabel: string;
  supplementSendPlaceholder: string;
  supplementSendFormula: string;
  primarySectionTitle: string;
  primaryFields: Record<
    'delivered' | 'conversions' | 'conversionRate' | 'sendCost',
    { label: string; formula: string }
  >;
  supplementToggleOn: string;
  supplementToggleOff: string;
  supplementSectionTitle: string;
  supplementFields: Record<
    | 'mainClicks'
    | 'clickRate'
    | 'suppDelivered'
    | 'suppConversions'
    | 'suppRate'
    | 'suppSendCost',
    { label: string; formula: string }
  >;
  pricingSectionTitle: string;
  pricingFields: Record<
    'capacity' | 'offerPrice' | 'breakEven',
    { label: string; formula: string }
  >;
  resultSectionTitle: string;
  resultFields: Record<
    | 'possibleConversions'
    | 'revenue'
    | 'totalCost'
    | 'profit'
    | 'profitPercent',
    { label: string; formula: string }
  >;
  reset: string;
  close: string;
  manualOption: string;
  unitPercent: string;
  unitToman: string;
}
