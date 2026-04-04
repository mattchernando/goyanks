export default function Header() {
  return (
    <header className="border-b border-white/10 bg-navy-600/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              <span className="text-gold">Pinstripe</span> Lab
            </h1>
            <p className="text-sm text-gray-400">
              Yankees Pitching Analytics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Data
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
