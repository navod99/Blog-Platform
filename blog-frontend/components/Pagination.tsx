import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pathPrefix: string;
}

export default function Pagination({ currentPage, totalPages, pathPrefix }: PaginationProps) {
  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <div className="flex justify-center gap-2 items-center">
      {currentPage > 1 ? (
        <Link
          href={`${pathPrefix}/page/${previousPage}`}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Previous
        </Link>
      ) : (
        <button
          disabled
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg opacity-50 cursor-not-allowed"
        >
          Previous
        </button>
      )}

      <span className="px-4 py-2">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={`${pathPrefix}/page/${nextPage}`}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Next
        </Link>
      ) : (
        <button
          disabled
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg opacity-50 cursor-not-allowed"
        >
          Next
        </button>
      )}
    </div>
  );
}