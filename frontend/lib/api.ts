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

export interface PostImage {
  id: string;
  imageUrl: string;
  order: number;
}

export interface Post {
  id: string;
  petName: string;
  petType: 'cat' | 'dog' | 'other';
  breed?: string;
  gender: 'male' | 'female' | 'unknown';
  ageEstimate?: string;
  status: 'lost' | 'found' | 'adopted' | 'available';
  lostDate: string;
  lostLocation: string;
  latitude: number;
  longitude: number;
  description?: string;
  phoneNumber: string;
  lineId?: string;
  facebook?: string;
  instagram?: string;
  category: 'lost' | 'adoption';
  posterName: string;
  viewCount: number;
  hasReward: boolean;
  rewardAmount?: string;
  userId: string;
  images: PostImage[];
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  data: Post[];
  total: number;
  page: number;
  limit: number;
}

export async function fetchPosts(params?: {
  page?: number;
  limit?: number;
  status?: string;
  petType?: string;
  province?: string;
  amphoe?: string;
  tambon?: string;
  category?: string;
}): Promise<PostsResponse> {
  const { data } = await api.get('/posts', { params });
  return data;
}

export async function fetchPost(id: string): Promise<Post> {
  const { data } = await api.get(`/posts/${id}`);
  return data;
}

export async function fetchMyPosts(): Promise<Post[]> {
  const { data } = await api.get('/posts/my-posts');
  return data;
}

export async function updatePostStatus(id: string, status: 'lost' | 'found' | 'adopted') {
  const { data } = await api.patch(`/posts/${id}`, { status });
  return data;
}

export async function updatePost(id: string, payload: Partial<CreatePostPayload>) {
  const { data } = await api.patch(`/posts/${id}`, payload);
  return data;
}

export async function trackPostView(id: string) {
  await api.post(`/posts/${id}/view`).catch(() => {});
}

export async function deletePost(id: string) {
  await api.delete(`/posts/${id}`);
}

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
  status: 'lost' | 'found' | 'adopted' | 'available';
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
  category?: 'lost' | 'adoption';
  hasReward?: boolean;
  rewardAmount?: string;
  images: { imageUrl: string; order: number }[];
}

export async function createPost(payload: CreatePostPayload) {
  const { data } = await api.post('/posts', payload);
  return data;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export async function login(email: string, password: string): Promise<{ user: AuthUser; access_token: string }> {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function register(name: string, email: string, password: string): Promise<{ user: AuthUser; access_token: string }> {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data;
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await api.get('/auth/me');
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
