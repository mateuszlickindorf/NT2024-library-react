import * as React from 'react';
import './AdminReviews.css';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Box, Button, ListItem, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RateReviewIcon from '@mui/icons-material/RateReview';
import Modal from '@mui/material/Modal';
import {useApi} from "../../../api/ApiProvider";

function AdminReviews() {
    const apiClient = useApi();
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReviewIndex, setSelectedReviewIndex] = useState<number | null>(
        null,
    );

    // if it's a reader, get only their reviews
    const ReviewList = () => {
        const [reviews, setReviews] = useState<any[]>([]);
        useEffect(() => {
            apiClient.getReviews().then((response: any) => {
                if (response.success) {
                    console.log('Loans displayed!', response.data);
                    setReviews(response.data);
                } else {
                    console.error('Error displaying loans:', response.statusCode);
                }
            });
        }, []);

        const handleDeleteReview = () => {
            if (selectedReviewIndex === null) return;
            const deletedReviewId = reviews[selectedReviewIndex].id;
            apiClient.deleteReview(deletedReviewId).then((response: any) => {
                if (response.success) {
                    console.log('Review deleted!', deletedReviewId);
                    setReviews((prevReviews) =>
                        prevReviews.filter((review) => review.id !== deletedReviewId),
                    );
                } else {
                    console.error('Error deleting the review:', response.statusCode);
                }
                handleModalClose();
            });
        };

        const handleDeleteClick = (index: number) => {
            setSelectedReviewIndex(index);
            setIsModalOpen(true);
        };

        const handleModalClose = () => {
            setIsModalOpen(false);
            setSelectedReviewIndex(null);
        };

        return (
            <div className="container">
                <div className="header">
                    <div className="text">{t('browse_reviews')}</div>
                    <div className="underline"></div>
                </div>
                <div className="content">
                    <List
                        sx={{
                            width: '100%',
                            maxWidth: 700,
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
                                    maxWidth: 700,
                                }}
                            >
                                <Tooltip title={`${t('review_date')}: ${review.reviewDate}`}>
                                    <ListItemAvatar>
                                        <Avatar style={{ background: '#2268a5' }}>
                                            <RateReviewIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                </Tooltip>
                                <ListItemText
                                    primary={`${review.book.title}: ${review.rating}/10 - ${review.user.name}`}
                                    secondary={review.comment}
                                />
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDeleteClick(index)}
                                >
                                    {t('delete_user')}
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
                                {t('confirm_deletion_review_question')}
                            </h2>
                            <div className="modal-button">
                                <Button
                                    onClick={handleDeleteReview}
                                    variant="outlined"
                                    size="large"
                                >
                                    {t('yes')}
                                </Button>
                                <Button
                                    onClick={handleModalClose}
                                    variant="outlined"
                                    size="large"
                                >
                                    {t('no')}
                                </Button>
                            </div>
                        </Box>
                    </Modal>
                </div>
            </div>
        );
    };
    return <ReviewList />;
}

export default AdminReviews;