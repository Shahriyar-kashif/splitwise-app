import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { ref, uploadBytes } from "@firebase/storage";
import { v4 } from "uuid";

export const fetchExpenseList = async (user) => {
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
    return listOfExpenses;
  } else {
    return [];
  }
};

export const fetchUserData = async (user) => {
  if (!user) return;
  const userId = user?.id;
  const userRef = doc(db, "users-db", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const userData = userSnap.data();
    return userData;
  } else {
    return null;
  }
};

export const fetchUsers = async (userAuth) => {
  const usersSnapshot = await getDocs(collection(db, "users-db"));
  const users = [];
  const userData = await fetchUserData(userAuth);
  usersSnapshot.forEach((doc) => users.push(doc.data()));
  const updatedUsers = users.filter((user) => user.email !== userData.email);
  return updatedUsers;
};

export const uploadImageToDB = (uploadedImage) => {
  const imagePath = uploadedImage
    ? `images/${uploadedImage.name + v4()}`
    : null;
  const imageRef = imagePath && ref(storage, `${imagePath}`);
  if (imageRef) {
    uploadBytes(imageRef, uploadedImage);
  }
  return imagePath;
};
