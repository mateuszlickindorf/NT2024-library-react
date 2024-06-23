import React from 'react';
import './App.css';
import LoginForm from './components/login-form/LoginForm';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ApiProvider from './api/ApiProvider';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import RequireAuthReader from './auth-config/RequireAuthReader';
import RequireAuthAdmin from './auth-config/RequireAuthAdmin';
import HomePage from "./components/home-page/HomePage";

function App() {
    return (
        <BrowserRouter>
            <I18nextProvider i18n={i18n}>
                <ApiProvider>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route
                            path="/menu"
                            element={
                                <RequireAuthAdmin>
                                    <HomePage/>{' '}
                                </RequireAuthAdmin>
                            }
                        />
                    </Routes>
                </ApiProvider>
            </I18nextProvider>
        </BrowserRouter>
    );
}

export default App;