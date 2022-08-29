import { currencies } from 'src/constants/common';
import numeral from 'numeral';

export const formatAmountAndCurrency = (amount, curr, quantity = 0) => {
  const selectedCurrency = currencies.find(
    (currency) => currency.value === curr
  );

  let formattedAmount;
  if (quantity > 0) formattedAmount = numeral(amount * quantity).format(`0,0.00`);
  else formattedAmount = numeral(amount).format(`0,0.00`);

  if (selectedCurrency.left) {
    formattedAmount = selectedCurrency.label + ' ' + formattedAmount;
  } else {
    formattedAmount = formattedAmount + ' ' + selectedCurrency.label;
  }

  return formattedAmount;
};
