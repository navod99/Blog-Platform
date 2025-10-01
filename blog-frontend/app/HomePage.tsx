import { Suspense } from "react";
import TagFilter from "@/components/TagFilter";
import PostGrid from "@/components/PostGrid";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Post, paginationType } from "@/types";
import Search from "@/components/Search/Search";

interface HomePageProps {
  posts: Post[];
  pagination: paginationType;
  allTags: string[];
  currentTag: string | null;
  page?: number;
  isTagPage?: boolean;
}

export default function HomePage({
  posts,
  pagination,
  allTags,
  currentTag,
  page = 1,
  isTagPage = false,
}: HomePageProps) {
  const pathPrefix = isTagPage && currentTag ? `/tag/${currentTag}` : "";
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section with Search */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Our Blog
            </h1>
            <p className="text-xl text-gray-600">
              Discover stories, thinking, and expertise from writers on any
              topic.
            </p>
          </div>

          {/* Search in right corner */}
          <div className="flex-shrink-0">
            <Search />
          </div>
        </div>
      </div>

      {/* Tags Filter */}
      <TagFilter tags={allTags} selectedTag={currentTag} />

      {/* Posts Grid */}
      <Suspense fallback={<LoadingSpinner />}>
        <PostGrid
          posts={posts}
          currentPage={page || 1}
          totalPages={pagination.totalPages}
          pathPrefix={pathPrefix}
        />
      </Suspense>
    </div>
  );
}
