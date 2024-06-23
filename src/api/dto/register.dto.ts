export class RegisterDto {
    name: string | undefined;
    username: string | undefined;
    password: string | undefined;
    role: string | undefined;
    email: string | undefined;
}

export class RegisterResponseDto {
    username: string | undefined;
    role: string | undefined;
}