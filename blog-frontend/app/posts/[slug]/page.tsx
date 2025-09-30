import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import PostPage from '@/app/PostPage';

async function getPost(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/slug/${slug}`, {
    cache: 'no-store',
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
      `${process.env.NEXT_PUBLIC_API_URL}/likes/check/${postId}?targetType=post`,
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