import { copy } from 'src/utils/functions';

export const stateDescriptor = {
  id: { value: null, isValid: true },
  category: { value: '', isValid: false },
  name: { value: '', isValid: false },
  asset_id: { value: '', isValid: true },
  symbol: { value: '', isValid: true },
  currency: { value: 'USD', isValid: true },
  price: { value: 0, isValid: true },
  price_per_asset: { value: '', isValid: false },
  quantity: { value: 1, isValid: true },
  date: { value: new Date(), isValid: true },
  type: { value: 0, isValid: true },
  transfer: { value: 2, isValid: true }
};

export const transactionStateDescriptor = () => copy(stateDescriptor);
