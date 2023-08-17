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
import { storage } from "../../firebase/firebase";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import ExpenseReport from "../ExpenseReport/ExpenseReport";
import { getDownloadURL, ref } from "@firebase/storage";
import { settleDebt } from "../../Utilities/ExpenseSettlementUtil";
import { fetchExpenseList } from "../../Utilities/FirebaseUtilities";
import SkeletonUI from "../SkeletonUI/SkeletonUI";

export default function ExpensesTable() {
  const [report, setReport] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [expenseDetails, setExpenseDetails] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expenseList, setExpenseList] = useState([]);
  const params = useParams();

  useEffect(() => {
    fetchExpenseList(params)
      .then((expenseList) => {
        setExpenseList([...expenseList]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        setIsLoading(false);
      });
  }, []);

  const getImageUrl = (imagePath) => {
    if (imagePath) {
      getDownloadURL(ref(storage, imagePath)).then((url) => {
        setImageUrl(url);
      });
    }
  };
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
    setReport([...transaction]);
    setExpenseDetails({ ...expense });
    setOpenModal(true);
  };

  return (
    <Box sx={{ mt: 5 }}>
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
            {isLoading &&
            <TableRow>
                <TableCell><SkeletonUI /></TableCell>
                <TableCell><SkeletonUI /></TableCell>
                <TableCell><SkeletonUI /></TableCell>
                <TableCell><SkeletonUI /></TableCell>
            </TableRow>}
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
