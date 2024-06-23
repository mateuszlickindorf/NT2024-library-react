import { GetBookDto } from './book.dto';
import { GetUserSimplifiedDto } from './user.dto';

export class GetLoanDto {
    id: number | undefined;
    book: GetBookDto | undefined;
    user: GetUserSimplifiedDto | undefined;
    loanDate: string | undefined;
    endDate: string | undefined;
    wasReturned: boolean | undefined;
}

export class UpdateLoanDto {
    id: number | undefined;
    dueDate: string | null | undefined;
}

export class UpdateLoanResponseDto {
    book: GetBookDto | undefined;
    user: GetUserSimplifiedDto | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
    dueDate: string | undefined;
}

export class CreateRentalDto {
    bookId: number | undefined;
    userId: number | undefined;
    endDate: string | undefined;
}

export class CreateRentalResponseDto {
    book: GetBookDto | undefined;
    userId: GetUserSimplifiedDto | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
}