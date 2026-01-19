
import { TradeCalculation, CountryRule, HSCodeRule } from '../types';

export const calculateLandedCost = (
  input: Partial<TradeCalculation>,
  originRule: CountryRule,
  destRule: CountryRule,
  hsRule?: HSCodeRule
): TradeCalculation => {
  const {
    quantity = 0,
    unitPrice = 0,
    insuranceRate = 0.5, // default 0.5%
    shippingMethod = 'SEA'
  } = input;

  const fobValue = quantity * unitPrice;
  
  // Simplified freight logic based on method and quantity
  let freightMultiplier = 0.5;
  if (shippingMethod === 'AIR') freightMultiplier = 2.5;
  if (shippingMethod === 'LAND') freightMultiplier = 1.2;
  const freightCost = (fobValue * 0.05) * freightMultiplier; // mock 5% base freight

  const insuranceCost = fobValue * (insuranceRate / 100);
  
  // CIF = Cost, Insurance, and Freight
  const cifValue = fobValue + freightCost + insuranceCost;
  
  const hsMultiplier = hsRule ? hsRule.dutyMultiplier : 1.0;
  const customsDuty = cifValue * (destRule.defaultDutyRate / 100) * hsMultiplier;
  const importTax = cifValue * (destRule.defaultTaxRate / 100);
  
  // VAT is usually calculated on (CIF + Duty + Other taxes)
  const vatAmount = (cifValue + customsDuty + importTax) * (destRule.vatRate / 100);
  
  const handlingCharges = 150 + (quantity * 0.1); // Base port fee + per unit handling

  const totalLandedCost = cifValue + customsDuty + importTax + vatAmount + handlingCharges;
  const costPerUnit = quantity > 0 ? totalLandedCost / quantity : 0;

  return {
    ...input,
    id: input.id || Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
    fobValue,
    freightCost,
    insuranceCost,
    customsDuty,
    importTax,
    vatAmount,
    handlingCharges,
    totalLandedCost,
    costPerUnit,
    expectedProfitMargin: input.expectedProfitMargin || 20,
  } as TradeCalculation;
};
