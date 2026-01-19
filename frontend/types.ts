
export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  joinedDate: number; // timestamp
}

export type ShippingMethod = 'AIR' | 'SEA' | 'LAND';
export type Incoterm = 'EXW' | 'FOB' | 'CFR' | 'CIF' | 'DDP' | 'DAP';

export interface TradeCalculation {
  id: string;
  userId: string;
  timestamp: number;
  productName: string;
  hsCode: string;
  quantity: number;
  unitPrice: number;
  originCountry: string;
  destinationCountry: string;
  incoterm: Incoterm;
  shippingMethod: ShippingMethod;
  insuranceRate: number; // percentage
  
  // Results
  fobValue: number;
  freightCost: number;
  insuranceCost: number;
  customsDuty: number;
  importTax: number;
  vatAmount: number;
  handlingCharges: number;
  totalLandedCost: number;
  costPerUnit: number;
  expectedProfitMargin: number; // percentage
}

export interface CountryRule {
  countryCode: string;
  countryName: string;
  defaultDutyRate: number;
  defaultTaxRate: number;
  vatRate: number;
  currency: string;
  currencySymbol: string;
}

export interface HSCodeRule {
  code: string;
  category: string;
  dutyMultiplier: number;
}
