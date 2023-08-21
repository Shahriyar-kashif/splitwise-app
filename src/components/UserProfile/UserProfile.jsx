import { useNavigate } from "react-router";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useEffect, useState } from "react";
import { settleDebt } from "../../Utilities/expenseSettlementUtil";
import {
  fetchExpenseList,
  fetchUserData,
} from "../../Utilities/firebaseUtilities";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { authSelector } from "../../store/authSlice";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [settlementRecord, setSettlementRecord] = useState([]);
  console.log(auth.currentUser);
  const userOwes = settlementRecord.filter(
    (user) => user.payerName === `${userData.firstName} ${userData.lastName}`
  );
  const userOwesExactlyOne = userOwes.filter((user, i, arr) => {
    return (
      arr.filter((record) => record.expenseId === user.expenseId).length < 2
    );
  });
  console.log(userOwesExactlyOne);
  const userOwesMultipleInOneExpense = userOwes.filter((user, i, arr) => {
    return (
      arr.filter((record) => record.expenseId === user.expenseId).length > 1
    );
  });
  console.log(userOwesMultipleInOneExpense);
  const userIsOwed = settlementRecord.filter(
    (user) => user.payeeName === `${userData.firstName} ${userData.lastName}`
  );
  const navigate = useNavigate();
  const userAuth = useSelector(authSelector);
  useEffect(() => {
    if (!userAuth) return;
    fetchExpenseList(userAuth).then((listOfExpenses) => {
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
    });
    fetchUserData(userAuth).then((userData) => {
      setUserData(userData);
    });
  }, [userAuth]);

  const handleMultipleSettlement = async (expenseId) => {
    const recordsToBeSettled = settlementRecord.filter(
      (record) => record.expenseId === expenseId
    );
    console.log(recordsToBeSettled);
    const userId = recordsToBeSettled[0].payerId;
    const payerRef = doc(db, "users-db", userId);
    const payerSnap = await getDoc(payerRef);
    const updatedPayerExpense = payerSnap
      .data()
      .expenses.filter((id) => id !== expenseId);
    await updateDoc(payerRef, {
      expenses: updatedPayerExpense,
    });
    recordsToBeSettled.forEach(async (record) => {
      const payeeRef = doc(db, "users-db", record.payeeId);
      const payeeSnap = await getDoc(payeeRef);
      const updatedPayeeExpense = payeeSnap
        .data()
        .expenses.filter((id) => id !== expenseId);
      await updateDoc(payeeRef, {
        expenses: updatedPayeeExpense,
      });
    });
    const updatedRecord = settlementRecord.filter(
      (record) => record.expenseId !== expenseId
    );
    setSettlementRecord([...updatedRecord]);
  };

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
      setSettlementRecord([...updatedRecord]);
    }
    toast.success("Debt settled succesfully!");
  };

  return (
    <Box sx={{ mx: "5%", mt: 5 }}>
      <Typography align="center" component="h1" variant="h5" sx={{ mb: 10 }}>
        Welcome, {auth.currentUser?.displayName}
      </Typography>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "60%",
          mx: "auto",
        }}
      >
        <List
          sx={{ width: "100%", maxWidth: 500, bgcolor: "background.paper" }}
        >
          <Typography
            align="center"
            color="text.secondary"
            component="h2"
            variant="h6"
          >
            Your outstanding debts
          </Typography>
          {userOwesExactlyOne.map((user) => {
            return (
              <ListItem
                secondaryAction={
                  <Button
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
          {userOwesMultipleInOneExpense &&
            userOwesMultipleInOneExpense.map((user, i, arr) => {
              return (
                <ListItem>
                  <ListItemText
                    primary={`You owe ${user.debt} ${user?.currency} to ${user.payeeName}`}
                    sx={{ display: "inline" }}
                  />
                  {((arr.length - 1 === i) || (user.expenseId !== arr[i+1].expenseId )) && (
                    <Button
                      onClick={() => {
                        handleMultipleSettlement(user.expenseId);
                      }}
                    >
                      Settle
                    </Button>
                  )}
                </ListItem>
              );
            })}
        </List>
        <Divider orientation="vertical" flexItem />
        <List
          sx={{ width: "100%", maxWidth: 500, bgcolor: "background.paper" }}
        >
          <Typography
            align="center"
            color="text.secondary"
            component="h2"
            variant="h6"
          >
            Debts owed to you
          </Typography>
          {userIsOwed.map((user) => {
            return (
              <ListItem alignItems="center">
                <ListItemText
                  align="center"
                  primary={`${user.payerName} owes you ${user.debt} ${user?.currency}`}
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}
