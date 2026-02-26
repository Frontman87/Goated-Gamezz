import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './data/games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeGame = () => {
    setSelectedGame(null);
    setIsFullscreen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-bottom border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setSelectedGame(null)}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Gamepad2 size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">Unblocked Portal</h1>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type="text"
                placeholder="Search games..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-full focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors hidden md:block">
              Request Game
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <AnimatePresence mode="wait">
          {selectedGame ? (
            <motion.div
              key="game-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={closeGame}
                  className="flex items-center gap-2 text-zinc-600 hover:text-indigo-600 transition-colors group"
                >
                  <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Back to Games</span>
                </button>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 size={20} />
                  </button>
                  <a 
                    href={selectedGame.iframeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors"
                    title="Open in New Tab"
                  >
                    <ExternalLink size={20} />
                  </a>
                  <button 
                    onClick={closeGame}
                    className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'aspect-video w-full'}`}>
                {isFullscreen && (
                  <button 
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-4 right-4 z-50 p-2 bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-full text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                )}
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  allow="autoplay; fullscreen; pointer-lock"
                  title={selectedGame.title}
                />
              </div>

              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                <h2 className="text-2xl font-bold text-zinc-900">{selectedGame.title}</h2>
                <p className="mt-2 text-zinc-600 leading-relaxed">{selectedGame.description}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Popular Games</h2>
                <p className="text-zinc-500 mt-1">Hand-picked unblocked games for you.</p>
              </div>

              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredGames.map((game) => (
                    <motion.div
                      key={game.id}
                      layoutId={game.id}
                      onClick={() => handleGameSelect(game)}
                      className="group cursor-pointer bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                            <Gamepad2 className="text-indigo-600" size={24} />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                          {game.title}
                        </h3>
                        <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                          {game.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                    <Search size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900">No games found</h3>
                  <p className="text-zinc-500">Try searching for something else.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Gamepad2 size={18} />
              </div>
              <span className="font-bold text-zinc-900">Unblocked Portal</span>
            </div>
            
            <div className="flex gap-8 text-sm font-medium text-zinc-500">
              <a href="#" className="hover:text-indigo-600 transition-colors">Home</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            </div>

            <p className="text-sm text-zinc-400">
              © 2024 Unblocked Portal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
