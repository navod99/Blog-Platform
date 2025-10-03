import { Suspense } from 'react';
import PostContent from '@/components/PostContent';
import PostInteractions from '@/components/PostInteractions';
import CommentSection from '@/components/CommentSection';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Post } from '@/types';

interface PostPageProps {
  post: Post;
  isLiked: boolean;
  postId: string;
  initialLikesCount: number;
  commentsCount: number;
}

export default function PostPage({
  post,
  isLiked,
  postId,
  initialLikesCount,
  commentsCount,
}: PostPageProps) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <PostContent post={post} />
      <PostInteractions
        postId={postId}
        initialLiked={isLiked}
        initialLikesCount={initialLikesCount}
        commentsCount={commentsCount}
      />
      <Suspense fallback={<LoadingSpinner />}>
        <CommentSection postId={postId} postSlug={post.slug} />
      </Suspense>
    </article>
  );
}