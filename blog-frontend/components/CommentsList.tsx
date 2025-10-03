'use client';

import { useEffect, useState } from 'react';
import { Comment } from '@/types';
import CommentItem from '@/components/CommentItem';

interface CommentsListProps {
  initialComments: Comment[];
  postId: string;
  postSlug: string;
}

export default function CommentsList({ initialComments, postId, postSlug }: CommentsListProps) {
  const [comments, setComments] = useState(initialComments);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleDelete = (commentId: string) => {
    setComments(comments.filter(c => c._id !== commentId));
  };

  if (comments.length === 0) {
    return <p className="text-gray-500">No comments yet. Be the first to comment!</p>;
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          postId={postId}
          onDelete={handleDelete}
          postSlug={postSlug}
        />
      ))}
    </div>
  );
}