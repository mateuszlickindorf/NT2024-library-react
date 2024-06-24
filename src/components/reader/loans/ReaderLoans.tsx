import * as React from 'react';
import List from '@mui/material/List';
import './ReaderLoans.css';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import BookIcon from '@mui/icons-material/LocalLibrary';
import {Box, Button, ListItem, Rating, TextField, Tooltip, Typography,} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '@mui/material/Modal';
import { Formik } from 'formik';
import {useApi} from "../../../api/ApiProvider";

function ReaderLoans() {
    const apiClient = useApi();
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLoanIndex, setSelectedLoanIndex] = useState<number | null>(
        null,
    );
    const [, setSelectedLoan] = useState<any>(null);
    const [, setReviews] = useState<any[]>([]);
    const [selectedBookId, setSelectedBookId] = useState<number>();
    const [selectedUserId, setSelectedUserId] = useState<number>();

    const LoanList = () => {
        const [loans, setLoans] = useState<any[]>([]);
        useEffect(() => {
            apiClient
                .getLoansByUserId(Number(localStorage.getItem('userId')))
                .then((response: any) => {
                    if (response.success) {
                        console.log('Loans displayed!', response.data);
                        setLoans(response.data);
                    } else {
                        console.error('Error displaying loans:', response.statusCode);
                    }
                });
        }, []);

        const handleReviewSubmit = (values: {
            bookId: number;
            userId: number;
            rating: number;
            comment: string;
        }) => {
            values.userId = Number(selectedUserId);
            values.bookId = Number(selectedBookId);
            apiClient.addReview(values).then((response: any) => {
                if (response.success) {
                    console.log('Review added!', response.data);
                    setReviews((prevReviews) => [...prevReviews, response.data]);
                    handleModalClose();
                } else {
                    console.error('Error adding review:', response.statusCode);
                }
            });
        };

        const handleLoanClick = async (index: number) => {
            setSelectedLoanIndex(index);
            getLoanDetails();
        };

        const handleModalClose = () => {
            setIsModalOpen(false);
            setSelectedLoan(null);
            setSelectedLoanIndex(null);
        };

        const getLoanDetails = () => {
            if (selectedLoanIndex === null) return;
            setSelectedBookId(loans[selectedLoanIndex].book.id);
            setSelectedUserId(Number(localStorage.getItem('userId')));
            setIsModalOpen(true);
        };

        const checkIfReturned = (dateFromDB: any, status: any) => {
            const date = new Date(dateFromDB);
            if (Date.now() > date.getTime() && !status) {
                return '#cd3939';
            } else if (status) {
                return '#86ca55';
            } else {
                return '#2268a5';
            }
        };

        return (
            <div className="container">
                <div className="header">
                    <div className="text">{t('rentals_browse_user')}</div>
                    <div className="underline"></div>
                </div>
                <div className="content">
                    <List
                        className="rental-list"
                        sx={{
                            width: '100%',
                            maxWidth: 700,
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'auto',
                            maxHeight: 300,
                            '& ul': { padding: 0 },
                        }}
                        subheader={<li />}
                    >
                        {loans.map((loan, index) => (
                            <ListItem
                                key={index}
                                style={{
                                    width: '100%',
                                    maxWidth: 650,
                                }}
                            >
                                <Tooltip title={t('get_more_details_rentals')}>
                                    <ListItemAvatar>
                                        <Avatar
                                            style={{
                                                background: checkIfReturned(
                                                    loan.endDate,
                                                    loan.wasReturned,
                                                ),
                                            }}
                                        >
                                            <BookIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                </Tooltip>
                                <ListItemText
                                    primary={loan.book.title}
                                    secondary={`${t('From')} ${loan.startDate} ${t('to')} ${loan.endDate}`}
                                />
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => handleLoanClick(index)}
                                >
                                    {t('review_add')}
                                </Button>
                            </ListItem>
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
                            <div className="modal-header">
                                <h2 className="modal-text"> {t('review_modal_title')}</h2>
                                <div className="modal-underline-minor"></div>
                                <Formik
                                    initialValues={{
                                        userId: 0,
                                        bookId: 0,
                                        rating: 0,
                                        comment: '',
                                    }}
                                    validateOnChange
                                    validateOnBlur
                                    enableReinitialize
                                    onSubmit={handleReviewSubmit}
                                >
                                    {(formik) => (
                                        <form
                                            id="editReviewForm"
                                            noValidate
                                            onSubmit={formik.handleSubmit}
                                            className="add-review-form"
                                        >
                                            <Typography
                                                component="legend"
                                                className="modal-text-body"
                                            >
                                                {t('rating')}:
                                            </Typography>
                                            <Rating
                                                name="rating"
                                                id="rating"
                                                max={10}
                                                value={formik.values.rating}
                                                onChange={(event, newValue) =>
                                                    formik.setFieldValue('rating', newValue)
                                                }
                                            />
                                            <TextField
                                                id="comment"
                                                name="comment"
                                                type="text"
                                                label={t('comment')}
                                                fullWidth
                                                multiline
                                                rows={4}
                                                value={formik.values.comment}
                                                onChange={formik.handleChange}
                                            />
                                        </form>
                                    )}
                                </Formik>
                                <Button
                                    form="editReviewForm"
                                    type="submit"
                                    variant="contained"
                                    size="medium"
                                >
                                    {t('add_a_review')}
                                </Button>
                            </div>
                        </Box>
                    </Modal>
                </div>
            </div>
        );
    };
    return <LoanList />;
}

export default ReaderLoans;