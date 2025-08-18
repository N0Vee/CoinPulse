import React from 'react';

const LoadingSpinner = React.memo(function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  variant = 'spinner',
  color = 'blue' 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const colorClasses = {
    blue: 'border-blue-400 text-blue-400',
    green: 'border-green-400 text-green-400',
    purple: 'border-purple-400 text-purple-400',
    orange: 'border-orange-400 text-orange-400'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'pulse':
        return (
          <div className="flex items-center space-x-2">
            <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse`}></div>
            <div className={`${sizeClasses[size]} bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
            <div className={`${sizeClasses[size]} bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex items-center space-x-1">
            <div className={`${sizeClasses[size]} bg-blue-400 rounded-full animate-bounce`}></div>
            <div className={`${sizeClasses[size]} bg-blue-400 rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
            <div className={`${sizeClasses[size]} bg-blue-400 rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
          </div>
        );

      case 'bars':
        return (
          <div className="flex items-end space-x-1">
            <div className={`w-1 bg-blue-400 rounded-full animate-pulse`} style={{ height: '16px', animationDelay: '0s' }}></div>
            <div className={`w-1 bg-blue-400 rounded-full animate-pulse`} style={{ height: '24px', animationDelay: '0.1s' }}></div>
            <div className={`w-1 bg-blue-400 rounded-full animate-pulse`} style={{ height: '20px', animationDelay: '0.2s' }}></div>
            <div className={`w-1 bg-blue-400 rounded-full animate-pulse`} style={{ height: '28px', animationDelay: '0.3s' }}></div>
            <div className={`w-1 bg-blue-400 rounded-full animate-pulse`} style={{ height: '16px', animationDelay: '0.4s' }}></div>
          </div>
        );

      case 'crypto':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} border-2 border-blue-400 border-t-transparent rounded-full animate-spin`}></div>
            <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-purple-400 border-b-transparent rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
        );

      default:
        return (
          <div className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}></div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`flex items-center ${colorClasses[color]}`}>
        {renderSpinner()}
        {text && <span className="ml-3 font-medium">{text}</span>}
      </div>
    </div>
  );
});

export default LoadingSpinner;
