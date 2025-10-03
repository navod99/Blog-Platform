'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Comment } from '@/types';
import { useAuthStore } from '@/store/authStore';
import CommentForm from './CommentForm';
import { toggleCommentLike, deleteComment, checkCommentLiked } from '@/app/actions/comments';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  postSlug: string;
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
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await checkCommentLiked(comment._id);
      setLiked(result.liked);
    })();
  }, [comment._id]);

  if (!comment.author) {
    console.error('Comment missing author:', comment);
    return null;
  }

  const authorId = comment.author._id || comment.author.id;
  const userId = user?._id || user?.id;
  const isAuthor = userId && authorId && userId === authorId;
  const maxDepth = 3;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const repliesCount = comment.replies?.length || 0;;

  const fetchReplies = async () => {
    if (replies.length > 0) {
      // Already fetched, just toggle visibility
      setShowReplies(!showReplies);
      return;
    }

    setLoadingReplies(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/post/${postId}?parentComment=${comment._id}`,
        { cache: 'no-store' }
      );


      if (res.ok) {
        const data = await res.json();
        setReplies(data.comments || []);
        setShowReplies(true);
      } else {
        toast.error('Failed to load replies');
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
      toast.error('Failed to load replies');
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleToggleReplies = () => {
    if (showReplies) {
      // Just hide, don't fetch again
      setShowReplies(false);
    } else {
      // Fetch if needed
      fetchReplies();
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like comments');
      router.push('/login');
      return;
    }

    setIsLiking(true);
    const result = await toggleCommentLike(comment._id, postSlug);
    
    if (result.success && result.liked !== undefined) {
      setLiked(result.liked);
      setLikesCount(result.likesCount);
      toast.success(result.liked ? 'Comment liked' : 'Comment unliked');
    } else {
      toast.error(result.error || 'Failed to toggle like');
    }
    setIsLiking(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteComment(comment._id, postSlug);
    
    if (result.success) {
      toast.success('Comment deleted successfully');
      onDelete(comment._id);
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to delete comment');
    }
    setIsDeleting(false);
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    // Refresh replies after adding a new one
    fetchReplies();
  };

  const handleNestedDelete = (commentId: string) => {
    // Remove deleted reply from local state
    setReplies(prev => prev.filter(r => r._id !== commentId));
  };

  return (
    <div className={`${depth > 0 ? "ml-8 mt-4" : ""}`}>
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        {/* Author Info */}
        <div className="flex items-start gap-3 mb-3">
          <Image
            src={
              comment.author.avatar ||
              `https://ui-avatars.com/api/?name=${comment.author.firstName}+${comment.author.lastName}`
            }
            alt={`${comment.author.firstName} ${comment.author.lastName}`}
            width={40}
            height={40}
            className="rounded-full object-cover"
            unoptimized
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
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
            disabled={!isAuthenticated || isLiking}
            className={`flex items-center gap-1 transition-colors ${
              liked ? "text-red-600" : "text-gray-600 hover:text-red-600"
            } ${
              !isAuthenticated || isLiking
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
              disabled={isDeleting || isLiking}
              className="text-gray-600 hover:text-primary-600 transition-colors disabled:opacity-50"
            >
              Reply
            </button>
          )}

          {/* Show/Hide Replies Button */}
          {hasReplies && (
            <button
              onClick={handleToggleReplies}
              disabled={loadingReplies}
              className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors disabled:opacity-50"
            >
              {loadingReplies ? (
                <span>Loading...</span>
              ) : showReplies ? (
                <>
                  <IoChevronUp className="w-4 h-4" />
                  <span>Hide replies ({repliesCount})</span>
                </>
              ) : (
                <>
                  <IoChevronDown className="w-4 h-4" />
                  <span>Show replies ({repliesCount})</span>
                </>
              )}
            </button>
          )}

          {isAuthor && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
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
              postSlug={postSlug}
            />
          </div>
        )}
      </div>

      {/* Nested Replies - Loaded dynamically */}
      {showReplies && replies.length > 0 && (
        <div className="mt-4">
          {replies.map((reply, index) => {
            const key = reply._id || `reply-${comment._id}-${index}`;

            return (
              <CommentItem
                key={key}
                comment={reply}
                postId={postId}
                postSlug={postSlug}
                onDelete={handleNestedDelete}
                depth={depth + 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}