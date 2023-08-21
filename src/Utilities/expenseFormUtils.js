import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../firebase/firebase";
import { toast } from "react-toastify";

export const submitExpenseToDB = async (
  userAuth,
  participants,
  expense,
  setDisableFormButton
) => {
  try {
    const expenseRef = collection(db, "expense");
    const expenseDocRef = await addDoc(expenseRef, expense);
    // get reference to current user's doc in db
    const userDocRef = doc(db, "users-db", userAuth.id);
    await updateDoc(expenseDocRef, {
      id: expenseDocRef.id,
    });
    // add current expense doc's id to the user's doc in an array
    await updateDoc(userDocRef, {
      expenses: arrayUnion(expenseDocRef.id),
    });
    // do the above for all participants in the expense as well
    participants.forEach(async (participant) => {
      await updateDoc(doc(db, "users-db", participant.id), {
        expenses: arrayUnion(expenseDocRef.id),
      });
    });
    toast.success("Expense added successfully!");
  } catch (error) {
    // console.log(error);
  } finally {
    setDisableFormButton(false);
  }
};

export const isExpenseAlreadySettled = (participants) => {
  return participants.every(
    (participant) => participant.bill === participant.contribution
  );
};
