"use client";

import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { deletePost, updatePostStatus } from "@/app/actions/posts";
import toast from "react-hot-toast";
import { Post } from "@/types";

interface PostsTableProps {
  posts: Post[];
}

export default function PostsTable({ posts: initialPosts }: PostsTableProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setLoading(id);
    try {
      const result = await deletePost(id);
      if (result.success) {
        setPosts(posts.filter((p) => p._id !== id));
        toast.success("Post deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete post");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(null);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "draft" | "published"
  ) => {
    setLoading(id);
    try {
      const response = await updatePostStatus(id, newStatus);
      if (!response.success) {
        toast.error(response.error);
        if (response.error === "Please login to update post status") {
          router.push("/login");
        }
        return;
      }
      setPosts(
        posts.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );
      toast.success(
        `Post ${
          newStatus === "published" ? "published" : "unpublished"
        } successfully`
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to update post status");
    } finally {
      setLoading(null);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">
          No posts found.{" "}
          <Link href="/posts/new" className="text-primary-600 hover:underline">
            Create your first post
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stats
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {posts.map((post) => (
            <tr key={post._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-sm font-medium text-gray-900 hover:text-primary-600"
                >
                  {post.title}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    post.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {post.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ❤️ {post.likesCount} | 💬 {post.commentsCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex gap-2">
                  <Link
                    href={`/posts/edit/${post._id}`}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() =>
                      handleStatusChange(
                        post._id,
                        post.status === "published" ? "draft" : "published"
                      )
                    }
                    disabled={loading === post._id}
                    className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                  >
                    {post.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    disabled={loading === post._id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
