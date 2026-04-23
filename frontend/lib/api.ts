import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<{ url: string }>('/upload', formData);
  return data.url;
}

export interface CreatePostPayload {
  petName: string;
  petType: 'cat' | 'dog' | 'other';
  breed?: string;
  gender: 'male' | 'female' | 'unknown';
  ageEstimate?: string;
  status: 'lost' | 'found' | 'adopted';
  lostDate: string;
  lostLocation: string;
  latitude: number;
  longitude: number;
  description?: string;
  phoneNumber: string;
  lineId?: string;
  facebook?: string;
  instagram?: string;
  posterName: string;
  images: { imageUrl: string; order: number }[];
}

export async function createPost(payload: CreatePostPayload) {
  const { data } = await api.post('/posts', payload);
  return data;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function setToken(token: string) {
  localStorage.setItem('access_token', token);
}

export function clearToken() {
  localStorage.removeItem('access_token');
}

export default api;
