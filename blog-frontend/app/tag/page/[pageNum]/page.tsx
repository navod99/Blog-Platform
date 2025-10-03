import { PaginatedResponse, Post } from "@/types";
import HomePage from "@/app/HomePage";
import { notFound } from "next/navigation";

async function getPostsByTag(
  tag: string,
  page: string
): Promise<PaginatedResponse<Post>> {
  const res = await fetch(
    `${process.env.API_URL}/posts/published?page=${page}&limit=9&tag=${tag}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

async function getAllTags(): Promise<string[]> {
  const res = await fetch(
    `${process.env.API_URL}/posts/published?limit=500`,
    {
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  const posts = data.posts || [];
  return Array.from(new Set(posts.flatMap((post: Post) => post.tags)));
}

export default async function TagPaginatedPage({
  params,
}: {
  params: { tagName: string; pageNum: string };
}) {
  const resolvedParams = await params;
  const tagName = resolvedParams.tagName
  const pageNum = parseInt(resolvedParams.pageNum);

  // Validate page number
  if (isNaN(pageNum) || pageNum < 1) {
    notFound();
  }

  const [data, allTags] = await Promise.all([
    getPostsByTag(tagName, resolvedParams.pageNum),
    getAllTags(),
  ]);

  const posts = data.posts || [];
  const pagination = data.pagination;

  // If page number exceeds total pages or no posts, show 404
  if (pageNum > pagination.totalPages || posts.length === 0) {
    notFound();
  }

  return (
    <HomePage
      posts={posts}
      pagination={pagination}
      allTags={allTags}
      currentTag={tagName}
      page={pagination.page}
    />
  );
}

export async function generateStaticParams() {
  // Pre-generate first 5 pages at build time
  return Array.from({ length: 2 }, (_, i) => ({
    pageNum: String(i + 2)
  }));
}