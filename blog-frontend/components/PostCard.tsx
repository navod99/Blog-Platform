import Link from 'next/link';
import { Post } from '@/types';
import Image from 'next/image';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.featuredImage && (
        // <img
        //   src={post.featuredImage}
        //   alt={post.title}
        //   className="w-full h-48 object-cover"
        // />
        <Image
          src={post.featuredImage}
          alt={post.title}
          width={300}
          height={300}
        />
      )}
      <div className="p-6">
        <div className="flex items-center mb-2">
          <span className="text-sm text-gray-500">
            By {post.author.firstName} {post.author.lastName}
          </span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-500">
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <Link href={`/posts/${post.slug}`}>
          <h2 className="text-xl font-bold text-gray-900 hover:text-primary-600 mb-2">
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="text-gray-600 mb-4">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>❤️ {post.likesCount}</span>
            <span>💬 {post.commentsCount}</span>
          </div>
        </div>
      </div>
    </article>
  );
}