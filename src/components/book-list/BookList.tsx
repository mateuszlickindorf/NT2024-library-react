import React, { useState, useEffect } from 'react';
import { Grid, Typography, CircularProgress } from '@mui/material';
import Book from './Book';
import { BookInterface as BookType } from "../../interfaces/BookInterface";
import { useApi } from "../../api/ApiProvider";

const BookList: React.FC = () => {
    const [books, setBooks] = useState<BookType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const apiClient = useApi();

    useEffect(() => {
        apiClient.getBooks()
            .then(response => {
                if (response.success) {
                    setBooks(response.data || []);
                } else {
                    setError('Failed to fetch books');
                }
            })
            .catch(err => {
                console.error('Error fetching books:', err);
                setError('Error fetching books');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [apiClient]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

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

export default BookList