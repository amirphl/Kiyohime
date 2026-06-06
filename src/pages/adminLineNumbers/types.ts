import {
  AdminCreateLineNumberRequest,
  AdminLineNumberDTO,
} from '../../types/admin';

export interface AdminLineNumberFormValues {
  name: string;
  lineNumber: string;
  priceFactor: string;
  priority: string;
  isActive: boolean;
}

export interface AdminLineNumberReorderItem {
  id: number;
  priority: number;
}

export type AdminLineNumberCreatePayload = AdminCreateLineNumberRequest;

export type AdminManagedLineNumber = AdminLineNumberDTO;
