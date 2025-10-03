import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import PostPage from '@/app/PostPage';
import { PaginatedResponse, Post } from '@/types';

async function getAllPosts(page: string = "1"): Promise<PaginatedResponse<Post>> {
  const res = await fetch(
    `${process.env.API_URL}/posts?page=${page}&limit=100`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

async function getPost(slug: string) {
  const res = await fetch(`${process.env.API_URL}/posts/slug/${slug}`, {
    cache: 'force-cache',
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  return data;
}

async function checkIfLiked(postId: string) {
  const token = (await cookies()).get('accessToken')?.value;

  if (!token) return false;

  try {
    const res = await fetch(
      `${process.env.API_URL}/likes/check/${postId}?targetType=post`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) return false;

    const data = await res.json();
    return data;
  } catch {
    return false;
  }
}

export default async function PostDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  const isLiked = await checkIfLiked(post._id);

  return (
    <PostPage
      post={post}
      isLiked={isLiked}
      postId={post._id}
      initialLikesCount={post.likesCount}
      commentsCount={post.commentsCount}
    />
  );
}

export async function generateStaticParams() {
  const data = await getAllPosts()
  const posts = data.posts || [];
  return posts.map((post) => ({
    slug: post.slug,
  }));
}