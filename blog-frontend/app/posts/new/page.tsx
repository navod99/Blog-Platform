import PostEditor from '@/components/PostEditor';

export default function NewPostPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Create New Post</h1>
      <PostEditor />
    </div>
  );
}
