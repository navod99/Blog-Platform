import Link from 'next/link';
import DashboardStats from '@/components/DashboardStats';
import PostsTable from '@/components/PostsTable';
import { Post, User } from '@/types';

interface DashboardProps {
  posts: Post[];
  user: User;
  stats: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalLikes: number;
    totalComments: number;
  };
  currentFilter: string | undefined;
}

export default function Dashboard({ posts, user, stats, currentFilter }: DashboardProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.firstName}!</p>
      </div>

      <DashboardStats stats={stats} />

      <div className="flex justify-between items-center mb-6">
        <DashboardFilter currentFilter={currentFilter} />

        <Link
          href="/posts/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Create New Post
        </Link>
      </div>
      <PostsTable posts={posts} />
    </div>
  );
}

function DashboardFilter({ currentFilter = 'all' }: { currentFilter?: string }) {
  return (
    <div className="flex gap-2">
      <Link
        href="/dashboard"
        className={`px-4 py-2 rounded-lg ${
          currentFilter === 'all'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        All Posts
      </Link>
      <Link
        href="/dashboard?filter=published"
        className={`px-4 py-2 rounded-lg ${
          currentFilter === 'published'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Published
      </Link>
      <Link
        href="/dashboard?filter=draft"
        className={`px-4 py-2 rounded-lg ${
          currentFilter === 'draft'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Drafts
      </Link>
    </div>
  );
}