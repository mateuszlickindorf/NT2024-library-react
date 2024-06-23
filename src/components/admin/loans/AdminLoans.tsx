import * as React from 'react';
import List from '@mui/material/List';
import './AdminLoans.css';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import BookIcon from '@mui/icons-material/LocalLibrary';
import { Box, Button, Input, ListItem, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import { useTranslation } from 'react-i18next';
import {useApi} from "../../../api/ApiProvider";

function AdminLoans() {
    const apiClient = useApi();
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dueDate, setDueDate] = useState<string>(
        new Date().toISOString().substring(0, 10),
    );
    const [selectedLoanIndex, setSelectedLoanIndex] = useState<number | null>(
        null,
    );
    const [modalAction, setModalAction] = useState<'return' | 'undo'>('return');

    // admin -> get all loans
    const LoanList = () => {
        const [loans, setLoans] = useState<any[]>([]);
        useEffect(() => {
            apiClient.getLoans().then((response: any) => {
                if (response.success) {
                    console.log('Loans displayed!', response.data);
                    setLoans(response.data);
                } else {
                    console.error('Error displaying loans:', response.statusCode);
                }
            });
        }, []);

        const handleReturnClick = (index: number, action: 'return' | 'undo') => {
            setSelectedLoanIndex(index);
            setModalAction(action);
            setIsModalOpen(true);
        };

        const handleModalClose = () => {
            setIsModalOpen(false);
            setSelectedLoanIndex(null);
        };

        // mark a loan as returned or not
        const handleReturnSubmit = () => {
            if (selectedLoanIndex === null) return;
            const updatedLoanData = {
                id: loans[selectedLoanIndex].id,
                dueDate: modalAction === 'return' ? dueDate : null,
            };
            apiClient.updateLoan(updatedLoanData).then((response: any) => {
                console.log('Server response: ', response);
                if (response.success) {
                    console.log('Loan updated!', response.data);
                    const updatedLoans = [...loans];
                    updatedLoans[selectedLoanIndex].wasReturned =
                        modalAction === 'return';
                    setLoans(updatedLoans);
                } else {
                    console.error('Error updating a loan:', response.statusCode);
                }
                handleModalClose();
            });
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
                    <div className="text">{t('loans_browse_admin')}</div>
                    <div className="underline"></div>
                </div>
                <div className="content">
                    <List
                        className="Loan-list"
                        sx={{
                            width: '100%',
                            maxWidth: 650,
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
                                <ListItemText
                                    primary={loan.book.title}
                                    secondary={`${t('rented_by')} ${loan.user.name}, ${t('from')} ${loan.startDate} ${t('to')} ${loan.endDate}`}
                                />
                                <Button
                                    variant="contained"
                                    color={loan.wasReturned ? 'secondary' : 'primary'}
                                    onClick={() =>
                                        handleReturnClick(
                                            index,
                                            loan.wasReturned ? 'undo' : 'return',
                                        )
                                    }
                                >
                                    {loan.wasReturned
                                        ? t('undo_return')
                                        : t('mark_as_returned')}
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </div>
                <Modal open={isModalOpen} onClose={handleModalClose}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            borderRadius: 3,
                            overflow: 'auto',
                            bgcolor: 'background.paper',
                            border: '3px solid #1648a4',
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <h2 className="modal-text">
                            {modalAction === 'return'
                                ? t('enter_return_date')
                                : t('confirm_undo_return')}
                        </h2>
                        {modalAction === 'return' ? (
                            <div className="modal-input">
                                <Input
                                    id="returnDate"
                                    name="returnDate"
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </div>
                        ) : (
                            <p> </p>
                        )}
                        <div className="modal-button">
                            <Button
                                onClick={handleReturnSubmit}
                                variant="outlined"
                                size="large"
                            >
                                {modalAction === 'return' ? t('submit') : t('yes')}
                            </Button>
                            <Button
                                onClick={handleModalClose}
                                variant="outlined"
                                size="large"
                            >
                                {modalAction === 'return' ? t('cancel') : t('no')}
                            </Button>
                        </div>
                    </Box>
                </Modal>
            </div>
        );
    };
    return <LoanList />;
}

export default AdminLoans;