import { Post } from "@/types";
import Image from "next/image";

interface PostContentProps {
  post: Post;
}

export default function PostContent({ post }: PostContentProps) {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

        <div className="flex items-center mb-6">
          {/* <Image
            src={
              post.author.avatar ||
              `https://ui-avatars.com/api/?name=${post.author.firstName}+${post.author.lastName}`
            }
            alt={`${post.author.firstName} ${post.author.lastName}`}
            width={300}
            height={300}
          /> */}
          <div className="ml-4">
            <p className="font-medium text-gray-900">
              {post.author.firstName} {post.author.lastName}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(
                post.publishedAt || post.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm text-primary-600 bg-primary-50 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {post.featuredImage && (
        <Image
          src={post.featuredImage}
          alt={post.title}
          width={300}
          height={300}
        />
      )}

      <div
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </>
  );
}
