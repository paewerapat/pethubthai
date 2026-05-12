/**
 * Tests for token management functions in lib/api.ts
 * Axios calls are tested via integration; we unit-test token utilities here.
 */
import { getToken, setToken, clearToken } from '@/lib/api';

describe('Token management', () => {
  beforeEach(() => localStorage.clear());

  describe('setToken', () => {
    it('stores the token in localStorage', () => {
      setToken('my.jwt.token');
      expect(localStorage.getItem('access_token')).toBe('my.jwt.token');
    });
  });

  describe('getToken', () => {
    it('returns null when no token is stored', () => {
      expect(getToken()).toBeNull();
    });

    it('returns the stored token', () => {
      localStorage.setItem('access_token', 'stored.token');
      expect(getToken()).toBe('stored.token');
    });
  });

  describe('clearToken', () => {
    it('removes the token from localStorage', () => {
      localStorage.setItem('access_token', 'some.token');
      clearToken();
      expect(localStorage.getItem('access_token')).toBeNull();
    });

    it('does not throw when no token exists', () => {
      expect(() => clearToken()).not.toThrow();
    });
  });

  describe('token lifecycle', () => {
    it('set → get → clear lifecycle works correctly', () => {
      setToken('lifecycle.token');
      expect(getToken()).toBe('lifecycle.token');

      clearToken();
      expect(getToken()).toBeNull();
    });

    it('overwrites previous token on second setToken call', () => {
      setToken('first.token');
      setToken('second.token');
      expect(getToken()).toBe('second.token');
    });
  });
});
