import { GetBookDto } from './book.dto';
import { GetUserSimplifiedDto } from './user.dto';

export class GetLoanDto {
    id: number | undefined;
    book: GetBookDto | undefined;
    user: GetUserSimplifiedDto | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
    wasReturned: boolean | undefined;
}

export class UpdateLoanDto {
    id: number | undefined;
    returnDate: string | null | undefined;
}

export class UpdateLoanResponseDto {
    book: GetBookDto | undefined;
    user: GetUserSimplifiedDto | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
    returnDate: string | undefined;
}

export class CreateLoanDto {
    bookId: number | undefined;
    userId: number | undefined;
    endDate: string | undefined;
}

export class CreateLoanResponseDto {
    book: GetBookDto | undefined;
    userId: GetUserSimplifiedDto | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
}