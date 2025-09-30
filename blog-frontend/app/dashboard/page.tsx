import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Dashboard from '@/app/Dashboard';
import { Post, User } from '@/types';

async function getUserPosts(filter: string = 'all') {
  const token = (await cookies()).get('accessToken')?.value;

  if (!token) {
    redirect('/login');
  }

  // Fetch user profile to get user ID
  const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!profileRes.ok) {
    redirect('/login');
  }

  const profileData: User = await profileRes.json();
  const userId = profileData.id;

  // Fetch user's posts
  const params = new URLSearchParams({ page: '1', limit: '100' });
  if (filter !== 'all') params.append('status', filter);

  const postsRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/author/${userId}?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  );

  if (!postsRes.ok) {
    return { posts: [], user: profileData };
  }

  const postsData = await postsRes.json();
  return {
    posts: postsData.posts || [],
    user: profileData,
  };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { posts, user } : {posts: Post[], user:User} = await getUserPosts(resolvedSearchParams.filter);

  // Calculate stats
  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p: Post) => p.status === 'published').length,
    draftPosts: posts.filter((p: Post) => p.status === 'draft').length,
    totalLikes: posts.reduce((sum: number, p: Post) => sum + p.likesCount, 0),
    totalComments: posts.reduce((sum: number, p: Post) => sum + p.commentsCount, 0),
  };

  return (
    <Dashboard
      posts={posts}
      user={user}
      stats={stats}
      currentFilter={resolvedSearchParams.filter}
    />
  );
}