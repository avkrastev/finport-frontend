import { copy } from 'src/utils/functions';

const defaultCurrency =
  JSON.parse(localStorage.getItem('userData'))?.userData?.currency || 'USD';

export const stateDescriptor = {
  id: { value: null, isValid: true },
  category: { value: '', isValid: false },
  name: { value: '', isValid: false },
  asset_id: { value: '', isValid: true },
  symbol: { value: '', isValid: true },
  currency: { value: defaultCurrency, isValid: true },
  price: { value: 0, isValid: true },
  price_per_asset: { value: '', isValid: false },
  quantity: { value: 1, isValid: true },
  weight: { value: 'toz', isValid: true },
  date: { value: new Date(), isValid: true },
  type: { value: 0, isValid: true },
  transfer: { value: 2, isValid: true }
};

export const transactionStateDescriptor = () => copy(stateDescriptor);
