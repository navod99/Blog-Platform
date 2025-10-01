'use client'

import { useState } from 'react';
import SearchBar from '@/components/Search/SearchBar';
import SearchResults from '@/components/Search/SearchResults';
import { FiSearch  } from 'react-icons/fi';
import { TfiClose } from "react-icons/tfi";

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const openSearch = () => setIsOpen(true);
  const closeSearch = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={openSearch}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-300 hover:bg-gray-200 rounded-lg transition-colors sm:min-w-[250px]"
      >
        <FiSearch className="w-5 h-5" />
        <span className="hidden sm:inline">Search</span>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeSearch}
          />

          {/* Modal Content */}
          <div className="relative h-full flex items-start justify-center pt-16 sm:pt-24 px-4">
            <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl max-h-[80vh] flex flex-col">
              {/* Close Button */}
              <button
                onClick={closeSearch}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                aria-label="Close search"
              >
                  <TfiClose className="w-5 h-5" />
              </button>

              {/* Search Bar */}
              <div className="px-6 pt-12 border-gray-200">
                <SearchBar onSearch={handleSearch} onClose={closeSearch} />
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto">
                <SearchResults
                  searchQuery={searchQuery}
                  onClose={closeSearch}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}