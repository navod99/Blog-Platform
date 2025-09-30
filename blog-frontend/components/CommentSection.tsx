import { cookies } from 'next/headers';
import CommentsList from '@/components/CommentsList';
import CommentForm from '@/components/CommentForm';

async function getComments(postId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/comments/post/${postId}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.comments || [];
}

async function checkAuth() {
  const token = (await cookies()).get('accessToken')?.value;
  return !!token;
}

export default async function CommentSection({ postId }: { postId: string }) {
  const [comments, isAuthenticated] = await Promise.all([
    getComments(postId),
    checkAuth(),
  ]);

  return (
    <section className="mt-12 pt-8">
      <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
      
      {isAuthenticated ? (
        <CommentForm postId={postId} />
      ) : (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg text-center">
          <p>
            Please{' '}
            <a href="/login" className="text-primary-600 hover:underline">
              login
            </a>{' '}
            to comment
          </p>
        </div>
      )}

      <CommentsList initialComments={comments} postId={postId} />
    </section>
  );
}