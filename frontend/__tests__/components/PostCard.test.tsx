import React from 'react';
import { render, screen } from '@testing-library/react';
import PostCard from '@/components/PostCard';
import type { Post } from '@/lib/api';

jest.mock('next/link', () => {
  const Link = ({ href, children }: any) => <a href={href}>{children}</a>;
  Link.displayName = 'Link';
  return Link;
});

const basePost: Post = {
  id: 'post-1',
  petName: 'โกลด์',
  petType: 'dog',
  gender: 'male',
  status: 'lost',
  lostDate: new Date().toISOString(),
  lostLocation: 'บางนา กรุงเทพฯ',
  latitude: 13.68,
  longitude: 100.61,
  phoneNumber: '0812345678',
  posterName: 'เจ้าของ',
  userId: 'user-1',
  images: [],
  createdAt: new Date(Date.now() - 3_600_000).toISOString(), // 1 hour ago
  updatedAt: new Date().toISOString(),
};

describe('PostCard', () => {
  it('renders pet name', () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText('โกลด์')).toBeInTheDocument();
  });

  it('renders location', () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText('บางนา กรุงเทพฯ')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText('หาย')).toBeInTheDocument();
  });

  it('renders pet type label', () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText(/สุนัข/)).toBeInTheDocument();
  });

  it('links to the correct post detail page', () => {
    render(<PostCard post={basePost} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/post/post-1');
  });

  it('shows emoji placeholder when no images', () => {
    render(<PostCard post={{ ...basePost, images: [] }} />);
    expect(screen.getByText('🐶')).toBeInTheDocument();
  });

  it('renders image when images are present', () => {
    const postWithImage: Post = {
      ...basePost,
      images: [{ id: 'img-1', imageUrl: 'https://example.com/dog.jpg', order: 0 }],
    };
    render(<PostCard post={postWithImage} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/dog.jpg');
    expect(img).toHaveAttribute('alt', 'โกลด์');
  });

  it('renders cat post correctly', () => {
    render(<PostCard post={{ ...basePost, petType: 'cat', petName: 'มิ้ว' }} />);
    expect(screen.getByText('มิ้ว')).toBeInTheDocument();
    expect(screen.getByText(/แมว/)).toBeInTheDocument();
  });

  it('renders "found" status badge', () => {
    render(<PostCard post={{ ...basePost, status: 'found' }} />);
    expect(screen.getByText('พบแล้ว')).toBeInTheDocument();
  });

  it('renders "adopted" status badge', () => {
    render(<PostCard post={{ ...basePost, status: 'adopted' }} />);
    expect(screen.getByText('รับเลี้ยง')).toBeInTheDocument();
  });

  it('renders relative time', () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText('1 ชั่วโมงที่แล้ว')).toBeInTheDocument();
  });
});
