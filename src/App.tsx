import React from 'react';
import LoginForm from './components/login-form/LoginForm';
import {Routes, Route, Navigate, BrowserRouter} from 'react-router-dom';
import { BookInterface } from './interfaces/BookInterface';
import HomePage from "./components/home-page/HomePage";
import {LoanInterface} from "./interfaces/LoanInterface";
import BookList from "./components/book-list/BookList";
import LoanList from "./components/loan-list/LoanList";
import mockBooks from './mocks/mockBooks';
import mockLoans from './mocks/mockLoans';
import ApiProvider from "./api/ApiProvider";
import { I18nextProvider} from 'react-i18next';
import i18n from "i18next";


function App() {
    return (
        <BrowserRouter>
            <I18nextProvider i18n={i18n}>
                <ApiProvider>
                    <Routes>
                        <Route path="/home" element={<HomePage />}>
                            <Route path="books" element={<BookList books={mockBooks} />} />
                            <Route path="loans" element={<LoanList loans={mockLoans} />} />
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