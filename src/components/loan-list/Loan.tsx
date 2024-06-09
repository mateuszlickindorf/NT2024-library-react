import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { LoanInterface as LoanType } from "../../interfaces/LoanInterface";

interface LoanProps {
    loan: LoanType;
}

const Loan: React.FC<LoanProps> = ({ loan }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    Loan ID: {loan.id}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    User ID: {loan.user_id}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Book ID: {loan.book_id}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Loan Date: {loan.loanDate.toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Due Date: {loan.dueDate.toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Return Date: {loan.returnDate ? loan.returnDate.toLocaleDateString() : "Not Returned Yet"}
                </Typography>
            </CardContent>
        </Card>
    );
};
export default Loan;