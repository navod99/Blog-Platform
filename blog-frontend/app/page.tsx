import { PaginatedResponse, Post } from "@/types";
import HomePage from "@/app/HomePage";

async function getPosts(page: string = "1"): Promise<PaginatedResponse<Post>> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/published?page=${page}&limit=9`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export default async function Page() {
  const data = await getPosts("1");
  const posts = data.posts || [];
  const pagination = data.pagination;

  // Extract unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  return (
    <HomePage
      posts={posts}
      pagination={pagination}
      allTags={allTags}
      currentTag={null}
    />
  );
}