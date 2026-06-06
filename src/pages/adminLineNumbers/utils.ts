import {
  AdminCreateLineNumberRequest,
  AdminLineNumberDTO,
} from '../../types/admin';
import { AdminLineNumberFormValues, AdminLineNumberReorderItem } from './types';
import { AdminLineNumbersCopy } from './translations';

export const createInitialLineNumberForm = (): AdminLineNumberFormValues => ({
  name: '',
  lineNumber: '',
  priceFactor: '1',
  priority: '',
  isActive: true,
});

export const sortLineNumbersByPriority = (
  items: AdminLineNumberDTO[]
): AdminLineNumberDTO[] =>
  [...items].sort((left, right) => {
    const leftPriority =
      left.priority == null ? Number.MAX_SAFE_INTEGER : left.priority;
    const rightPriority =
      right.priority == null ? Number.MAX_SAFE_INTEGER : right.priority;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return left.line_number.localeCompare(right.line_number);
  });

export const moveItem = <T>(items: T[], fromIndex: number, toIndex: number) => {
  if (fromIndex === toIndex) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
};

export const buildCreatePayload = (
  values: AdminLineNumberFormValues
): AdminCreateLineNumberRequest => {
  const normalizedName = values.name.trim();
  const normalizedPriority = values.priority.trim();

  return {
    name: normalizedName ? normalizedName : undefined,
    line_number: values.lineNumber.trim(),
    price_factor: Number(values.priceFactor),
    priority: normalizedPriority ? Number(normalizedPriority) : undefined,
    is_active: values.isActive,
  };
};

export const buildReorderPayload = (
  items: AdminLineNumberDTO[]
): AdminLineNumberReorderItem[] =>
  items.map((item, index) => ({
    id: item.id,
    priority: index + 1,
  }));

export const validateCreatePayload = (
  values: AdminLineNumberFormValues,
  copy: AdminLineNumbersCopy
): string | null => {
  const normalizedLineNumber = values.lineNumber.trim();
  const normalizedName = values.name.trim();
  const normalizedPriceFactor = values.priceFactor.trim();
  const normalizedPriority = values.priority.trim();

  if (!normalizedLineNumber) {
    return copy.validation.lineNumberRequired;
  }

  if (normalizedLineNumber.length < 3 || normalizedLineNumber.length > 50) {
    return copy.validation.lineNumberLength;
  }

  if (!normalizedPriceFactor) {
    return copy.validation.priceFactorRequired;
  }

  const priceFactor = Number(normalizedPriceFactor);
  if (!Number.isFinite(priceFactor) || priceFactor <= 0) {
    return copy.validation.priceFactorInvalid;
  }

  if (normalizedPriority) {
    const priority = Number(normalizedPriority);
    if (
      !Number.isInteger(priority) ||
      !Number.isFinite(priority) ||
      priority < 0
    ) {
      return copy.validation.priorityInvalid;
    }
  }

  if (normalizedName.length > 255) {
    return copy.validation.nameTooLong;
  }

  return null;
};

export const mapCreateError = (
  code: string | undefined,
  fallback: string,
  copy: AdminLineNumbersCopy
) => {
  switch (code) {
    case 'MISSING_ACCESS_TOKEN':
      return copy.errors.missingAccessToken;
    case 'INVALID_REQUEST':
      return copy.errors.invalidRequest;
    case 'LINE_NUMBER_VALUE_REQUIRED':
      return copy.errors.lineNumberValueRequired;
    case 'LINE_NUMBER_INVALID_LENGTH':
      return copy.errors.lineNumberLengthInvalid;
    case 'PRICE_FACTOR_INVALID':
      return copy.errors.priceFactorBackendInvalid;
    case 'PRIORITY_INVALID':
      return copy.errors.priorityBackendInvalid;
    case 'LINE_NUMBER_ALREADY_EXISTS':
      return copy.errors.lineNumberAlreadyExists;
    case 'VALIDATION_ERROR':
      return copy.errors.validationFailed;
    case 'UNAUTHORIZED':
      return copy.errors.unauthorized;
    case 'FORBIDDEN':
      return copy.errors.unauthorized;
    case 'TIMEOUT_ERROR':
    case 'NETWORK_ERROR':
      return copy.errors.network;
    case 'INVALID_RESPONSE':
      return copy.errors.unknown;
    default:
      return code ? fallback : copy.errors.unknown;
  }
};

export const mapRequestError = (
  code: string | undefined,
  fallback: string,
  copy: AdminLineNumbersCopy
) => {
  switch (code) {
    case 'MISSING_ACCESS_TOKEN':
      return copy.errors.missingAccessToken;
    case 'INVALID_REQUEST':
      return copy.errors.invalidRequest;
    case 'VALIDATION_ERROR':
      return copy.errors.validationFailed;
    case 'UNAUTHORIZED':
      return copy.errors.unauthorized;
    case 'FORBIDDEN':
      return copy.errors.unauthorized;
    case 'TIMEOUT_ERROR':
    case 'NETWORK_ERROR':
      return copy.errors.network;
    case 'INVALID_RESPONSE':
      return copy.errors.unknown;
    default:
      return code ? fallback : copy.errors.unknown;
  }
};

export const formatBooleanLabel = (
  value: boolean | null | undefined,
  copy: AdminLineNumbersCopy
) => (value ? copy.common.yes : copy.common.no);

export const getDisplayValue = (
  value: string | number | null | undefined,
  emptyValue: string
) => (value == null || value === '' ? emptyValue : String(value));
