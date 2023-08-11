import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useSelector } from "react-redux";
import { participantsSelector } from "../../store/participantsSlice";

export default function ContributorsTable({ currency }) {
  const participants = useSelector(participantsSelector);
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="list of contributors">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Bill</TableCell>
            <TableCell>Amount paid</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {participants.map((participant) => {
            return (
              <TableRow
                key={participant.id}
                sx={{ "&:last-child td, &: last-child th": { border: 0 } }}
              >
                <TableCell>{participant.email}</TableCell>
                <TableCell>
                  {participant.bill} {currency}
                </TableCell>
                <TableCell>
                  {participant.contribution} {currency}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
