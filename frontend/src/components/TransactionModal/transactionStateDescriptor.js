import { copy } from 'src/utils/functions';

export const stateDescriptor = {
  id: { value: '', isValid: true },
  category: { value: '', isValid: false },
  name: { value: '', isValid: false },
  asset_id: { value: '', isValid: true },
  symbol: { value: '', isValid: true },
  currency: { value: 'USD', isValid: true },
  price: { value: '', isValid: false },
  quantity: { value: '', isValid: false },
  date: { value: new Date(), isValid: true },
  type: { value: 0, isValid: true },
  transfer: { value: 2, isValid: true }
};

export const transactionStateDescriptor = () => copy(stateDescriptor);
