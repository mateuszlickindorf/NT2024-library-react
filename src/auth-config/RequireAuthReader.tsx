import React, { FC, useEffect } from 'react';
import LoginForm from '../components/login-form/LoginForm';
import { useNavigate } from 'react-router-dom';

const RequireAuthReader: FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (
            localStorage.getItem('authToken') === null ||
            localStorage.getItem('userRole') === 'ROLE_ADMIN'
        ) {
            navigate('/');
        }
    }, [navigate]);

    if (
        localStorage.getItem('authToken') === null ||
        localStorage.getItem('userRole') === 'ROLE_ADMIN'
    ) {
        localStorage.clear();
        return <LoginForm />;
    }
    return <>{children}</>;
};

export default RequireAuthReader;