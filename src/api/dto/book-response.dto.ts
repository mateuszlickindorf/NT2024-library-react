export class BookDto {
    id: number | undefined;
    isbn: string | undefined;
    title: string | undefined;
    author: string | undefined;
    publisher: string | undefined;
    publicationYear: number | undefined;
    isAvailable: boolean | undefined;
}

export class BookResponseDto {
    id: number | undefined;
    isbn: string | undefined;
    title: string | undefined;
    author: string | undefined;
    publisher: string | undefined;
    publicationYear: number | undefined;
    isAvailable: boolean | undefined;
}