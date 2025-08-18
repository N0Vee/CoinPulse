export default function Navbar({ onStartTracking }) {
    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <h1 className="text-2xl font-light text-gray-900">
                        Coin<span className="font-semibold text-blue-500">Pulse</span>
                    </h1>
                </div>
                <div className="hidden md:flex space-x-8 text-gray-600">
                    <a href="#" className="hover:text-blue-500 transition-colors">Home</a>
                    <a href="#" className="hover:text-blue-500 transition-colors">Markets</a>
                    <a href="#" className="hover:text-blue-500 transition-colors">About</a>
                </div>
                <button
                    onClick={onStartTracking}
                    className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                    Start Tracking
                </button>
            </div>
        </nav>
    );
}
