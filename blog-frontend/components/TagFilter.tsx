'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface TagFilterProps {
  tags: string[];
  selectedTag?: string;
}

export default function TagFilter({ tags, selectedTag }: TagFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (tag === selectedTag) {
      params.delete('tag');
    } else {
      params.set('tag', tag);
    }
    params.set('page', '1'); // Reset to first page
    
    router.push(`${pathname}?${params.toString()}`);
  };

  if (tags.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3">Filter by Tags:</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedTag === tag
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}