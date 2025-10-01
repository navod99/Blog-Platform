'use client'

import { useState, useEffect } from 'react';
import { Post } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch  } from 'react-icons/fi';
import { IoChevronForward } from "react-icons/io5";
import { TbMoodSad } from "react-icons/tb";

interface SearchResultsProps {
  searchQuery: string;
  onClose: () => void;
}

export default function SearchResults({ searchQuery, onClose }: SearchResultsProps) {
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    const searchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          query: searchQuery,
          limit: '10',
        });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/search?${params}`
        );

        if (!res.ok) {
          throw new Error('Search failed');
        }

        const data = await res.json();
        setResults(data.posts || []);
      } catch (err) {
        setError('Failed to search. Please try again.');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchPosts, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleResultClick = () => {
    onClose();
  };

  // Empty State - No search query yet
  if (!searchQuery) {
    return (
      <div className="flex flex-col items-center p-8 ">
        <div className="text-gray-400 mb-4">
            <FiSearch className="w-14 h-14" />
        </div>
        <p className="text-gray-500 text-lg">Start typing to search posts</p>
        <p className="text-gray-400 text-sm mt-2">
          Search by title, content, tags
        </p>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-500">Searching...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-12 text-center">
        <div className="text-red-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // No Results State
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center p-8">
        <div className="text-gray-400 mb-4">
          <TbMoodSad className="w-16 h-16" />
        </div>
        <p className="text-gray-600 text-lg">No results found for &quot;{searchQuery}&quot;</p>
        <p className="text-gray-400 text-sm mt-2">
          Try different keywords or check your spelling
        </p>
      </div>
    );
  }

  // Results List
  return (
    <div className="p-4">
      <p className="px-2 py-3 text-sm text-gray-500 border-b border-gray-200">
        Found {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
      </p>

      <div className="divide-y divide-gray-200">
        {results.map((post) => (
          <Link
            key={post._id}
            href={`/posts/${post.slug}`}
            onClick={handleResultClick}
            className="block p-4 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex gap-4">
              {/* Thumbnail */}
              {post.featuredImage && (
                <div className="flex-shrink-0 w-20 h-20 relative rounded overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                  {post.title}
                </h3>
                
                {post.excerpt && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

                <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                  <span>
                    {post.author.firstName} {post.author.lastName}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                  </span>
                  {post.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="line-clamp-1">
                        {post.tags.slice(0, 2).join(', ')}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Arrow Icon */}
              <div className="flex-shrink-0 text-gray-400 group-hover:text-primary-600 transition-colors">
                <IoChevronForward />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}