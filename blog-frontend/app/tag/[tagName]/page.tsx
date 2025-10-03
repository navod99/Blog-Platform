import { PaginatedResponse, Post } from "@/types";
import HomePage from "@/app/HomePage";
import { notFound } from "next/navigation";

async function getPostsByTag(
  tag: string,
  page: string = "1"
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
  );

  if (!res.ok) return [];

  const data = await res.json();
  const posts = data.posts || [];
  return Array.from(new Set(posts.flatMap((post: Post) => post.tags)));
}

export default async function TagPage({
  params,
}: {
  params: { tagName: string };
}) {
  const resolvedParams = await params;
  const tagName = resolvedParams.tagName
  const allTags = await getAllTags();
  const data = await getPostsByTag(tagName, "1");
  const posts = data.posts || [];
  const pagination = data.pagination;

  // If no posts found for this tag, show 404
  if (posts.length === 0) {
    notFound();
  }

  return (
    <HomePage
      posts={posts}
      pagination={pagination}
      allTags={allTags}
      currentTag={tagName}
      isTagPage={true}
    />
  );
}

export async function generateStaticParams() {
  const allTags = await getAllTags();

  return allTags.slice(0, 10).map((tag) => ({
    tagName: tag,
  }));
}