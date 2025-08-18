export default function CryptoCardSkeleton({ index = 0 }) {
  return (
    <div 
      className="bg-gray-800 rounded-2xl border border-gray-700 p-6 animate-pulse glow"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header with Icon and Name */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 mr-3 gradient-shift"></div>
          <div>
            <div className="h-5 bg-gray-700 rounded w-24 mb-2 shimmer"></div>
            <div className="h-4 bg-gray-700 rounded w-16 shimmer animate-delay-150"></div>
          </div>
        </div>
        {/* Rank Badge */}
        <div className="bg-gray-700 rounded-full h-6 w-8 shimmer animate-delay-300"></div>
      </div>

      {/* Price Section */}
      <div className="mb-4">
        <div className="h-8 bg-gray-700 rounded w-32 mb-2 shimmer animate-delay-75"></div>
        <div className="h-6 bg-gray-700 rounded w-20 shimmer animate-delay-225"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700 rounded-xl p-3">
          <div className="h-3 bg-gray-600 rounded w-16 mb-2 shimmer animate-delay-150"></div>
          <div className="h-4 bg-gray-600 rounded w-20 shimmer animate-delay-300"></div>
        </div>
        <div className="bg-gray-700 rounded-xl p-3">
          <div className="h-3 bg-gray-600 rounded w-16 mb-2 shimmer animate-delay-225"></div>
          <div className="h-4 bg-gray-600 rounded w-20 shimmer animate-delay-500"></div>
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-gray-700 mb-4">
        <div className="flex items-center justify-between">
          <div className="h-3 bg-gray-700 rounded w-16 shimmer animate-delay-300"></div>
          <div className="flex items-center space-x-2">
            <div className="h-3 bg-gray-700 rounded w-12 shimmer animate-delay-150"></div>
            <div className="w-8 h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full opacity-30 gradient-shift"></div>
            <div className="h-3 bg-gray-700 rounded w-12 shimmer animate-delay-225"></div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="h-9 bg-gray-700 rounded-lg shimmer animate-delay-500"></div>
    </div>
  );
}
