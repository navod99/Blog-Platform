"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createPost, updatePost, uploadPostImage } from "@/app/actions/posts";
import toast from "react-hot-toast";
import ImageUploader from "@/components/ImageUploader";
import { Post } from "@/types";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 mb-12 bg-gray-100 animate-pulse rounded-lg" />
  ),
});

// Zod validation schema
const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  content: z
    .string()
    .min(1, "Content is required")
    .refine(
      (val) => {
        const textOnly = val.replace(/<[^>]*>/g, "").trim();
        return textOnly.length > 0;
      },
      { message: "Content is required" }
    ),
  excerpt: z.string().max(500, "Excerpt is too long").optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  featuredImage: z.string().optional().or(z.literal("")),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostEditorProps {
  initialData?: Post;
  postId?: string;
}

export default function PostEditor({ initialData, postId }: PostEditorProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      excerpt: initialData?.excerpt || "",
      tags: initialData?.tags?.join(", ") || "",
      status: (initialData?.status as "draft" | "published") || "draft",
      featuredImage: initialData?.featuredImage || "",
    },
  });

  const onSubmit = async (data: PostFormData) => {
    try {
      const tags = data.tags
        ? data.tags.split(",").map((t) => t.trim())
        : [];
      const postData = { ...data, tags };

      // Step 1: Create or update the post
      const result = postId
        ? await updatePost(postId, postData)
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
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("title")}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter post title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excerpt
        </label>
        <textarea
          {...register("excerpt")}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.excerpt ? "border-red-500" : "border-gray-300"
          }`}
          rows={3}
          placeholder="Brief description of your post"
        />
        {errors.excerpt && (
          <p className="mt-1 text-sm text-red-500">{errors.excerpt.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content <span className="text-red-500">*</span>
        </label>
        <div className="mb-4">
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Write your post content here..."
              />
            )}
          />
        </div>
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      <div className="pt-8 sm:pt-4">
        <ImageUploader
          currentImage={initialData?.featuredImage || ""}
          onFileSelected={setSelectedFile}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          {...register("tags")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g., javascript, react, nextjs"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          {...register("status")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : postId ? "Save Changes" : "Create Post"}
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
