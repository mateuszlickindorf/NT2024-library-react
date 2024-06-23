import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import LoginForm from './components/login-form/LoginForm';
import HomePage from './components/home-page/HomePage';
import BookList from './components/book-list/BookList';
import LoanList from './components/loan-list/LoanList';
import ApiProvider from './api/ApiProvider';
import mockLoans from "./mocks/mockLoans";

function App() {
    return (
        <BrowserRouter>
            <I18nextProvider i18n={i18n}>
                <ApiProvider>
                    <Routes>
                        <Route path="/home" element={<HomePage />}>
                            <Route path="books" element={<BookList />} />
                            <Route path="loans" element={<LoanList loans={mockLoans} />} /> {/* Assuming LoanList will also fetch its data */}
                        </Route>
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="*" element={<h1>404</h1>} />
                    </Routes>
                </ApiProvider>
            </I18nextProvider>
        </BrowserRouter>
    );
}

export default App;