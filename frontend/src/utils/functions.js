import { currencies } from 'src/constants/common';
import numeral from 'numeral';
import { t } from 'i18next';

export const formatAmountAndCurrency = (
  amount,
  curr = 'USD',
  exchange = true
) => {
  const userData = JSON.parse(localStorage.getItem('userData')).userData;

  if (
    userData.hasOwnProperty('currency') &&
    userData.currency !== 'USD' &&
    exchange
  ) {
    const selectedCurrencyRate = userData.exchangeRates[userData.currency];
    amount = selectedCurrencyRate * amount;
    curr = userData.currency;
  }

  const selectedCurrency = currencies.find((currency) => currency.key === curr);

  let formattedAmount = numeral(amount).format(`0,0.00`);

  if (selectedCurrency.left) {
    formattedAmount = selectedCurrency.value + ' ' + formattedAmount;
  } else {
    formattedAmount = formattedAmount + ' ' + selectedCurrency.value;
  }

  return formattedAmount;
};

export const getUserSelectedCurrency = () => {
  const userData = JSON.parse(localStorage.getItem('userData')).userData;

  return userData.hasOwnProperty('currency') ? userData.currency : 'USD';
};

export const roundNumber = (num, scale = 2) => {
  if (!('' + num).includes('e')) {
    return +(Math.round(num + 'e+' + scale) + 'e-' + scale);
  } else {
    var arr = ('' + num).split('e');
    var sig = '';
    if (+arr[1] + scale > 0) {
      sig = '+';
    }
    return +(
      Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) +
      'e-' +
      scale
    );
  }
};

export const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let j = 0; j < 3; j++) {
    let value = (hash >> (j * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

export const padArrayStart = (arr, len, padding) => {
  return Array(len - arr.length)
    .fill(padding)
    .concat(arr);
};

export const copy = (obj) => {
  if (!(obj instanceof Object)) return null;
  return JSON.parse(JSON.stringify(obj));
};

export const getCryptoIcon = (symbol) => {
  let icon;
  try {
    icon = require(`../../node_modules/cryptocurrency-icons/svg/icon/${symbol}.svg`);
  } catch (e) {
    const generic = 'generic';
    icon = require(`../../node_modules/cryptocurrency-icons/svg/icon/${generic}.svg`);
  }

  return icon;
};

export const getSnackbarSuccessMessage = (operation) => {
  let message = '';
  switch (operation) {
    case 'add':
      message = 'Successfully added transaction!';
      break;
    case 'update':
      message = 'Successfully updated transaction!';
      break;
    case 'delete':
      message = 'Successfully deleted transaction(s)!';
      break;
    default:
      message = 'Successful operation!';
  }

  return t(message);
};

export function validateStateEntity({ stateEntity = {}, toSkip = [] } = {}) {
  let valid = true;
  let validStateEntity = { ...stateEntity };

  for (const [key, value] of Object.entries(stateEntity)) {
    if (toSkip.includes(key)) continue;
    if (!value.isValid) {
      valid = false;
      validStateEntity[key] = {
        ...value,
        isTouched: true
      };
    }
  }

  return {
    valid: valid,
    stateEntity: validStateEntity
  };
}
