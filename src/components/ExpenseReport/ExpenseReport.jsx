import {
  Box,
  Button,
  Container,
  CssBaseline,
  Modal,
  Typography,
} from "@mui/material";
import { useParams } from "react-router";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
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
  const param = useParams();
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
              return (
                <Typography sx={{ mb: 1 }}>
                  { expense.id === param.userId? 'You': expense?.name  } ordered for {expense.bill}{" "}
                  {expenseDetails.currency} and paid {expense.contribution}{" "}
                  {expenseDetails.currency}
                </Typography>
              );
            })}
            <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
              Settlement Summary
            </Typography>
            {report.map((expense) => {
              return (
                <Typography sx={{ mb: 1 }}>
                  {expense.payerId === param.userId ? 'You owe': expense?.payerName + ' owes'}{" "}
                  {expense.debt} {expenseDetails.currency} to{" "}
                  {expense.payeeId === param.userId? 'You': expense.payeeName}
                </Typography>
              );
            })}
            <Typography component="h2" variant="h5">
              Image
            </Typography>
            {expenseDetails.image ? (
              <Box component="img" src={`${imageSrc}`} alt="picture of bill" />
            ) : (
              <Typography component="p" sx={{ mb: 2 }}>
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
