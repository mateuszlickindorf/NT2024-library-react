export class GetUserSimplifiedDto {
    name: string | undefined;
    email: string | undefined;
}

export class GetUserFullDto {
    id: number | undefined;
    name: string | undefined;
    username: string | undefined;
    email: string | undefined;
    role: string | undefined;
}