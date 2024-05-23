import React from 'react';
import './App.css';
import LoginForm from './components/login-form/LoginForm'
import BookList from './components/BookList';
import { BookInterface } from './interfaces/BookInterface';

const mockBooks: BookInterface[] = [
  {
    id: 1,
    isbn: '12345',
    title: 'Henryk Garncarz',
    author: 'Taki Jeden',
    publisher: 'PWR',
    publicationYear: 2020,
    availableCopies: 5,

  },

  {
    id: 2,
    isbn: '214372690',
    title: 'Historia Polski',
    author: 'Kamil Ślimak',
    publisher: 'Palindrom',
    publicationYear: 2019,
    availableCopies: 3,
  },
];

const App: React.FC = () => {
  return (
      <div>
        <LoginForm />
        <BookList books={mockBooks} />
      </div>
  );
};
export default App;
