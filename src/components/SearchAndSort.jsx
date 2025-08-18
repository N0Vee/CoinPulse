export default function SearchAndSort({ 
  searchTerm, 
  onSearchChange, 
  sortBy, 
  sortOrder, 
  onSort 
}) {
  const SortButton = ({ field, label }) => (
    <button
      onClick={() => onSort(field)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
        sortBy === field
          ? 'bg-blue-600 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {label}
      {sortBy === field && (
        <svg 
          className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-400"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex gap-2">
        <SortButton field="name" label="Name" />
        <SortButton field="price" label="Price" />
        <SortButton field="change" label="24h %" />
        <SortButton field="volume" label="Volume" />
      </div>
    </div>
  );
}
