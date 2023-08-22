import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { arrayUnion, doc, updateDoc } from "@firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import { settleDebt } from "../../Utilities/expenseSettlementUtil";
import {
  fetchExpenseList,
  fetchUserData,
} from "../../Utilities/firebaseUtilities";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { authSelector } from "../../store/authSlice";
import {
  clearPayeeExpense,
  clearPayerExpense,
  filterOutAlreadySettledExpenses,
} from "../../Utilities/userProfileUtils";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [settlementRecord, setSettlementRecord] = useState([]);
  const [alreadySettled, setAlreadySettled] = useState([]);
  const updatedRecord = settlementRecord.slice();
  const [userOwes, userIsOwed] = filterOutAlreadySettledExpenses(
    alreadySettled,
    updatedRecord,
    userData
  );
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
      const settlements = userData.settlements || [];
      setAlreadySettled([...settlements]);
    });
  }, [userAuth]);

  const settleExpense = async (expenseId, userId, payeeId) => {
    const recordToBeSettled = settlementRecord.find(
      (record) =>
        record.expenseId === expenseId &&
        record.payerId === userId &&
        record.payeeId === payeeId
    );

    const payerDocRef = doc(db, "users-db", userId);
    await updateDoc(payerDocRef, {
      settlements: arrayUnion(recordToBeSettled),
    });

    const payeeDocRef = doc(db, "users-db", payeeId);
    await updateDoc(payeeDocRef, {
      settlements: arrayUnion(recordToBeSettled),
    });
    setAlreadySettled([...alreadySettled, recordToBeSettled]);

    const settledRecordsForThisExpense = alreadySettled.filter(
      (record) => record.expenseId === expenseId
    );
    const settlementsOfThisExpense = settlementRecord.filter(
      (record) => record.expenseId === expenseId && record.payerId === userId
    );
    clearPayerExpense(
      settledRecordsForThisExpense,
      settlementsOfThisExpense,
      alreadySettled,
      expenseId,
      userId
    );
    const settlementsOfPayeeExpense = settlementRecord.filter(
      (record) => record.expenseId === expenseId && record.payeeId === payeeId
    );
    clearPayeeExpense(payeeDocRef, settlementsOfPayeeExpense, expenseId);
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
          {userOwes.length === 0 && (
            <Typography
              component="p"
              color="text.secondary"
              align="center"
              sx={{ p: 3 }}
            >
              You have no outstanding debts.
            </Typography>
          )}
          {userOwes.map((user) => {
            return (
              <ListItem
                key={user.payerId + user.payeeId + user.expenseId}
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
          {userIsOwed.length === 0 && (
            <Typography
              component="p"
              color="text.secondary"
              align="center"
              sx={{ p: 3 }}
            >
              No one owes you money at the moment.
            </Typography>
          )}
          {userIsOwed.map((user) => {
            return (
              <ListItem
                alignItems="center"
                key={user.payerId + user.payeeId + user.expenseId}
              >
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
