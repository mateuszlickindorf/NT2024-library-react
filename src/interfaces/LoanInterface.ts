export interface LoanInterface {
  id: number;
  loanDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  user_id: number;
  book_id: number;
}
    