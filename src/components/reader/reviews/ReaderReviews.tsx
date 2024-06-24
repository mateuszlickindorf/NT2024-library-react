import * as React from 'react';
import './ReaderReviews.css';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import {
  Box,
  Button,
  ListItem,
  Rating,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RateReviewIcon from '@mui/icons-material/RateReview';
import Modal from '@mui/material/Modal';
import { Formik } from 'formik';
import { useApi } from '../../../api/ApiProvider';

function ReaderReviews() {
  const apiClient = useApi();
  const { t } = useTranslation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReviewIndex, setSelectedReviewIndex] = useState<number | null>(
    null,
  );

  // if it's a reader, get only their reviews
  const ReviewList = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    useEffect(() => {
      apiClient
        .getReviewsByUser(Number(localStorage.getItem('userId')))
        .then((response: any) => {
          if (response.success) {
            console.log('Rentals displayed!', response.data);
            setReviews(response.data);
          } else {
            console.error('Error displaying rentals:', response.statusCode);
          }
        });
    }, []);

    const handleEditReview = (values: {
      id: number;
      rating: number;
      comment: string;
    }) => {
      if (selectedReviewIndex === null) return;
      values.id = reviews[selectedReviewIndex].id;
      apiClient.editReview(values).then((response: any) => {
        if (response.success) {
          console.log('Review edited!', response.data);
          setReviews((prevReviews) =>
            prevReviews.map((review, index) =>
              index === selectedReviewIndex ? response.data : review,
            ),
          );
          handleEditModalClose();
        } else {
          console.error('Error editing the review:', response.statusCode);
        }
      });
    };

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
        handleDeleteModalClose();
      });
    };

    const handleDeleteClick = (index: number) => {
      setSelectedReviewIndex(index);
      setIsDeleteModalOpen(true);
    };

    const handleEditClick = (index: number) => {
      setSelectedReviewIndex(index);
      setIsEditModalOpen(true);
    };

    const handleDeleteModalClose = () => {
      setIsDeleteModalOpen(false);
      setSelectedReviewIndex(null);
    };

    const handleEditModalClose = () => {
      setIsEditModalOpen(false);
      setSelectedReviewIndex(null);
    };

    return (
      <div className="container">
        <div className="header">
          <div className="text">{t('your_reviews')}</div>
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
                  primary={`${review.book.title}: ${review.rating}/10`}
                  secondary={review.comment}
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
              </ListItem>
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
                  onClick={handleDeleteModalClose}
                  variant="outlined"
                  size="large"
                >
                  {t('no')}
                </Button>
              </div>
            </Box>
          </Modal>
          <Modal open={isEditModalOpen} onClose={handleEditModalClose}>
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
                    id: 0,
                    rating: 0,
                    comment: '',
                  }}
                  validateOnChange
                  validateOnBlur
                  enableReinitialize
                  onSubmit={handleEditReview}
                >
                  {(formik) => (
                    <form
                      id="editReviewForm"
                      noValidate
                      onSubmit={formik.handleSubmit}
                      className="edit-review-form"
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
                  {t('edit_a_review')}
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

export default ReaderReviews;