import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SocialLoginButtons from '@/components/SocialLoginButtons';

const API_URL = 'http://localhost:3001/api';

describe('SocialLoginButtons', () => {
  beforeEach(() => {
    localStorage.clear();
    // jsdom doesn't support location.href assignment — replace with a plain object
    Reflect.defineProperty(window, 'location', {
      configurable: true,
      value: new Proxy(window.location, {
        set(target: any, prop, value) {
          target[prop] = value;
          return true;
        },
      }),
    });
  });

  it('renders Google login button', () => {
    render(<SocialLoginButtons />);
    expect(screen.getByText(/Google/i)).toBeInTheDocument();
  });

  it('renders Facebook login button', () => {
    render(<SocialLoginButtons />);
    expect(screen.getByText(/Facebook/i)).toBeInTheDocument();
  });

  it('renders two buttons total', () => {
    render(<SocialLoginButtons />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('stores redirect="/post/create" in localStorage when Google is clicked', () => {
    render(<SocialLoginButtons redirect="/post/create" />);
    fireEvent.click(screen.getByText(/Google/i));
    expect(localStorage.getItem('oauth_redirect')).toBe('/post/create');
  });

  it('stores redirect="/post/create" in localStorage when Facebook is clicked', () => {
    render(<SocialLoginButtons redirect="/post/create" />);
    fireEvent.click(screen.getByText(/Facebook/i));
    expect(localStorage.getItem('oauth_redirect')).toBe('/post/create');
  });

  it('uses "/" as default redirect when no redirect prop is given', () => {
    render(<SocialLoginButtons />);
    fireEvent.click(screen.getByText(/Google/i));
    expect(localStorage.getItem('oauth_redirect')).toBe('/');
  });

  // window.location.href navigation ทดสอบผ่าน E2E test (Playwright) เท่านั้น
  // jsdom ไม่รองรับ actual navigation
});
