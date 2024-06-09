import {BookInterface} from "../interfaces/BookInterface";

const MockBooks: BookInterface[] = [
    {
        id: 1,
        isbn: '12345',
        title: 'Henryk Garncarz',
        author: 'Taki Jeden',
        publisher: 'PWR',
        publicationYear: 2020,
        availableCopies: 5,
    },

    {
        id: 2,
        isbn: '214372690',
        title: 'Historia Polski',
        author: 'Kamil Ślimak',
        publisher: 'Palindrom',
        publicationYear: 2019,
        availableCopies: 3,
    },
];

export default MockBooks;