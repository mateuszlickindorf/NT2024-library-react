import { LoanInterface } from "../interfaces/LoanInterface";

const MockLoans: LoanInterface[] = [
    {
        id: 1,
        loanDate: new Date('2023-01-01T00:00:00Z'),
        dueDate: new Date('2023-01-15T00:00:00Z'),
        returnDate: new Date('2023-01-15T00:00:00Z'),
        user_id: 1,
        book_id: 1,
    },
    {
        id: 2,
        loanDate: new Date('2023-01-05T00:00:00Z'),
        dueDate: new Date('2023-01-20T00:00:00Z'),
        returnDate: new Date('2023-01-18T00:00:00Z'), // returned early
        user_id: 2,
        book_id: 2,
    },
    {
        id: 3,
        loanDate: new Date('2023-01-10T00:00:00Z'),
        dueDate: new Date('2023-01-25T00:00:00Z'),
        returnDate: new Date('2023-01-15T00:00:00Z'),
        user_id: 3,
        book_id: 3,
    },
];

export default MockLoans;