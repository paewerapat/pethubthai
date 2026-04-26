'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import { fetchMyPosts, updatePostStatus, deletePost, getToken, type Post } from '@/lib/api';
import { FiPlus, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import { STATUS_META } from '@/lib/utils';

export default function MyPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login?redirect=/my-posts');
      return;
    }
    fetchMyPosts()
      .then(setPosts)
      .catch(() => router.replace('/login?redirect=/my-posts'))
      .finally(() => setLoading(false));
  }, [router]);

  async function markFound(post: Post) {
    const next = post.status === 'lost' ? 'found' : 'lost';
    setActionId(post.id);
    try {
      const updated = await updatePostStatus(post.id, next);
      setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('ต้องการลบประกาศนี้ใช่ไหม?')) return;
    setActionId(id);
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setActionId(null);
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">โพสต์ของฉัน</h1>
            <p className="text-gray-500 mt-1">
              {loading ? 'กำลังโหลด...' : `${posts.length} ประกาศ`}
            </p>
          </div>
          <Link href="/post/create" className="btn-primary text-base">
            <FiPlus className="w-5 h-5" />
            <span>โพสต์ใหม่</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-2 bg-white">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">ยังไม่มีประกาศ</h3>
            <p className="text-gray-400 mb-6">เริ่มโพสต์ตามหาน้องของคุณได้เลย</p>
            <Link href="/post/create" className="btn-primary">
              <FiPlus className="w-5 h-5" />
              <span>โพสต์ตามหาน้อง</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="relative">
                <PostCard post={post} />

                {/* Action bar */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => markFound(post)}
                    disabled={actionId === post.id}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border-2 transition-all disabled:opacity-50 ${
                      post.status === 'found'
                        ? 'border-[#5fca9f] bg-[#5fca9f]/10 text-[#4db889]'
                        : 'border-gray-200 text-gray-600 hover:border-[#5fca9f] hover:text-[#5fca9f]'
                    }`}
                  >
                    <FiCheckCircle className="w-4 h-4" />
                    {post.status === 'found' ? 'พบแล้ว ✓' : 'ทำเครื่องหมายพบแล้ว'}
                  </button>

                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={actionId === post.id}
                    className="p-2.5 rounded-xl border-2 border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
