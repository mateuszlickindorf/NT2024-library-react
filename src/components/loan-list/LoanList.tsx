import React from 'react';
import { Grid } from '@mui/material';
import Loan from './Loan';
import { LoanInterface as LoanType } from "../../interfaces/LoanInterface";

interface LoanListProps {
    loans: LoanType[];
}

const LoanList: React.FC<LoanListProps> = ({ loans }) => {
    return (
        <Grid container spacing={3}>
            {loans.map((loan) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={loan.id}>
                    <Loan loan={loan} />
                </Grid>
            ))}
        </Grid>
    );
};

export default LoanList;