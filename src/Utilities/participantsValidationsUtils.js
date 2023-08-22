export const calculateCumulativeExpense = (
  participants,
  signedInUserBill,
  signedInUserContribution
) => {
  if (participants.length > 0) {
    const totalBill = participants.reduce((accum, current) => {
      return {
        bill: Number(accum.bill) + Number(current.bill),
        contribution: Number(accum.contribution) + Number(current.contribution),
      };
    });
    return {
      bill: totalBill.bill + signedInUserBill,
      contribution: totalBill.contribution + signedInUserContribution,
    };
  } else {
    return {
      bill: signedInUserBill,
      contribution: signedInUserContribution,
    };
  }
};

export const isExpenseValid = (
  participants,
  participantBill,
  participantContribution,
  signedInUserBill,
  signedInUserContribution,
  totalBill
) => {
  const participantPayment = calculateCumulativeExpense(
    participants,
    signedInUserBill,
    signedInUserContribution
  );

  return (
    participantPayment.bill + participantBill > totalBill ||
    participantPayment.contribution + participantContribution > totalBill ||
    participantContribution > totalBill ||
    participantBill > totalBill
  );
};

export const isParticipantAlreadyAdded = (participants, email) => {
  const repeatedParticipant = participants.find(
    (participant) => participant.email === email
  );
  return repeatedParticipant;
};
