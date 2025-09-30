import { PaginatedResponse, Post } from "@/types";
import HomePage from "@/app/HomePage"

async function getPosts(searchParams: {
  page?: string;
  search?: string;
  tag?: string;
}): Promise<PaginatedResponse<Post>> {
  const params = new URLSearchParams({
    page: searchParams.page || "1",
    limit: "9",
  });

  if (searchParams.tag) params.append("tag", searchParams.tag);

  const endpoint = searchParams.search
    ? `/search?query=${searchParams.search}&${params}`
    : `/posts/published?${params}`;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  const data = await res.json();
  return data;
}

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; tag?: string };
}) {
   const resolvedSearchParams = await searchParams;
  const data = await getPosts(resolvedSearchParams);
  const posts = data.posts || [];
  const pagination = data.pagination;

  // Extract unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  return (
    <HomePage
      posts={posts}
      pagination={pagination}
      allTags={allTags}
      searchParams={resolvedSearchParams}
    />
  );
}
