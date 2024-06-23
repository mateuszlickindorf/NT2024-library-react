import React from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ApiProvider from './api/ApiProvider';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import RequireAuthAdmin from "./auth-config/RequireAuthAdmin";
import AdminBooks from "./components/admin/books/AdminBooks";
import LoginForm from "./components/login-form/LoginForm";
import AdminMenu from "./components/admin/menu/AdminMenu";
import AdminLoans from "./components/admin/loans/AdminLoans";
import AdminReviews from "./components/admin/reviews/AdminReviews";
import AdminUsers from "./components/admin/users/AdminUsers";

function App() {
    return (
        <BrowserRouter>
            <I18nextProvider i18n={i18n}>
                <ApiProvider>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route
                            path="/admin_books"
                            element={
                                <RequireAuthAdmin>
                                    {' '}
                                    <AdminBooks />{' '}
                                </RequireAuthAdmin>
                            }
                        />
                        <Route
                            path="/admin_menu"
                            element={
                                <RequireAuthAdmin>
                                    {' '}
                                    <AdminMenu />{' '}
                                </RequireAuthAdmin>
                            }
                        />
                        <Route
                            path="/admin_loans"
                            element={
                                <RequireAuthAdmin>
                                    {' '}
                                    <AdminLoans />{' '}
                                </RequireAuthAdmin>
                            }
                        />
                        <Route
                            path="/admin_users"
                            element={
                                <RequireAuthAdmin>
                                    {' '}
                                    <AdminUsers />{' '}
                                </RequireAuthAdmin>
                            }
                        />
                        <Route
                            path="/admin_reviews"
                            element={
                                <RequireAuthAdmin>
                                    {' '}
                                    <AdminReviews />{' '}
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