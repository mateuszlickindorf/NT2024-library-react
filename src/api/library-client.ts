import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import {
    CreateBookDto,
    CreateBookResponseDto,
    EditBookDto,
    GetBookDto,
} from './dto/book.dto';
import {
    CreateLoanDto,
    CreateLoanResponseDto,
    GetLoanDto,
    UpdateLoanDto,
    UpdateLoanResponseDto,
} from './dto/loan.dto';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from './security/token.payload';
import { GetUserFullDto } from './dto/user.dto';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import {
    CreateReviewDto,
    CreateReviewResponseDto,
    EditReviewDto,
    EditReviewResponseDto,
    GetReviewDto,
} from './dto/review.dto';

export type ClientResponse<T> = {
    success: boolean;
    data: T;
    statusCode: number;
};

export class LibraryClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: 'http://localhost:8080/api',
        });

        this.client.interceptors.response.use(
          (response) => {
              return response;
          },
          (error) => {
              if (error.response && error.response.status === 403) {
                  localStorage.removeItem('authToken');
                  window.location.href = '/login';
              }
              return Promise.reject(error);
          },
        );

        const token = localStorage.getItem('authToken'); // get a token if a page is reloaded
        if (token) {
            this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }

    public async login(
      data: LoginDto,
    ): Promise<ClientResponse<LoginResponseDto | null>> {
        try {
            const response: AxiosResponse<LoginResponseDto> = await this.client.post(
              '/auth/login',
              data,
            );
            const token = response.data.token;
            if (typeof token === 'string') {
                localStorage.setItem('authToken', token); // store a token in case a page is reloaded
            }
            this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            if (token) {
                try {
                    const decoded: TokenPayload = jwtDecode<TokenPayload>(token);
                    localStorage.setItem('userRole', decoded.role as string);
                } catch (error) {
                    console.error('Invalid token:', error);
                }
            }
            return {
                success: true,
                data: response.data,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;

            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async registerUser(
      data: RegisterDto,
    ): Promise<ClientResponse<RegisterResponseDto | null>> {
        try {
            const response: AxiosResponse<RegisterResponseDto> =
              await this.client.post('/auth/register', data);
            return {
                success: true,
                data: response.data,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;

            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async addBook(
      data: CreateBookDto,
    ): Promise<ClientResponse<CreateBookResponseDto | null>> {
        try {
            const response: AxiosResponse<CreateBookResponseDto> =
              await this.client.post('/books/add', data);
            return {
                success: true,
                data: response.data,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;

            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async getBooks(): Promise<ClientResponse<GetBookDto | null>> {
        try {
            const response: AxiosResponse<GetBookDto> =
              await this.client.get('/books/get');
            return {
                success: true,
                data: response.data,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;
            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async getBookById(
      id: number,
    ): Promise<ClientResponse<GetBookDto | null>> {
        try {
            const response: AxiosResponse<GetBookDto> = await this.client.get(
              `/books/${id}`,
            );
            return {
                success: true,
                data: response.data,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;
            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async deleteBook(id: number): Promise<ClientResponse<null>> {
        try {
            const response: AxiosResponse<null> = await this.client.delete(
              `/books/${id}`,
            );
            return {
                success: true,
                data: null,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;
            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async getLoans(): Promise<ClientResponse<GetLoanDto | null>> {
        try {
            const response: AxiosResponse<GetLoanDto> =
              await this.client.get('/loans/get');
            return {
                success: true,
                data: response.data,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;
            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async getLoansByUserId(
      id: number,
    ): Promise<ClientResponse<GetLoanDto | null>> {
        try {
            const response: AxiosResponse<GetLoanDto> = await this.client.get(
              `/loans/get?userId=${id}`,
            );
            return {
                success: true,
                data: response.data,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;
            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async addLoan(
      data: CreateLoanDto,
    ): Promise<ClientResponse<CreateLoanResponseDto | null>> {
        try {
            const response: AxiosResponse<CreateLoanResponseDto> =
              await this.client.post('/loans/add', data);
            return {
                success: true,
                data: response.data,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;

            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async getMe(): Promise<ClientResponse<GetUserFullDto | null>> {
        try {
            const response: AxiosResponse<GetUserFullDto> =
              await this.client.get('/users/get/me');
            return {
                success: true,
                data: response.data,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;
            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async getUsers(): Promise<ClientResponse<GetUserFullDto | null>> {
        try {
            const response: AxiosResponse<GetUserFullDto> =
              await this.client.get('/users/get');
            return {
                success: true,
                data: response.data,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;
            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async updateLoan(
      data: UpdateLoanDto,
    ): Promise<ClientResponse<UpdateLoanResponseDto | null>> {
        try {
            console.log(data);
            const response: AxiosResponse<UpdateLoanResponseDto> =
              await this.client.patch('/loans/update', data);
            return {
                success: true,
                data: response.data,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;

            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async deleteUser(id: number): Promise<ClientResponse<null>> {
        try {
            const response: AxiosResponse<null> = await this.client.delete(
              `/users/${id}`,
            );
            return {
                success: true,
                data: null,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;
            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async getReviews(): Promise<ClientResponse<GetReviewDto | null>> {
        try {
            const response: AxiosResponse<GetReviewDto> =
              await this.client.get('/reviews/get');
            return {
                success: true,
                data: response.data,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;
            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async getReviewsByUser(
      id: number,
    ): Promise<ClientResponse<GetReviewDto | null>> {
        try {
            const response: AxiosResponse<GetReviewDto> = await this.client.get(
              `/reviews/get?userId=${id}`,
            );
            return {
                success: true,
                data: response.data,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;
            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async getReviewsByBook(
      id: number,
    ): Promise<ClientResponse<GetReviewDto | null>> {
        try {
            const response: AxiosResponse<GetReviewDto> = await this.client.get(
              `/reviews/get?bookId=${id}`,
            );
            return {
                success: true,
                data: response.data,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;
            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async addReview(
      data: CreateReviewDto,
    ): Promise<ClientResponse<CreateReviewResponseDto | null>> {
        try {
            const response: AxiosResponse<CreateReviewResponseDto> =
              await this.client.post('/reviews/add', data);
            return {
                success: true,
                data: response.data,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;

            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async deleteReview(id: number): Promise<ClientResponse<null>> {
        try {
            const response: AxiosResponse<null> = await this.client.delete(
              `/reviews/${id}`,
            );
            return {
                success: true,
                data: null,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;
            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async editReview(
      data: EditReviewDto,
    ): Promise<ClientResponse<EditReviewResponseDto | null>> {
        try {
            console.log(data);
            const response: AxiosResponse<EditReviewResponseDto> =
              await this.client.patch('/reviews/edit', data);
            return {
                success: true,
                data: response.data,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;

            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }

    public async editBook(
      data: EditBookDto,
    ): Promise<ClientResponse<GetBookDto | null>> {
        try {
            console.log(data);
            const response: AxiosResponse<GetBookDto> = await this.client.patch(
              '/books/edit',
              data,
            );
            return {
                success: true,
                data: response.data,
                statusCode: response.status,
            };
        } catch (error) {
            const AxiosError = error as AxiosError<Error>;

            return {
                success: false,
                data: null,
                statusCode: AxiosError.response?.status || 0,
            };
        }
    }
}