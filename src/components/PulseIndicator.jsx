export default function PulseIndicator({ 
  isActive, 
  color = 'green', 
  size = 'sm',
  label = 'Live' 
}) {
  const sizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const colorClasses = {
    green: 'bg-green-400',
    blue: 'bg-blue-400',
    red: 'bg-red-400',
    yellow: 'bg-yellow-400',
    purple: 'bg-purple-400'
  };

  const textColorClasses = {
    green: 'text-green-400',
    blue: 'text-blue-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400'
  };

  return (
    <div className={`flex items-center text-xs ${textColorClasses[color]} transition-opacity duration-300 ${
      isActive ? 'opacity-100' : 'opacity-50'
    }`}>
      <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full mr-2 ${
        isActive ? 'animate-pulse' : ''
      }`}></div>
      {label}
    </div>
  );
}
