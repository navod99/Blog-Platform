import { Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";
import PostGrid from "@/components/PostGrid";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Post, PaginatedResponse } from "@/types";

interface HomePageProps {
  posts: Post[];
  pagination: PaginatedResponse<Post>["pagination"];
  allTags: string[];
  searchParams: {
    page?: string;
    search?: string;
    tag?: string;
  };
}

export default function HomePage({
  posts,
  pagination,
  allTags,
  searchParams,
}: HomePageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Our Blog
        </h1>
        <p className="text-xl text-gray-600">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar initialQuery={searchParams.search} />

      {/* Tags Filter */}
      <TagFilter tags={allTags} selectedTag={searchParams.tag} />

      {/* Posts Grid */}
      <Suspense fallback={<LoadingSpinner />}>
        <PostGrid
          posts={posts}
          currentPage={Number(searchParams.page) || 1}
          totalPages={pagination.totalPages}
        />
      </Suspense>
    </div>
  );
}
