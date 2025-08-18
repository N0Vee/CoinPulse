import React from 'react';

const Navbar = React.memo(function Navbar({ connectionStatus, lastUpdate, onReconnect, loading }) {
    return (
        <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <div className={`w-2 h-2 rounded-full ${
                            connectionStatus === 'Connected' ? 'bg-green-400 animate-pulse' :
                            connectionStatus === 'Reconnecting...' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
                        }`}></div>
                    </div>
                    <h1 className="text-2xl font-light text-white">
                        Coin<span className="font-semibold text-blue-400">Pulse</span>
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-300">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            connectionStatus === 'Connected' ? 'bg-green-500' :
                            connectionStatus === 'Reconnecting...' ? 'bg-yellow-500' :
                            'bg-red-500'
                        }`}></span>
                        {connectionStatus}
                    </div>
                    <div className="text-sm text-gray-300">
                        {lastUpdate && typeof window !== 'undefined' ? lastUpdate.toLocaleTimeString() : 'Connecting...'}
                    </div>
                    <button
                        onClick={onReconnect}
                        disabled={loading || connectionStatus === 'Reconnecting...'}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 transition-colors duration-200"
                        title={loading || connectionStatus === 'Reconnecting...' ? 'Connecting...' : 'Reconnect'}
                    >
                        <svg 
                            className={`w-4 h-4 text-blue-400 ${loading || connectionStatus === 'Reconnecting...' ? 'animate-spin text-gray-400' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
});

export default Navbar;
