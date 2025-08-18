import LoadingSpinner from '../../../components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Skeleton */}
        <div className="flex items-center mb-8">
          <div className="mr-4 p-2">
            <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-700 rounded-full mr-4 animate-pulse"></div>
            <div>
              <div className="h-8 bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-700 rounded w-16 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center items-center py-16">
          <LoadingSpinner 
            size="xl" 
            text="Loading coin data..." 
            variant="crypto" 
            color="blue" 
          />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-8">
          {/* Main Chart Skeleton */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="h-8 bg-gray-700 rounded w-32"></div>
                <div className="h-6 bg-gray-700 rounded w-20"></div>
              </div>
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-700 rounded w-16"></div>
                ))}
              </div>
            </div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>

          {/* Two Column Layout Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-2xl border border-gray-700 p-6 animate-pulse">
                  <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-20"></div>
                        <div className="h-5 bg-gray-700 rounded w-24"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-2xl border border-gray-700 p-6 animate-pulse">
                  <div className="h-6 bg-gray-700 rounded w-40 mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="flex justify-between">
                        <div className="h-4 bg-gray-700 rounded w-24"></div>
                        <div className="h-4 bg-gray-700 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
