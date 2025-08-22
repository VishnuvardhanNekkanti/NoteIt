import React from 'react';
import Search from 'lucide-react/dist/esm/icons/search';
import Filter from 'lucide-react/dist/esm/icons/filter';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        {/* Fix: Ensure Search icon renders correctly */}
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search width={20} height={20} color="#3b82f6" />
        </span>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-blue-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-400 focus:border-transparent bg-white/80 dark:bg-gray-800/80 transition-all duration-200 placeholder-blue-400 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
        />
      </div>
      
      <div className="relative">
        {/* Fix: Ensure Filter icon renders correctly */}
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Filter width={20} height={20} color="#3b82f6" />
        </span>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="pl-10 pr-4 py-3 border border-blue-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-400 focus:border-transparent bg-white/80 dark:bg-gray-800/80 transition-all duration-200 appearance-none cursor-pointer min-w-40 text-gray-900 dark:text-gray-100"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;