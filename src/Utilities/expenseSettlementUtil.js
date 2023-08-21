export const settleDebt = (
  payees,
  payers,
  transaction,
  currency = null,
  id = null
) => {
  const payeesCopy = JSON.parse(JSON.stringify(payees));
  const payersCopy = JSON.parse(JSON.stringify(payers));
  if (payeesCopy.length === 0 || payersCopy.length === 0) {
    return;
  }
  const maxDebtInd = getMaxDebtInd(payersCopy);
  const maxCreditInd = getMaxCreditInd(payeesCopy);
  const debt =
    payersCopy[maxDebtInd].bill - payersCopy[maxDebtInd].contribution;
  const credit =
    payeesCopy[maxCreditInd].contribution - payeesCopy[maxCreditInd].bill;
  if (debt === 0) {
    payersCopy.splice(maxDebtInd, 1);
    settleDebt(payeesCopy, payersCopy, transaction, currency, id);
  } else if (credit === 0) {
    payeesCopy.splice(maxCreditInd, 1);
    settleDebt(payeesCopy, payersCopy, transaction, currency, id);
  }
  if (debt === credit) {
    const newTransaction = {
      currency: currency,
      expenseId: id,
      payerId: payersCopy[maxDebtInd].id,
      payerName: payersCopy[maxDebtInd]?.name,
      payeeName: payeesCopy[maxCreditInd]?.name,
      debt: debt,
      payeeId: payeesCopy[maxCreditInd].id,
    };
    transaction.push(newTransaction);
    payeesCopy.splice(maxCreditInd, 1);
    payersCopy.splice(maxDebtInd, 1);

    settleDebt(payeesCopy, payersCopy, transaction, currency, id);
  }

  if (debt < credit) {
    payeesCopy[maxCreditInd].contribution -= debt;
    const newTransaction = {
      currency: currency,
      expenseId: id,
      payerId: payersCopy[maxDebtInd].id,
      payerName: payersCopy[maxDebtInd]?.name,
      payeeName: payeesCopy[maxCreditInd]?.name,
      debt: debt,
      payeeId: payeesCopy[maxCreditInd].id,
    };
    transaction.push(newTransaction);
    payersCopy.splice(maxDebtInd, 1);
    settleDebt(payeesCopy, payersCopy, transaction, currency, id);
  }

  if (debt > credit) {
    payersCopy[maxDebtInd].contribution += credit;
    const newTransaction = {
      currency: currency,
      expenseId: id,
      payerId: payersCopy[maxDebtInd].id,
      payerName: payersCopy[maxDebtInd]?.name,
      payeeName: payeesCopy[maxCreditInd]?.name,
      debt: credit,
      payeeId: payeesCopy[maxCreditInd].id,
    };
    transaction.push(newTransaction);
    payeesCopy.splice(maxCreditInd, 1);
    settleDebt(payeesCopy, payersCopy, transaction, currency, id);
  }
};
const getMaxCreditInd = (arr) => {
  const netAmount = arr.map((user) => user.contribution - user.bill);
  const maxAmount = Math.max(...netAmount);
  const maxIndx = arr.findIndex(
    (user) => user.contribution - user.bill === maxAmount
  );
  return maxIndx;
};

const getMaxDebtInd = (arr) => {
  const netAmount = arr.map((user) => user.bill - user.contribution);
  const maxAmount = Math.max(...netAmount);
  const maxIndx = arr.findIndex(
    (user) => user.bill - user.contribution === maxAmount
  );
  return maxIndx;
};
