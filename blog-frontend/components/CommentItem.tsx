'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Comment } from '@/types';
import { useAuthStore } from '@/store/authStore';
import CommentForm from './CommentForm';
import { toggleCommentLike, deleteComment } from '@/app/actions/comments';
import toast from 'react-hot-toast';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  postSlug?: string;
  initialLiked?: boolean;
  onDelete: (commentId: string) => void;
  depth?: number;
}

export default function CommentItem({ 
  comment, 
  postId,
  postSlug,
  initialLiked = false,
  onDelete,
  depth = 0 
}: CommentItemProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [isPending, startTransition] = useTransition();

    if (!comment.author) {
    console.error('Comment missing author:', comment);
    return null;
  }

  const authorId = comment.author._id || comment.author.id;
  const userId = user?._id || user?.id;
  const isAuthor = userId && authorId && userId === authorId;
  const maxDepth = 3; // Limit nesting depth

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like comments');
      router.push('/login');
      return;
    }

    startTransition(async () => {
      const result = await toggleCommentLike(comment._id);
      
      if (result.success && result.liked !== undefined) {
        setLiked(result.liked);
        setLikesCount(result.likesCount || likesCount);
        toast.success(result.liked ? 'Comment liked' : 'Comment unliked');
      } else {
        toast.error(result.error || 'Failed to toggle like');
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    startTransition(async () => {
      const result = await deleteComment(comment._id, postSlug);
      
      if (result.success) {
        toast.success('Comment deleted successfully');
        onDelete(comment._id);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete comment');
      }
    });
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    router.refresh();
  };

  return (
    <div className={`${depth > 0 ? "ml-8 mt-4" : ""}`}>
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        {/* Author Info */}
        <div className="flex items-start gap-3 mb-3">
          <img
            src={
              comment.author.avatar ||
              `https://ui-avatars.com/api/?name=${comment.author.firstName}+${comment.author.lastName}`
            }
            alt={`${comment.author.firstName} ${comment.author.lastName}`}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">
                {comment.author.firstName} {comment.author.lastName}
              </p>
              <span className="text-sm text-gray-500">
                @{comment.author.username}
              </span>
              <span className="text-sm text-gray-400">·</span>
              <span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
              {comment.isEdited && (
                <>
                  <span className="text-sm text-gray-400">·</span>
                  <span className="text-sm text-gray-500 italic">edited</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Comment Content */}
        <p className="text-gray-700 mb-3 whitespace-pre-wrap">
          {comment.content}
        </p>

        {/* Comment Status Badge (if not approved) */}
        {comment.status !== "approved" && (
          <span
            className={`inline-block px-2 py-1 text-xs rounded-full mb-3 ${
              comment.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : comment.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {comment.status}
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={handleLike}
            disabled={!isAuthenticated || isPending}
            className={`flex items-center gap-1 transition-colors ${
              liked ? "text-red-600" : "text-gray-600 hover:text-red-600"
            } ${
              !isAuthenticated || isPending
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <span>{liked ? "❤️" : "🤍"}</span>
            <span>{likesCount}</span>
          </button>

          {isAuthenticated && depth < maxDepth && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              disabled={isPending}
              className="text-gray-600 hover:text-primary-600 transition-colors disabled:opacity-50"
            >
              Reply
            </button>
          )}

          {isAuthor && (
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4">
            <CommentForm
              postId={postId}
              parentId={comment._id}
              onSuccess={handleReplySuccess}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply, index) => {
            // Safety check for missing _id
            const key = reply._id || `reply-${comment._id}-${index}`;

            return (
              <CommentItem
                key={key}
                comment={reply}
                postId={postId}
                postSlug={postSlug}
                onDelete={onDelete}
                depth={depth + 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}