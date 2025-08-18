import React from 'react';

const FavoriteButton = React.memo(function FavoriteButton({ 
  crypto, 
  isFavorite, 
  onToggle, 
  size = 'sm',
  showLabel = false,
  className = '' 
}) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const iconSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(crypto);
      }}
      className={`
        ${sizeClasses[size]}
        inline-flex items-center justify-center
        rounded-full
        transition-all duration-200
        touch-manipulation
        ${isFavorite 
          ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg' 
          : 'bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-yellow-400'
        }
        ${className}
      `}
      title={isFavorite ? `Remove ${crypto.name} from favorites` : `Add ${crypto.name} to favorites`}
      aria-label={isFavorite ? `Remove ${crypto.name} from favorites` : `Add ${crypto.name} to favorites`}
    >
      <span className={`${iconSizes[size]} ${isFavorite ? 'animate-pulse' : ''}`}>
        {isFavorite ? '⭐' : '☆'}
      </span>
      {showLabel && (
        <span className="ml-1 text-xs hidden sm:inline">
          {isFavorite ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </button>
  );
});

export default FavoriteButton;
