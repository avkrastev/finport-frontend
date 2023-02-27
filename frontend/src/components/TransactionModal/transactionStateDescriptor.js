import { copy } from 'src/utils/functions';

const defaultCurrency =
  JSON.parse(localStorage.getItem('userData'))?.userData?.currency || 'USD';

export const stateDescriptor = {
  id: { value: null, isValid: true, isTouched: false },
  category: { value: '', isValid: false, isTouched: false },
  name: { value: '', isValid: false, isTouched: false },
  asset_id: { value: '', isValid: true, isTouched: false },
  symbol: { value: '', isValid: true, isTouched: false },
  currency: { value: defaultCurrency, isValid: true, isTouched: false },
  price: { value: 0, isValid: true, isTouched: false },
  price_per_asset: { value: '', isValid: false, isTouched: false },
  quantity: { value: 1, isValid: true, isTouched: false },
  date: { value: new Date(), isValid: true, isTouched: false },
  type: { value: 0, isValid: true, isTouched: false },
  transfer: { value: 2, isValid: true, isTouched: false }
};

export const commoditiesStateDescriptor = {
  id: { value: null, isValid: true, isTouched: false },
  category: { value: '', isValid: false, isTouched: false },
  name: { value: '', isValid: false, isTouched: false },
  asset_id: { value: '', isValid: true, isTouched: false },
  symbol: { value: '', isValid: true },
  currency: { value: defaultCurrency, isValid: true, isTouched: false },
  price: { value: 0, isValid: true, isTouched: false },
  price_per_asset: { value: '', isValid: false, isTouched: false },
  quantity: { value: 1, isValid: true, isTouched: false },
  weight: { value: 'toz', isValid: true, isTouched: false },
  date: { value: new Date(), isValid: true, isTouched: false },
  type: { value: 0, isValid: true, isTouched: false },
  transfer: { value: 2, isValid: true, isTouched: false }
};

export const transactionStateDescriptor = () => copy(stateDescriptor);
export const transactionCommodityStateDescriptor = () =>
  copy(commoditiesStateDescriptor);
