import {
  Box,
  Button,
  Container,
  CssBaseline,
  Modal,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { authSelector } from "../../store/authSlice";
import { Suspense } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

export default function ExpenseReport({
  open,
  report,
  setModal,
  resetReport,
  expenseDetails,
  imageSrc,
}) {
  const userAuth = useSelector(authSelector);
  return (
    <Modal open={open}>
      <Container component="main" maxwidth="xs" sx={style}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box component="div" sx={{ mt: 3 }}>
            <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
              Bill Summary
            </Typography>
            {expenseDetails.participants.map((expense) => {
              console.log(expense);
              return (
                <Typography
                  color="text.secondary"
                  sx={{ mb: 1 }}
                  key={expense.id}
                >
                  {expense.id === userAuth.id ? "You" : expense?.name} ordered
                  for {expense.bill} {expenseDetails.currency} and paid{" "}
                  {expense.contribution} {expenseDetails.currency}
                </Typography>
              );
            })}
            <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
              Settlement Summary
            </Typography>
            {report.map((expense) => {
              console.log(expense);
              return (
                <Typography
                  color="text.secondary"
                  sx={{ mb: 1 }}
                  key={expense.payerName + expense.payeeName}
                >
                  {expense.payerId === userAuth.id
                    ? "You owe"
                    : expense?.payerName + " owes"}{" "}
                  {expense.debt} {expenseDetails.currency} to{" "}
                  {expense.payeeId === userAuth.id ? "You" : expense.payeeName}
                </Typography>
              );
            })}
            <Typography component="h2" variant="h5">
              Image
            </Typography>

            {expenseDetails.image ? (
              <Container
                component="div"
                sx={{
                  height: "250px",
                  width: "400px",
                  border: "solid 1px green",
                }}
              >
                <Suspense fallback={<p>Loading</p>}>
                  <Box
                    component="img"
                    src={`${imageSrc}`}
                    alt="picture of bill"
                    sx={{ width: "100%", height: "100%" }}
                  />
                </Suspense>
              </Container>
            ) : (
              <Typography color="text.secondary" component="p" sx={{ mb: 2 }}>
                No image found
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={() => {
                resetReport([]);
                setModal(false);
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}
