import LoadingSpinner from '../components/LoadingSpinner';
import CryptoCardSkeleton from '../components/CryptoCardSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar Skeleton */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 bg-gray-700 rounded w-32 animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-5 bg-gray-700 rounded w-20 animate-pulse"></div>
            <div className="h-5 bg-gray-700 rounded w-24 animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-700 rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Charts Section Skeleton */}
        <div className="mb-12">
          <div className="h-8 bg-gray-700 rounded w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl border border-gray-700 p-6 animate-pulse">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-6 bg-gray-700 rounded w-32"></div>
                  <div className="h-5 bg-gray-700 rounded w-16"></div>
                </div>
                <div className="h-48 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Sort Skeleton */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="h-6 bg-gray-700 rounded w-40 animate-pulse"></div>
            <div className="flex items-center space-x-4">
              <div className="h-10 bg-gray-700 rounded w-64 animate-pulse"></div>
              <div className="h-10 bg-gray-700 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-700 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center items-center py-8 mb-8">
          <LoadingSpinner 
            size="lg" 
            text="Loading cryptocurrency data..." 
            variant="crypto"
            color="blue"
          />
        </div>

        {/* Crypto Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, index) => (
            <CryptoCardSkeleton key={index} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
