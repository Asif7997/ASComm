import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true, // important for Sanctum cookies
});

export const signup = (data: any) => api.post('/register', data).then(res => res.data);
export const login = (email: string, password: string) => api.post('/login', { email, password }).then(res => res.data);
export const logout = () => api.post('/logout').then(res => res.data);
export const getUser = () => api.get('/user').then(res => res.data);
