import { doc, getDoc } from "@firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchExpenseList = async (user) => {
    console.log("start1");
    if (!user) return;
    const docRef = doc(db, "users-db", user?.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const expenseIds = userData.expenses || [];
      const listOfPromises = expenseIds.map(async (expenseId) => {
        const expenseRef = doc(db, "expense", expenseId);
        const expenseSnap = await getDoc(expenseRef);
        if (expenseSnap.exists()) {
          const expenseData = expenseSnap.data();
          return expenseData;
        }
      });
      const listOfExpenses = await Promise.all(listOfPromises);
      console.log("end1");
      return listOfExpenses;
    } else {
      return [];
    }
  };

  export const fetchUserData = async (user) => {
    // const usersSnapshot = await getDocs(collection(db, "users-db"));
    // const users = [];
  //   usersSnapshot.forEach((doc) => users.push(doc.data()));
  //   return users;
    if (!user) return;
    const userId = user?.id;
    const userRef = doc(db, "users-db", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData
    } else {
      return null;
    }
  }
