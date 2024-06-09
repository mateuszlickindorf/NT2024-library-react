import React from 'react';
import LoginForm from './components/login-form/LoginForm';
import {Routes, Route, Navigate} from 'react-router-dom';
import { BookInterface } from './interfaces/BookInterface';
import HomePage from "./components/home-page/HomePage";
import {LoanInterface} from "./interfaces/LoanInterface";
import BookList from "./components/book-list/BookList";
import LoanList from "./components/loan-list/LoanList";
import mockBooks from './mocks/mockBooks';
import mockLoans from './mocks/mockLoans';

function App() {
    return (
        <Routes>
            <Route path="/home" element={<HomePage />}>
                <Route path="books" element={<BookList books={mockBooks} />} />
                <Route path="loans" element={<LoanList loans={mockLoans} />} />
            </Route>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<h1>404</h1>} />
        </Routes>
    );
}

export default App;