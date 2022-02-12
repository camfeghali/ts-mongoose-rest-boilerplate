export interface CreateUserDto {
    id: string;
    email: string;
    firstName?: string;
    lastName: string;
    permissionLevel?: number;
}

