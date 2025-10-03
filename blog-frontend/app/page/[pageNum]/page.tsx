import { PaginatedResponse, Post } from "@/types";
import HomePage from "@/app/HomePage";
import { notFound } from "next/navigation";

async function getPosts(page: string): Promise<PaginatedResponse<Post>> {
  const res = await fetch(
    `${process.env.API_URL}/posts/published?page=${page}&limit=9`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export default async function PaginatedPage({
  params,
}: {
  params: { pageNum: string };
}) {
  const resolvedParams = await params;
  const pageNum = parseInt(resolvedParams.pageNum);

  // Validate page number
  if (isNaN(pageNum) || pageNum < 1) {
    notFound();
  }

  const data = await getPosts(resolvedParams.pageNum);
  const posts = data.posts || [];
  const pagination = data.pagination;

  // If page number exceeds total pages, show 404
  if (pageNum > pagination.totalPages) {
    notFound();
  }

  // Extract unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  return (
    <HomePage
      posts={posts}
      pagination={pagination}
      allTags={allTags}
      currentTag={null}
      page={pagination.page}
    />
  );
}

export async function generateStaticParams() {
  const data = await getPosts("1")
  const totalPages = data.pagination.totalPages;
   return Array.from({ length: totalPages }, (_, i) => ({
    pageNum: String(i + 2)
  }));

}