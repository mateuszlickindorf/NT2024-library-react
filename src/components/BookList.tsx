import React from 'react';
import { Grid } from '@mui/material';
import Book from './Book';
import { BookInterface as BookType } from "../interfaces/BookInterface";

interface BookListProps {
    books: BookType[];
}
const BookList: React.FC<BookListProps> = ({ books }) => {
    return (
        <Grid container spacing={3}>
            {books.map((book) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                    <Book book={book} />
                </Grid>
            ))}
        </Grid>
    );
};
export default BookList;


