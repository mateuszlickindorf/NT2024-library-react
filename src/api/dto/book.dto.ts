export class GetBookDto {
    id: number | undefined;
    isbn: string | undefined;
    title: string | undefined;
    author: string | undefined;
    publisher: string | undefined;
    publicationYear: number | undefined;
    isAvailable: boolean | undefined;
}

export class CreateBookDto {
    isbn: string | undefined;
    title: string | undefined;
    author: string | undefined;
    publisher: string | undefined;
    publicationYear: number | undefined;
    availableCopies: number | undefined;
}

export class CreateBookResponseDto {
    isbn: string | undefined;
    title: string | undefined;
    author: string | undefined;
    publisher: string | undefined;
    publicationYear: number | undefined;
    availableCopies: number | undefined;
}

export class EditBookDto {
    id: number | undefined;
    isbn: string | null | undefined;
    title: string | null | undefined;
    author: string | null | undefined;
    publisher: string | null | undefined;
    publicationYear: number | null | undefined;
    availableCopies: number | null | undefined;
}
