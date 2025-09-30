'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { toggleLike } from '@/app/actions/posts';

interface PostInteractionsProps {
  postId: string;
  initialLiked: boolean;
  initialLikesCount: number;
  commentsCount: number;
}

export default function PostInteractions({
  postId,
  initialLiked,
  initialLikesCount,
  commentsCount,
}: PostInteractionsProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

const handleLike = async () => {
  try {
    const response = await toggleLike(postId);
    if (!response.success) {
      toast.error(response.error);
      if (response.error === "Please login to like posts") {
        router.push("/login");
      }
      return;
    }
    setLiked(response.liked);
    setLikesCount(response.likesCount);
  } catch (error) {
    toast.error("Failed to toggle like");
  }
};

  return (
    <div className="flex items-center gap-4 pb-8 border-b">
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          liked 
            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <span>{liked ? '❤️' : '🤍'}</span>
        <span>{likesCount}</span>
      </button>
      
      <div className="flex items-center gap-2 text-gray-600">
        <span>💬</span>
        <span>{commentsCount}</span>
      </div>
    </div>
  );
}