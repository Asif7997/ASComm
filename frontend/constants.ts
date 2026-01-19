
import { CountryRule, HSCodeRule, Incoterm, ShippingMethod } from './types';

export const INCOTERMS: Incoterm[] = ['EXW', 'FOB', 'CFR', 'CIF', 'DDP', 'DAP'];
export const SHIPPING_METHODS: ShippingMethod[] = ['AIR', 'SEA', 'LAND'];

export const INITIAL_COUNTRY_RULES: CountryRule[] = [
  { countryCode: 'USA', countryName: 'United States', defaultDutyRate: 2.5, defaultTaxRate: 0, vatRate: 0, currency: 'USD', currencySymbol: '$' },
  { countryCode: 'GBR', countryName: 'United Kingdom', defaultDutyRate: 4.5, defaultTaxRate: 2, vatRate: 20, currency: 'GBP', currencySymbol: '£' },
  { countryCode: 'CHN', countryName: 'China', defaultDutyRate: 15, defaultTaxRate: 13, vatRate: 13, currency: 'CNY', currencySymbol: '¥' },
  { countryCode: 'DEU', countryName: 'Germany', defaultDutyRate: 5, defaultTaxRate: 0, vatRate: 19, currency: 'EUR', currencySymbol: '€' },
  { countryCode: 'IND', countryName: 'India', defaultDutyRate: 10, defaultTaxRate: 12, vatRate: 18, currency: 'INR', currencySymbol: '₹' },
];

export const INITIAL_HS_CODES: HSCodeRule[] = [
  { code: '8517.12', category: 'Mobile Telephones', dutyMultiplier: 1.0 },
  { code: '8471.30', category: 'Laptops/Portable Computers', dutyMultiplier: 0.8 },
  { code: '6109.10', category: 'Cotton T-shirts', dutyMultiplier: 1.5 },
  { code: '3004.90', category: 'Medicaments', dutyMultiplier: 0.5 },
];

export const MOCK_ADMIN_STATS = {
  totalUsers: 1240,
  totalCalculations: 8542,
  activeNow: 42,
  monthlyRevenue: 12500,
};
