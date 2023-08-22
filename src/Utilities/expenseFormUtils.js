import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../firebase/firebase";
import { toast } from "react-toastify";
import { EXPENSES_COLLECTION, USERS_COLLECTION } from "../constants/constants";

export const submitExpenseToDB = async (
  userAuth,
  participants,
  expense,
  setDisableFormButton
) => {
  try {
    const expenseRef = collection(db, EXPENSES_COLLECTION);
    const expenseDocRef = await addDoc(expenseRef, expense);
    // get reference to current user's doc in db
    const userDocRef = doc(db, USERS_COLLECTION, userAuth.id);
    await updateDoc(expenseDocRef, {
      id: expenseDocRef.id,
    });
    // add current expense doc's id to the user's doc in an array
    await updateDoc(userDocRef, {
      expenses: arrayUnion(expenseDocRef.id),
    });
    // do the above for all participants in the expense as well
    participants.forEach(async (participant) => {
      await updateDoc(doc(db, USERS_COLLECTION, participant.id), {
        expenses: arrayUnion(expenseDocRef.id),
      });
    });
    toast.success("Expense added successfully!");
  } catch (error) {
    toast.error("Error: Failed to add expense");
  } finally {
    setDisableFormButton(false);
  }
};

export const isExpenseAlreadySettled = (participants) => {
  return participants.every(
    (participant) => participant.bill === participant.contribution
  );
};
