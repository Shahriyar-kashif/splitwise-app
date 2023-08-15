import { doc, getDoc } from "@firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
} from "@mui/material";
import { db, storage } from "../../firebase/firebase";
import { useLoaderData } from "react-router";
import { useState } from "react";
import ExpenseReport from "../ExpenseReport/ExpenseReport";
import { getDownloadURL, ref } from "@firebase/storage";

export default function ExpensesTable() {
  const [report, setReport] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [expenseDetails, setExpenseDetails] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const expenseList = useLoaderData();


  const settleDebt = (payees, payers, transaction) => {
    const payeesCopy = JSON.parse(JSON.stringify(payees));
    const payersCopy = JSON.parse(JSON.stringify(payers));

    if (payeesCopy.length === 0 || payersCopy.length === 0) {
      setReport([...transaction]);
      return;
    }
    const maxDebtInd = getMaxDebtInd(payersCopy); //payers
    const maxCreditInd = getMaxCreditInd(payeesCopy); //payees
    // received max debt and max credit indices
    const debt =
      payersCopy[maxDebtInd].bill - payersCopy[maxDebtInd].contribution;
    const credit =
      payeesCopy[maxCreditInd].contribution - payeesCopy[maxCreditInd].bill;
    //received max net amounts among payers and payees
    // 15(credit) and 10(debt)
    if (debt === 0) {
      payersCopy.splice(maxDebtInd, 1);
      settleDebt(payeesCopy, payersCopy, transaction);
    } else if (credit === 0) {
      payeesCopy.splice(maxCreditInd, 1);
      settleDebt(payeesCopy, payersCopy, transaction);
    }
    if (debt === credit) {
      const newTransaction = {
        payerFirstName: payersCopy[maxDebtInd]?.firstName,
        payerLastName: payersCopy[maxDebtInd]?.lastName,
        debt: debt,
        payeeLastName: payeesCopy[maxCreditInd]?.lastName,
        payeeFirstName: payeesCopy[maxCreditInd]?.firstName,
        payerId: payersCopy[maxDebtInd].id,
        payeeId: payeesCopy[maxCreditInd].id,
      };
      transaction.push(newTransaction);
      payeesCopy.splice(maxCreditInd, 1);
      payersCopy.splice(maxDebtInd, 1); //tested. works fine

      settleDebt(payeesCopy, payersCopy, transaction);
    }

    if (debt < credit) {
      payeesCopy[maxCreditInd].contribution -= debt;
      //in this case the payer is settled
      const newTransaction = {
        payer: payersCopy[maxDebtInd].id,
        debt: debt,
        payee: payeesCopy[maxCreditInd].id,
      };
      transaction.push(newTransaction);
      payersCopy.splice(maxDebtInd, 1);
      settleDebt(payeesCopy, payersCopy, transaction);
    }

    if (debt > credit) {
      payersCopy[maxDebtInd].contribution += debt;
      //in this case, the payee would be settled
      const newTransaction = {
        payer: payersCopy[maxDebtInd].id,
        debt: debt,
        payee: payeesCopy[maxCreditInd].id,
      };
      transaction.push(newTransaction);
      payeesCopy.splice(maxCreditInd, 1);
      settleDebt(payeesCopy, payersCopy, transaction);
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

  const getImageUrl = (imagePath) => {
    if (imagePath) {
        getDownloadURL(ref(storage, imagePath))
        .then(url => {
            console.log(url);
            setImageUrl(url);
        })
    }
  }
  const viewReport = (expense) => {
    const participants = expense.participants;
    const transaction = [];
    participants.forEach((user) => {
      user.bill = Number(user.bill);
      user.contribution = Number(user.contribution);
    });
    const payers = participants.filter((user) => user.bill > user.contribution);
    const payees = participants.filter((user) => user.bill < user.contribution);
    getImageUrl(expense.image);
    settleDebt(payees, payers, transaction);
    setExpenseDetails({...expense});
    setOpenModal(true);
  };

  return (
    <Box sx={{ mt:5 }}>
      <TableContainer sx={{ width: "80%", mr: "auto", ml: "auto" }}>
        <Table sx={{ minWidth: 650 }} aria-label="list of expenses">
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Created on</TableCell>
              <TableCell>Total Bill</TableCell>
              <TableCell>Report</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenseList.map((expense, i) => {
              return (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &: last-child th": { border: 0 } }}
                >
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>
                    {expense.totalBill} {expense.currency}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => viewReport(expense)}>
                      View Report
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {openModal && (
        <ExpenseReport
          imageSrc={imageUrl}
          resetReport={setReport}
          open={openModal}
          report={report}
          setModal={setOpenModal}
          expenseDetails={expenseDetails}
        />
      )}
    </Box>
  );
}

export async function loader({ params }) {
  const docRef = doc(db, "users-db", params.userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const userData = docSnap.data(); // to get the expenses array from the user's doc
    const expenseIds = userData.expenses || [];
    // const listOfExpenses = [];
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
  }
}
