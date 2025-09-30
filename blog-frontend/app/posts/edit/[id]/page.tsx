import PostEditor from '@/components/PostEditor';
import { notFound } from 'next/navigation';

async function getPost(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  return data.data;
}

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const searchParams = await params;
  const post = await getPost(searchParams.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <PostEditor initialData={post} postId={params.id} />
    </div>
  );
}