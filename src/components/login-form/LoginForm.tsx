import React, { useCallback, useMemo } from 'react';
import './LoginForm.css';
import { Button, TextField } from '@mui/material';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import {useApi} from "../../api/ApiProvider";
import {useTranslation} from "react-i18next";

function LoginForm() {
    const navigate = useNavigate();
    const apiClient = useApi();
    const {t, i18n} = useTranslation();

    // get id of the user currently logging in
    const getUserDetails = () => {
        apiClient.getMe().then((response: any) => {
            if (response.success) {
                localStorage.setItem('userId', response.data.id);
            } else {
                return null;
            }
        });
    };

    const onSubmit = useCallback(
        (values: { username: string; password: string }, formik:any) => {
            apiClient.login(values).then((response) => {
                console.log(response);
                if (response.success) {
                    getUserDetails();
                    if (localStorage.getItem('userRole') === 'ROLE_ADMIN') {
                        navigate('/admin_menu');
                    } else {
                        navigate('/reader_menu');
                    }
                } else {
                    formik.setFieldError('username', t('invalid_username_or_password'));
                }
            });
        },
        [apiClient, navigate]
    );

    const validationSchema = useMemo(
        () =>
            yup.object().shape({
                username: yup.string().required('Pole nie może być puste!'),
                password: yup
                    .string()
                    .required(t('required_password'))
                    .min(5, t('password_requirements')),
            }),
        [],
    );

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang); // Store selected language
  };

    return (
      <div className="Login-container">
        <div className="language-buttons">
          <Button variant="contained" onClick={() => changeLanguage('en')}>
            EN
          </Button>
          <Button variant="contained" onClick={() => changeLanguage('pl')}>
            PL
          </Button>
        </div>
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
                label={t('username')}
                variant="standard"
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
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                type="submit"
                form="signForm"
                disabled={!(formik.isValid && formik.dirty)}
              >
                {t('login')}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    );
}

export default LoginForm;