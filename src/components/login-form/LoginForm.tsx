import React, { useCallback, useMemo } from 'react';
import './LoginForm.css';
import { Button, TextField } from '@mui/material';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

function LoginForm() {
    const navigate = useNavigate();
    const onSubmit = useCallback(
        (values: { username: string; password: string }, formik:any) => {
            navigate('/home');
        },
        [navigate]
    );

    const validationSchema = useMemo(
        () =>
            yup.object().shape({
                username: yup.string().required('Pole nie może być puste!'),
                password: yup
                    .string()
                    .required('Pole nie może być puste!')
                    .min(5, 'Hasło nie może być krótsze niż 5 znaków!'),
            }),
        [],
    );

    return (
        <div className="Login-container">
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                validateOnChange
                validateOnBlur
            >
                {(formik: any) => (
                    <Form className="Login-form" id="signForm" noValidate onSubmit={formik.handleSubmit}>
                        <img src={logo} alt="Logo" className="Login-logo" />
                        <TextField
                            id="username"
                            name="username"
                            label="Nazwa użytkownika"
                            variant="standard"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.username && !!formik.errors.username}
                            helperText={formik.touched.username && formik.errors.username}
                        />
                        <TextField
                            id="password"
                            name="password"
                            label="Hasło"
                            variant="standard"
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && !!formik.errors.password}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <Button
                            variant="contained"
                            startIcon={<LoginIcon />}
                            type="submit"
                            form="signForm"
                            disabled={!(formik.isValid && formik.dirty)}
                        >
                            Zaloguj się
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default LoginForm;