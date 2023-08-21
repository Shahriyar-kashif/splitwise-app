import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { db } from "../firebase/firebase";

export const filterOutAlreadySettledExpenses = (
  alreadySettled,
  updatedRecord,
  userData
) => {
  alreadySettled.forEach((settledRecord) => {
    const settledRecordInd = updatedRecord.findIndex(
      (record) =>
        record.payerId === settledRecord.payerId &&
        record.payeeId === settledRecord.payeeId &&
        record.expenseId === settledRecord.expenseId
    );
    updatedRecord.splice(settledRecordInd, 1);
  });
  const userOwes = updatedRecord.filter(
    (user) => user.payerName === `${userData.firstName} ${userData.lastName}`
  );

  const userIsOwed = updatedRecord.filter(
    (user) => user.payeeName === `${userData.firstName} ${userData.lastName}`
  );
  return [userOwes, userIsOwed];
};

export const clearPayerExpense = async (
  settledRecordsForThisExpense,
  settlementsOfThisExpense,
  alreadySettled,
  expenseId,
  userId
) => {
  if (
    settledRecordsForThisExpense.length ===
    settlementsOfThisExpense.length - 1
  ) {
    const updatedRecords = alreadySettled.filter(
      (record) => record.expenseId !== expenseId
    );
    const payerDocRef = doc(db, "users-db", userId);
    await updateDoc(payerDocRef, {
      settlements: [...updatedRecords],
    });
    const payerSnap = await getDoc(payerDocRef);
    const updatedPayerExpense = payerSnap
      .data()
      .expenses.filter((id) => id !== expenseId);
    await updateDoc(payerDocRef, {
      expenses: updatedPayerExpense,
    });
  }
};

export const clearPayeeExpense = async (
  payeeDocRef,
  settlementsOfPayeeExpense,
  expenseId
) => {
  const payeeSnap = await getDoc(payeeDocRef);
  const payeeSettlements = payeeSnap.data().settlements || [];

  const settledRecordsForPayee = payeeSettlements.filter(
    (settlement) => settlement.expenseId === expenseId
  );
  if (settledRecordsForPayee.length === settlementsOfPayeeExpense.length) {
    const updatedRecords = payeeSettlements.filter(
      (record) => record.expenseId !== expenseId
    );
    await updateDoc(payeeDocRef, {
      settlements: [...updatedRecords],
    });
    const updatedPayeeExpense = payeeSnap
      .data()
      .expenses.filter((id) => id !== expenseId);
    await updateDoc(payeeDocRef, {
      expenses: updatedPayeeExpense,
    });
  }
};
