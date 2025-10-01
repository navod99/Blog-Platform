"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createPost, updatePost, uploadPostImage } from "@/app/actions/posts";
import toast from "react-hot-toast";
import ImageUploader from "@/components/ImageUploader";
import { Post } from "@/types";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 mb-12 bg-gray-100 animate-pulse rounded-lg" />
  ),
});

interface PostEditorProps {
  initialData?: Post;
  postId?: string;
}

export default function PostEditor({ initialData, postId }: PostEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    excerpt: string;
    tags: string;
    status: "draft" | "published";
    featuredImage: string;
  }>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    tags: initialData?.tags?.join(", ") || "",
    status: (initialData?.status as "draft" | "published") || "draft",
    featuredImage: initialData?.featuredImage || "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Title and content are required");
      return;
    }

    setLoading(true);
    try {
      const tags = formData.tags
        ? formData.tags.split(",").map((t) => t.trim())
        : [];
      const status =
        formData.status === "draft" || formData.status === "published"
          ? formData.status
          : "draft";
      const postData = { ...formData, tags, status };

      // Step 1: Create or update the post
      const result = postId
        ? await updatePost(postId, { ...postData, status })
        : await createPost(postData);

      if (!result.success) {
        toast.error(result.error || "Failed to save post");
        return;
      }

      // Step 2: Upload image if file is selected
      if (selectedFile && result.success) {
        const uploadResult = await uploadPostImage(
          result.post._id,
          selectedFile
        );

        if (!uploadResult.success) {
          toast.error(
            "Post saved but image upload failed: " + uploadResult.error
          );
        }
      }

      toast.success(
        postId ? "Post updated successfully" : "Post created successfully"
      );
      router.push("/dashboard");
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter post title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excerpt
        </label>
        <textarea
          value={formData.excerpt}
          onChange={(e) =>
            setFormData({ ...formData, excerpt: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
          placeholder="Brief description of your post"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <RichTextEditor
          value={formData.content}
          onChange={(value) => setFormData({ ...formData, content: value })}
          placeholder="Write your post content here..."
        />
      </div>

      <ImageUploader
        currentImage={formData.featuredImage}
        onFileSelected={setSelectedFile}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g., javascript, react, nextjs"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as "draft" | "published",
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : postId ? "Save Changes" : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
