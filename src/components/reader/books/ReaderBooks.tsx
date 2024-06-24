import * as React from 'react';
import './ReaderBooks.css';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import BookIcon from '@mui/icons-material/Book';
import {Box, ListItem, ListItemButton, Tooltip, Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import Modal from '@mui/material/Modal';
import RateReviewIcon from '@mui/icons-material/RateReview';
import {useApi} from "../../../api/ApiProvider";

function ReaderBooks() {
    const apiClient = useApi();
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBookIndex, setSelectedBookIndex] = useState<number | null>(
        null,
    );
    const [selectedBook, setSelectedBook] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);

    const BookList = () => {
        const [books, setBooks] = useState<any[]>([]);

        useEffect(() => {
            apiClient.getBooks().then((response: any) => {
                if (response.success) {
                    console.log('Books displayed!', response.data);
                    setBooks(response.data);
                } else {
                    console.error('Error displaying reader-books:', response.statusCode);
                }
            });
        }, []);

        const getBookDetails = () => {
            if (selectedBookIndex === null) return;
            const selectedBookId = books[selectedBookIndex].id;
            apiClient.getBookById(selectedBookId).then((response: any) => {
                if (response.success) {
                    console.log('Book details displayed!', response.data);
                    setSelectedBook(response.data);
                } else {
                    console.error('Error displaying book details:', response.statusCode);
                }
            });
            setIsModalOpen(true);
        };

        const getReviewsForBook = () => {
            if (selectedBookIndex === null) return;
            const selectedBookId = books[selectedBookIndex].id;
            apiClient.getReviewsByBook(selectedBookId).then((response: any) => {
                if (response.success) {
                    console.log('Reviews displayed!', response.data);
                    setReviews(response.data);
                } else {
                    console.error('Error displaying reviews:', response.statusCode);
                }
            });
        };

        const handleBookClick = (index: number) => {
            setSelectedBookIndex(index);
            getReviewsForBook();
            getBookDetails();
        };

        const handleModalClose = () => {
            setIsModalOpen(false);
            setSelectedBook(null);
            setSelectedBookIndex(null);
        };

        const validationSchema = useMemo(
            () =>
                yup.object().shape({
                    isbn: yup
                        .string()
                        .required('ISBN is required!')
                        .min(13, 'ISBN must consist of 13 digits!')
                        .max(13, 'ISBN must consist of 13 digits!'),
                    author: yup.string().required('Author is required!'),
                    title: yup.string().required('Title is required!'),
                    publisher: yup.string().required('Publisher is required!'),
                    publicationYear: yup
                        .number()
                        .required('Publication year is required!')
                        .min(0, 'Publication year cannot be less than 0!'),
                    availableCopies: yup
                        .number()
                        .required('Number of available copies is required!')
                        .min(0, 'Number of available copies cannot be less than 0!'),
                }),
            [],
        );

        return (
            <div className="book-container-reader">
                <div className="book-header-reader">
                    <div className="book-text-reader">{t('books_browse')}</div>
                    <div className="book-underline-reader"></div>
                </div>
                <div className="book-content-reader">
                    <List
                        sx={{
                            width: '100%',
                            maxWidth: 450,
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'auto',
                            maxHeight: 600,
                            '& ul': { padding: 1 },
                        }}
                        subheader={<li />}
                    >
                        {books.map((book, index) => (
                            <ListItemButton
                                key={index}
                                style={{ width: '100%', maxWidth: 400, height: 100 }}
                                onClick={() => handleBookClick(index)}
                            >
                                <Tooltip title={t('get_more_details_books')}>
                                    <ListItemAvatar>
                                        <Avatar style={{ background: '#2268a5' }}>
                                            <BookIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                </Tooltip>
                                <ListItemText
                                    primary={book.title}
                                    secondary={`${book.author}, ${book.publicationYear}`}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                    <Modal open={isModalOpen} onClose={handleModalClose}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                overflow: 'auto',
                                bgcolor: 'background.paper',
                                border: '3px solid #1648a4',
                                borderRadius: 3,
                                boxShadow: 24,
                                p: 4,
                            }}
                        >
                            <div className="modal-headers">
                                <h2 className="modal-text"> {t('information_about_book')}</h2>
                                <h2 className="modal-text">{t('reviews')}</h2>
                            </div>
                            <div className="modal-content">
                                <div className="modal-book-content">
                                    {selectedBook && (
                                        <div>
                                            <Typography className="modal-text-body">
                                                ISBN: {selectedBook.isbn}
                                            </Typography>
                                            <Typography className="modal-text-body">
                                                {t('title')}: {selectedBook.title}
                                            </Typography>
                                            <Typography className="modal-text-body">
                                                {t('author')}: {selectedBook.author}
                                            </Typography>
                                            <Typography className="modal-text-body">
                                                {t('publisher')}: {selectedBook.publisher}
                                            </Typography>
                                            <Typography className="modal-text-body">
                                                {t('publication_year')}: {selectedBook.publicationYear}
                                            </Typography>
                                            <Typography className="modal-text-body">
                                                {t('is_available')}:{' '}
                                                {selectedBook.isAvailable === true ? t('yes') : t('no')}
                                            </Typography>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-review-content">
                                    <List
                                        sx={{
                                            width: '100%',
                                            maxWidth: 650,
                                            bgcolor: 'background.paper',
                                            position: 'relative',
                                            overflow: 'auto',
                                            maxHeight: 400,
                                            '& ul': { padding: 0 },
                                        }}
                                        subheader={<li />}
                                    >
                                        {reviews.map((review, index) => (
                                            <ListItem
                                                key={index}
                                                style={{
                                                    width: '100%',
                                                    maxWidth: 650,
                                                }}
                                            >
                                                <Tooltip
                                                    title={`${t('review_date')}: ${review.reviewDate}`}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar style={{ background: '#2268a5' }}>
                                                            <RateReviewIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                </Tooltip>
                                                <ListItemText
                                                    primary={`${review.user.name}: ${review.rating}/10`}
                                                    secondary={review.comment}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </div>
                            </div>
                        </Box>
                    </Modal>
                </div>
            </div>
        );
    };
    return <BookList />;
}

export default ReaderBooks;