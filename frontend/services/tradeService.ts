import api from './api';
import { TradeCalculation } from '../types';

export const saveCalculation = (data: TradeCalculation) => {
  return api.post('/calculations', data);
};

export const getCalculations = () => {
  return api.get('/calculations');
};
