import { GetBookDto } from './book.dto';
import { GetUserSimplifiedDto } from './user.dto';

export class CreateReviewDto {
    bookId: number | undefined;
    userId: number | undefined;
    rating: number | null | undefined;
    comment: string | null | undefined;
}

export class CreateReviewResponseDto {
    book: GetBookDto | undefined;
    user: GetUserSimplifiedDto | undefined;
    rating: number | null | undefined;
    comment: string | null | undefined;
    reviewDate: string | undefined;
}

export class GetReviewDto {
    id: number | undefined;
    book: GetBookDto | undefined;
    user: GetUserSimplifiedDto | undefined;
    rating: number | undefined;
    comment: string | undefined;
    reviewDate: string | undefined;
}

export class EditReviewDto {
    id: number | undefined;
    rating: number | null | undefined;
    comment: string | null | undefined;
}

export class EditReviewResponseDto {
    book: GetBookDto | undefined;
    user: GetUserSimplifiedDto | undefined;
    rating: number | null | undefined;
    comment: string | null | undefined;
    reviewDate: string | undefined;
}