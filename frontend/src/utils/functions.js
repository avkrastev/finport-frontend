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

export const roundNumber = (num, scale = 2) => {
  if (!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale) + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = "";
    if (+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(
      Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) +
      "e-" +
      scale
    );
  }
};