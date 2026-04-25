import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          localStorage.setItem('beway_token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          return data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Login failed', isLoading: false });
          throw err;
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/register', payload);
          localStorage.setItem('beway_token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          return data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Registration failed', isLoading: false });
          throw err;
        }
      },

      logout: () => {
        localStorage.removeItem('beway_token');
        set({ user: null, token: null });
      },

      refreshUser: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data });
        } catch {
          get().logout();
        }
      },

      updateUser: (userData) => set({ user: { ...get().user, ...userData } }),
    }),
    { name: 'beway-auth', partialize: (state) => ({ user: state.user, token: state.token }) }
  )
);

export default useAuthStore;
