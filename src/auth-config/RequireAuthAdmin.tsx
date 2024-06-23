import React, { FC, useEffect } from 'react';
import LoginForm from '../components/login-form/LoginForm';
import { useNavigate } from 'react-router-dom';

const RequireAuthAdmin: FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (
            localStorage.getItem('authToken') === null ||
            localStorage.getItem('userRole') === 'ROLE_READER'
        ) {
            navigate('/');
        }
    }, [navigate]);

    if (
        localStorage.getItem('authToken') === null ||
        localStorage.getItem('userRole') === 'ROLE_READER'
    ) {
        localStorage.clear();
        return <LoginForm />;
    }

    return <>{children}</>;
};

export default RequireAuthAdmin;