export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    status: boolean;
    data?: firebase.default.User;
    code?: string;
}
