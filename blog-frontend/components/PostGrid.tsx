'use client';

import { Post } from '@/types';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';

interface PostGridProps {
  posts: Post[];
  currentPage: number;
  totalPages: number;
}

export default function PostGrid({ posts, currentPage, totalPages }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No posts found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}
    </>
  );
}