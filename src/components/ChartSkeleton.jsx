export default function ChartSkeleton({ height = "h-64" }) {
  return (
    <div className={`bg-gray-800 rounded-2xl border border-gray-700 p-6 ${height} animate-pulse glow`}>
      {/* Chart Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-700 rounded w-48 shimmer"></div>
        <div className="h-5 bg-gray-700 rounded w-20 shimmer animate-delay-150"></div>
      </div>
      
      {/* Chart Area with Grid Lines */}
      <div className="relative h-full">
        {/* Horizontal Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="h-px bg-gray-700 opacity-50 animate-pulse" 
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
        
        {/* Vertical Grid Lines */}
        <div className="absolute inset-0 flex justify-between">
          {[...Array(7)].map((_, i) => (
            <div 
              key={i} 
              className="w-px bg-gray-700 opacity-50 animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            ></div>
          ))}
        </div>
        
        {/* Animated Chart Bars */}
        <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="w-1 bg-gradient-to-t from-blue-500/30 via-blue-400/50 to-purple-400/40 rounded-t float"
              style={{ 
                height: `${Math.random() * 60 + 20}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + Math.random()}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Animated Wave Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-50 gradient-shift"></div>
        
        {/* Scanning Line Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-0.5 h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-30 animate-pulse" style={{ 
            animation: 'shimmer 3s ease-in-out infinite',
            transform: 'translateX(0px)'
          }}></div>
        </div>
      </div>
    </div>
  );
}
