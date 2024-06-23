import * as React from 'react';
import './AdminBooks.css';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import RateReviewIcon from '@mui/icons-material/RateReview';
import BookIcon from '@mui/icons-material/Book';
import {Box, Button, FormControl, Input, InputLabel, ListItem, ListItemButton, MenuItem, Select, Stack, TextField, Tooltip, Typography,
} from '@mui/material';
import { Formik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import Modal from '@mui/material/Modal';
import {useApi} from "../../../api/ApiProvider";

function AdminBooks() {
    const apiClient = useApi();
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [selectedBookIndex, setSelectedBookIndex] = useState<number | null>(
        null,
    );
    const [selectedBook, setSelectedBook] = useState<any>(null);
    const [endDate, setEndDate] = useState<string>(
        new Date().toISOString().substring(0, 10),
    );
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>('');
    const [, setRentals] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        apiClient.getUsers().then((response: any) => {
            if (response.success) {
                console.log('Users displayed!', response.data);
                setUsers(response.data);
            } else {
                console.error('Error displaying users:', response.statusCode);
            }
        });
    }, [apiClient]);

    const BookList = () => {
        const [books, setBooks] = useState<any[]>([]);

        useEffect(() => {
            apiClient.getBooks().then((response: any) => {
                if (response.success) {
                    console.log('Books displayed!', response.data);
                    setBooks(response.data);
                } else {
                    console.error('Error displaying books:', response.statusCode);
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
            setIsModalOpen(true);
        };

        const handleBookClick = async (index: number) => {
            setSelectedBookIndex(index);
            getBookDetails();
            getReviewsForBook();
        };

        const handleModalClose = () => {
            setIsModalOpen(false);
            setSelectedBook(null);
            setSelectedBookIndex(null);
        };

        const handleRentalSubmit = () => {
            if (!selectedBook || !selectedUser || !endDate) return;
            const rentalData = {
                bookId: selectedBook.id,
                userId: selectedUser,
                endDate: endDate,
            };
            apiClient.addLoan(rentalData).then((response: any) => {
                if (response.success) {
                    console.log('Rental added!', response.data);
                    setRentals((prevRentals) => [...prevRentals, response.data]);
                    setConfirmationModalOpen(true);
                } else {
                    console.error('Error adding rental:', response.statusCode);
                }
            });
        };

        const handleConfirmationModalClose = () => {
            setConfirmationModalOpen(false); // close confirmation modal
        };

        const onSubmit = (
            values: {
                isbn: string;
                author: string;
                title: string;
                publisher: string;
                publicationYear: number;
                availableCopies: number;
            },
            { resetForm }: { resetForm: () => void },
        ) => {
            apiClient.addBook(values).then((response: any) => {
                if (response.success) {
                    console.log('Form submitted!', values);
                    setBooks((prevBooks) => [...prevBooks, response.data]);
                    resetForm();
                } else {
                    console.error('Error submitting form:', response.statusCode);
                }
            });
        };

        const validationSchemaBook = useMemo(
            () =>
                yup.object().shape({
                    isbn: yup
                        .string()
                        .required(t('required_isbn'))
                        .min(13, t('isbn_requirements'))
                        .max(13, t('isbn_requirements')),
                    author: yup.string().required(t('required_author')),
                    title: yup.string().required(t('required_title')),
                    publisher: yup.string().required(t('required_publisher')),
                    publicationYear: yup
                        .number()
                        .required(t('required_publication_year')),
                    availableCopies: yup
                        .number()
                        .required(t('required_available_copies'))
                        .min(0, t('available_copies_requirements')),
                }),
            [],
        );

        const handleDeleteBook = () => {
            if (selectedBookIndex === null) return;
            const deletedBookId = books[selectedBookIndex].id;
            apiClient.deleteBook(deletedBookId).then((response: any) => {
                if (response.success) {
                    console.log('Book deleted!', deletedBookId);
                    setBooks((prevBooks) =>
                        prevBooks.filter((book) => book.id !== deletedBookId),
                    );
                } else {
                    console.error('Error deleting the book:', response.statusCode);
                }
                handleDeleteModalClose();
            });
        };

        const handleDeleteClick = (index: number) => {
            setSelectedBookIndex(index);
            setIsDeleteModalOpen(true);
        };

        const handleDeleteModalClose = () => {
            setIsDeleteModalOpen(false);
            setSelectedBookIndex(null);
        };

        const handleEditBook = (values: {
            id: number;
            isbn: string;
            author: string;
            title: string;
            publisher: string;
            publicationYear: number;
            availableCopies: number;
        }) => {
            if (selectedBookIndex === null) return;
            values.id = books[selectedBookIndex].id;
            apiClient.editBook(values).then((response: any) => {
                if (response.success) {
                    console.log('Book edited!', response.data);
                    setBooks((prevBooks) =>
                        prevBooks.map((book, index) =>
                            index === selectedBookIndex ? response.data : book,
                        ),
                    );
                    handleEditModalClose();
                } else {
                    console.error('Error editing the book:', response.statusCode);
                }
            });
        };

        const handleEditClick = (index: number) => {
            setSelectedBookIndex(index);
            setIsEditModalOpen(true);
        };

        const handleEditModalClose = () => {
            setIsEditModalOpen(false);
            setSelectedBookIndex(null);
        };

        return (
            <div className="book-container">
                <div className="book-header">
                    <div className="book-text">{t('books_browse')}</div>
                    <div className="book-underline"></div>
                </div>
                <div className="book-content">
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
                                style={{ width: '100%', maxWidth: 450, height: 100 }}
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
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleEditClick(index)}
                                    >
                                        {t('review_edit')}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDeleteClick(index)}
                                    >
                                        {t('delete_user')}
                                    </Button>
                                </Stack>
                            </ListItemButton>
                        ))}
                    </List>
                    <Modal open={isDeleteModalOpen} onClose={handleDeleteModalClose}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 600,
                                overflow: 'auto',
                                borderRadius: 3,
                                bgcolor: 'background.paper',
                                border: '3px solid #1648a4',
                                boxShadow: 24,
                                p: 4,
                            }}
                        >
                            <h2 className="modal-text">
                                {t('confirm_deletion_book_question')}
                            </h2>
                            <div className="modal-button">
                                <Button
                                    onClick={handleDeleteBook}
                                    variant="outlined"
                                    size="large"
                                >
                                    {t('yes')}
                                </Button>
                                <Button
                                    onClick={handleDeleteModalClose}
                                    variant="outlined"
                                    size="large"
                                >
                                    {t('no')}
                                </Button>
                            </div>
                        </Box>
                    </Modal>
                    <Modal open={isModalOpen} onClose={handleModalClose}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 1000,
                                height: 500,
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
                                <h2 className="modal-text">{t('rent_book')}</h2>
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
                                <div className="modal-rental-content">
                                    <InputLabel className="modal-text-body">
                                        {t('select_user')}
                                    </InputLabel>
                                    <FormControl variant="standard" fullWidth>
                                        <InputLabel id="userSelect">{t('role_reader')}</InputLabel>
                                        <Select
                                            id="userSelect"
                                            label={t('reader')}
                                            value={selectedUser}
                                            onChange={(e) => setSelectedUser(e.target.value)}
                                        >
                                            {users.map((user) => (
                                                <MenuItem key={user.id} value={user.id}>
                                                    {user.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <InputLabel id="endDate" className="modal-text-body">
                                        {t('end_date')}
                                    </InputLabel>
                                    <Input
                                        id="endDate"
                                        name="endDate"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="modal-text-body"
                                    />
                                    <Button
                                        onClick={handleRentalSubmit}
                                        variant="contained"
                                        size="medium"
                                        className="modal-button"
                                    >
                                        {t('add_rental')}
                                    </Button>
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
                    <Modal
                        open={confirmationModalOpen}
                        onClose={handleConfirmationModalClose}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                border: '3px solid #1648a4',
                                borderRadius: 3,
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                            }}
                        >
                            <h2 className="modal-text">{t('rental_added_confirmation')}</h2>
                            <div className="modal-button">
                                <Button
                                    onClick={handleConfirmationModalClose}
                                    variant="outlined"
                                    size="large"
                                >
                                    {t('close')}
                                </Button>
                            </div>
                        </Box>
                    </Modal>
                    <Formik
                        initialValues={{
                            isbn: '',
                            author: '',
                            title: '',
                            publisher: '',
                            publicationYear: 0,
                            availableCopies: 0,
                        }}
                        onSubmit={onSubmit}
                        validationSchema={validationSchemaBook}
                        validateOnChange
                        validateOnBlur
                    >
                        {(formik) => (
                            <form
                                className="book-add-form"
                                id="addBookForm"
                                noValidate
                                onSubmit={formik.handleSubmit}
                            >
                                <TextField
                                    id="ISBN"
                                    name="isbn"
                                    label="ISBN"
                                    variant="standard"
                                    type="string"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.isbn && !!formik.errors.isbn}
                                    helperText={formik.touched.isbn && formik.errors.isbn}
                                />
                                <TextField
                                    id="Author"
                                    name="author"
                                    label={t('author')}
                                    variant="standard"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.author && !!formik.errors.author}
                                    helperText={formik.touched.author && formik.errors.author}
                                />
                                <TextField
                                    id="Title"
                                    name="title"
                                    label={t('title')}
                                    variant="standard"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.title && !!formik.errors.title}
                                    helperText={formik.touched.title && formik.errors.title}
                                />
                                <TextField
                                    id="Publisher"
                                    name="publisher"
                                    label={t('publisher')}
                                    variant="standard"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.publisher && !!formik.errors.publisher}
                                    helperText={
                                        formik.touched.publisher && formik.errors.publisher
                                    }
                                />
                                <TextField
                                    id="Publication year"
                                    name="publicationYear"
                                    label={t('publication_year')}
                                    variant="standard"
                                    type="number"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.publicationYear &&
                                        !!formik.errors.publicationYear
                                    }
                                    helperText={
                                        formik.touched.publicationYear &&
                                        formik.errors.publicationYear
                                    }
                                />
                                <TextField
                                    id="Available copies"
                                    name="availableCopies"
                                    label={t('available_copies')}
                                    variant="standard"
                                    type="number"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.availableCopies &&
                                        !!formik.errors.availableCopies
                                    }
                                    helperText={
                                        formik.touched.availableCopies &&
                                        formik.errors.availableCopies
                                    }
                                />
                                <Button
                                    size="large"
                                    variant="contained"
                                    type="submit"
                                    form="addBookForm"
                                >
                                    {t('book_add')}
                                </Button>
                            </form>
                        )}
                    </Formik>
                    <Modal open={isEditModalOpen} onClose={handleEditModalClose}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                border: '3px solid #1648a4',
                                borderRadius: 3,
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                            }}
                        >
                            <h2 className="modal-header">
                                {t('edit_book')}
                                <div className="modal-underline-minor"></div>
                            </h2>
                            <Formik
                                initialValues={{
                                    id: 0,
                                    isbn: '',
                                    author: '',
                                    title: '',
                                    publisher: '',
                                    publicationYear: 0,
                                    availableCopies: 0,
                                }}
                                onSubmit={handleEditBook}
                                validationSchema={validationSchemaBook}
                                validateOnChange
                                validateOnBlur
                            >
                                {(formik) => (
                                    <form
                                        className="book-edit-form"
                                        id="editBookForm"
                                        noValidate
                                        onSubmit={formik.handleSubmit}
                                    >
                                        <TextField
                                            id="ISBN"
                                            name="isbn"
                                            label="ISBN"
                                            variant="standard"
                                            type="string"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.isbn && !!formik.errors.isbn}
                                            helperText={formik.touched.isbn && formik.errors.isbn}
                                        />
                                        <TextField
                                            id="Author"
                                            name="author"
                                            label={t('author')}
                                            variant="standard"
                                            type="text"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.author && !!formik.errors.author}
                                            helperText={formik.touched.author && formik.errors.author}
                                        />
                                        <TextField
                                            id="Title"
                                            name="title"
                                            label={t('title')}
                                            variant="standard"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.title && !!formik.errors.title}
                                            helperText={formik.touched.title && formik.errors.title}
                                        />
                                        <TextField
                                            id="Publisher"
                                            name="publisher"
                                            label={t('publisher')}
                                            variant="standard"
                                            type="text"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.publisher && !!formik.errors.publisher
                                            }
                                            helperText={
                                                formik.touched.publisher && formik.errors.publisher
                                            }
                                        />
                                        <TextField
                                            id="Publication year"
                                            name="publicationYear"
                                            label={t('publication_year')}
                                            variant="standard"
                                            type="number"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.publicationYear &&
                                                !!formik.errors.publicationYear
                                            }
                                            helperText={
                                                formik.touched.publicationYear &&
                                                formik.errors.publicationYear
                                            }
                                        />
                                        <TextField
                                            id="Available copies"
                                            name="availableCopies"
                                            label={t('available_copies')}
                                            variant="standard"
                                            type="number"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.availableCopies &&
                                                !!formik.errors.availableCopies
                                            }
                                            helperText={
                                                formik.touched.availableCopies &&
                                                formik.errors.availableCopies
                                            }
                                        />
                                        <Button
                                            size="large"
                                            variant="contained"
                                            type="submit"
                                            form="editBookForm"
                                        >
                                            {t('review_edit')}
                                        </Button>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                    </Modal>
                </div>
            </div>
        );
    };
    return <BookList />;
}

export default AdminBooks;