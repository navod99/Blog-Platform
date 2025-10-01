import Link from "next/link";

interface TagFilterProps {
  tags: string[];
  selectedTag?: string | null;
}

export default function TagFilter({ tags, selectedTag }: TagFilterProps) {

  if (tags.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3">Filter by Tags:</h3>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/"
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            !selectedTag
              ? "bg-primary-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </Link>
        {tags.map((tag) => (
          <Link
            href={`/tag/${tag}`}
            key={tag}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedTag === tag
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}