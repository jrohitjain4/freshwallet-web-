import axios, { AxiosError } from 'axios';
import { getToken, clearSession } from './auth';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message?: string }>) => {
    if (err.response?.status === 401) {
      clearSession();
    }
    let message = err.response?.data?.message || err.message || 'Request failed';
    if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
      message = 'Server se connect nahi ho pa raha. API chalu hai? (port 5000)';
    }
    return Promise.reject(new Error(message));
  }
);

export async function apiGet<T>(path: string): Promise<T> {
  const { data } = await api.get<{ success: boolean; data: T }>(path);
  return data.data;
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const { data } = await api.post<{ success: boolean; data: T }>(path, body);
  return data.data;
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const { data } = await api.patch<{ success: boolean; data: T }>(path, body);
  return data.data;
}

export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const { data } = await api.post<{ success: boolean; data: T }>(path, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}
