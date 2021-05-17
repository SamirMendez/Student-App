export interface RegisterData {
    name: string;
    email: string;
    password: string;
}
export interface AuthResponse {
    status: boolean;
    data?: firebase.default.User;
    code?: string;
}
export interface LoginData {
    email: string;
    password: string;
}
