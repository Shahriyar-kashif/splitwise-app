import { useSelector } from "react-redux";
import {
  UNSAFE_useRouteId,
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router";
import { authSelector } from "../../store/authSlice";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { arrayUnion, doc, getDoc, updateDoc } from "@firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useEffect, useState } from "react";
import { settleDebt } from "../../Utilities/ExpenseSettlementUtil";
export default function UserProfile() {
  const [userData, listOfExpenses] = useLoaderData();
  const [settlementRecord, setSettlementRecord] = useState([]);
  const userOwes = settlementRecord.filter(
    (user) => user.payerName === `${userData.firstName} ${userData.lastName}`
  );
  const userIsOwed = settlementRecord.filter(
    (user) => user.payeeName === `${userData.firstName} ${userData.lastName}`
  );
  const navigate = useNavigate();
  const path = useParams();

  useEffect(() => {
    if (!userData) {
      onAuthStateChanged(auth, (user) => {
        navigate(`/user/${user.uid}`);
      });
    }
    listOfExpenses.forEach((expense) => {
      const transaction = [];
      const payers = expense.participants.filter(
        (user) => user.bill > user.contribution
      );
      const payees = expense.participants.filter(
        (user) => user.bill < user.contribution
      );
      settleDebt(payees, payers, transaction, expense.currency, expense.id);
      setSettlementRecord((prevState) => [...prevState, ...transaction]);
    });
  }, []);
  const settleExpense = async (expenseId, userId, payeeId) => {
    const debtsPerExpense = settlementRecord.filter(
      (record) => record.expenseId === expenseId && record.payerId === userId
    );
    if (debtsPerExpense.length > 1) {
      const recordToBeSettled = settlementRecord.findIndex(
        (record) =>
          record.expenseId === expenseId &&
          record.payerId === userId &&
          record.payeeId === payeeId
      );
      const updatedRecord = settlementRecord.slice();
      updatedRecord.splice(recordToBeSettled, 1);
      setSettlementRecord([...updatedRecord]);
    } else {
      const recordToBeSettled = settlementRecord.findIndex(
        (record) =>
          record.expenseId === expenseId &&
          record.payerId === userId &&
          record.payeeId === payeeId
      );
      const updatedRecord = settlementRecord.slice();
      updatedRecord.splice(recordToBeSettled, 1);
      setSettlementRecord([...updatedRecord]);
      const payerRef = doc(db, "users-db", userId);
      const payeeRef = doc(db, "users-db", payeeId);
      const payerSnap = await getDoc(payerRef);
      const payeeSnap = await getDoc(payeeRef);
      const updatedPayeeExpense = payeeSnap
        .data()
        .expenses.filter((id) => id !== expenseId);
      const updatedPayerExpense = payerSnap
        .data()
        .expenses.filter((id) => id !== expenseId);
      await updateDoc(payerRef, {
        expenses: updatedPayerExpense,
      });
      await updateDoc(payeeRef, {
        expenses: updatedPayeeExpense,
      });
    }
  };

  return (
    <Box sx={{ width: 2 / 4, ml: "5%", mt: 5 }}>
      {userData && (
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Welcome, {userData.firstName} {userData.lastName}
        </Typography>
      )}
      <Typography component="h2" variant="h5">
        Your outstanding debts
      </Typography>

      <List sx={{ width: "100%", maxWidth: 500, bgcolor: "background.paper" }}>
        {userOwes.map((user) => {
          return (
            <ListItem
              secondaryAction={
                <Button
                  variant="contained"
                  onClick={() =>
                    settleExpense(user.expenseId, user.payerId, user.payeeId)
                  }
                >
                  Settle
                </Button>
              }
            >
              <ListItemText
                primary={`You owe ${user.debt} ${user?.currency} to ${user.payeeName}`}
              />
            </ListItem>
          );
        })}
      </List>
      <Typography component="h2" variant="h5">
        Debts owed to you
      </Typography>
      <List sx={{ width: "100%", maxWidth: 500, bgcolor: "background.paper" }}>
        {userIsOwed.map((user) => {
          return (
            <ListItem>
              <ListItemText
                primary={`${user.payerName} owes you ${user.debt} ${user?.currency}`}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export async function loader({ params }) {
  const userId = params.userId;
  const userRef = doc(db, "users-db", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const userData = userSnap.data();
    const expenseIds = userData.expenses || [];
    const listOfPromises = expenseIds.map(async (expenseId) => {
      const expenseRef = doc(db, "expense", expenseId);
      const expenseSnap = await getDoc(expenseRef);
      if (expenseSnap.exists()) {
        const expenseData = expenseSnap.data();
        return expenseData;
      }
    });
    if (expenseIds.length === 0) return [userData, listOfPromises];
    const listOfExpenses = await Promise.all(listOfPromises);
    return [userData, listOfExpenses];
  } else {
    return [userSnap.data(), []];
  }
}
