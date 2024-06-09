import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import {BookInterface} from "../../interfaces/BookInterface";

interface BookProps {
    book: BookInterface;
}

const Book: React.FC<BookProps> = ({ book }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">{book.title}</Typography>
                <Typography variant="subtitle1" color="textSecondary">{book.author}</Typography>
                <Typography variant="body2">ISBN: {book.isbn}</Typography>
                <Typography variant="body2">Publisher: {book.publisher}</Typography>
                <Typography variant="body2">Year: {book.publicationYear}</Typography>
                <Typography variant="body2">Available Copies: {book.availableCopies}</Typography>
            </CardContent>
        </Card>
    );
};
export default Book;