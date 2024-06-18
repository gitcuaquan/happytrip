export interface User {
    phone: string;
    password: string;
}
export interface AuthResponse {
    accessToken: string;
    fullName: string;
    id: string;
    phone: string;
    tokenType: string;
    transportType: string;
}
export class AuthService {
    constructor() {}

    async login(role: string, user: User) {
        const token = await $fetch<AuthResponse>(`${BASE_URL}/${role}/login`, {
            method: 'POST',
            body: user
        })
        return token
    }
}