import * as React from 'react';
import List from '@mui/material/List';
import './AdminUsers.css';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import {Box, Button, FormControl, FormHelperText, InputLabel, ListItem, MenuItem, Select, TextField, Tooltip,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Formik } from 'formik';
import Modal from '@mui/material/Modal';
import {useApi} from "../../../api/ApiProvider";

function AdminUsers() {
    const apiClient = useApi();
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(
        null,
    );

    const UserList = () => {
        const [users, setUsers] = useState<any[]>([]);

        useEffect(() => {
            apiClient.getUsers().then((response: any) => {
                if (response.success) {
                    console.log('Users displayed!', response.data);
                    setUsers(response.data);
                } else {
                    console.error('Error displaying users:', response.statusCode);
                }
            });
        }, []);

        const handleDeleteClick = (index: number) => {
            setSelectedUserIndex(index);
            setIsModalOpen(true);
        };

        const handleModalClose = () => {
            setIsModalOpen(false);
            setSelectedUserIndex(null);
        };

        const onSubmit = (
            values: {
                name: string;
                username: string;
                password: string;
                role: string;
                email: string;
            },
            { resetForm }: { resetForm: () => void },
        ) => {
            apiClient.registerUser(values).then((response: any) => {
                console.log(response);
                if (response.success) {
                    console.log('Form submitted!', values);
                    setUsers((prevUsers) => [...prevUsers, response.data]);
                    resetForm();
                } else {
                    console.error('Error submitting form:', response.statusCode);
                }
            });
        };

        const validationSchema = useMemo(
            () =>
                yup.object().shape({
                    name: yup.string().required(t('required_name')),
                    username: yup.string().required(t('required_username')),
                    password: yup.string().required(t('required_password')),
                    role: yup.string().required(t('required_role')),
                    email: yup.string().required(t('required_email')),
                }),
            [],
        );

        const checkRole = (role: any) => {
            if (role === 'ADMIN') {
                return '#711bae';
            } else {
                return '#1b54bf';
            }
        };

        const handleDeleteUser = () => {
            if (selectedUserIndex === null) return;
            const deletedUserId = users[selectedUserIndex].id;
            apiClient.deleteUser(deletedUserId).then((response: any) => {
                if (response.success) {
                    console.log('User deleted!', deletedUserId);
                    setUsers((prevUsers) =>
                        prevUsers.filter((user) => user.id !== deletedUserId),
                    );
                } else {
                    console.error('Error deleting the user:', response.statusCode);
                }
                handleModalClose();
            });
        };

        return (
            <div className="user-container">
                <div className="user-header">
                    <div className="user-text">{t('users_browse')}</div>
                    <div className="user-underline"></div>
                </div>
                <div className="user-content">
                    <List
                        sx={{
                            width: '100%',
                            maxWidth: 650,
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'auto',
                            maxHeight: 500,
                            '& ul': { padding: 0 },
                        }}
                        subheader={<li />}
                    >
                        {users.map((user, index) => (
                            <ListItem
                                key={index}
                                style={{
                                    width: '100%',
                                    maxWidth: 650,
                                }}
                            >
                                <Tooltip
                                    title={
                                        user.role === 'ADMIN' ? t('role_admin') : t('role_reader')
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            style={{
                                                background: checkRole(user.role),
                                            }}
                                        >
                                            <PersonIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                </Tooltip>
                                <ListItemText
                                    primary={user.name}
                                    secondary={`${user.username}: ${user.email}`}
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
                            <h2 className="modal-text">{t('confirm_deletion_question')}</h2>
                            <div className="modal-button">
                                <Button
                                    onClick={handleDeleteUser}
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
                    <Formik
                        initialValues={{
                            name: '',
                            username: '',
                            password: '',
                            role: '',
                            email: '',
                        }}
                        onSubmit={onSubmit}
                        validationSchema={validationSchema}
                        validateOnChange
                        validateOnBlur
                    >
                        {(formik) => (
                            <form
                                className="user-add-form"
                                id="addUserForm"
                                noValidate
                                onSubmit={formik.handleSubmit}
                            >
                                <TextField
                                    id="name"
                                    name="name"
                                    label={t('name')}
                                    variant="standard"
                                    type="string"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && !!formik.errors.name}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                                <TextField
                                    id="username"
                                    name="username"
                                    label={t('username')}
                                    variant="standard"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.username && !!formik.errors.username}
                                    helperText={formik.touched.username && formik.errors.username}
                                />
                                <TextField
                                    id="password"
                                    name="password"
                                    label={t('password')}
                                    variant="standard"
                                    type="password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && !!formik.errors.password}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                                <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                                    <InputLabel id="role-label">{t('role')}</InputLabel>
                                    <Select
                                        id="role"
                                        labelId="role-label"
                                        value={formik.values.role}
                                        name="role"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.role && !!formik.errors.role}
                                    >
                                        <MenuItem value="ROLE_ADMIN">{t('role_admin')}</MenuItem>
                                        <MenuItem value="ROLE_READER">{t('role_reader')}</MenuItem>
                                    </Select>
                                    {formik.touched.role && formik.errors.role && (
                                        <FormHelperText
                                            error={formik.touched.role && !!formik.errors.role}
                                        >
                                            {formik.errors.role}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <TextField
                                    id="email"
                                    name="email"
                                    label={t('email')}
                                    variant="standard"
                                    type="email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && !!formik.errors.email}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                                <Button
                                    size="large"
                                    variant="contained"
                                    type="submit"
                                    form="addUserForm"
                                >
                                    {t('user_add')}
                                </Button>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        );
    };
    return <UserList />;
}

export default AdminUsers;