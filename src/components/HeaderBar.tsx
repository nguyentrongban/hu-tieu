import React from 'react';

interface HeaderBarProps {
  coins: number;
  timeString: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenStory: () => void;
  onOpenRecipes: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  coins,
  timeString,
  soundEnabled,
  onToggleSound,
  onOpenStory,
  onOpenRecipes,
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto mb-4 bg-amber-900 text-amber-100 p-3 rounded-xl pixel-border flex items-center justify-between shadow-lg">
      {/* Top-Left: Golden Coin Counter */}
      <div className="flex items-center gap-2 bg-amber-950 px-3 py-1.5 rounded-lg border-2 border-amber-600">
        <span className="text-xl animate-pulse">🪙</span>
        <div className="flex flex-col">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Tài Khoản Xu</span>
          <span className="font-pixel text-amber-300 font-bold text-lg leading-tight">
            {coins}
          </span>
        </div>
      </div>

      {/* Center Title / Brand Wordmark */}
      <div className="hidden md:flex flex-col items-center">
        <h1 className="font-pixel text-lg text-amber-200 tracking-wider flex items-center gap-2">
          <span>🛶</span> CHỢ NỔI MIỀN TÂY - HỦ TIẾU GÕ
        </h1>
        <span className="text-xs text-amber-300 italic">
          Bình Minh Nắng Ấm Trên Sông Cửu Long
        </span>
      </div>

      {/* Top-Right: Clock & Controls */}
      <div className="flex items-center gap-3">
        {/* Clock Display */}
        <div className="bg-amber-950 px-3 py-1.5 rounded-lg border-2 border-amber-600 flex items-center gap-2">
          <span className="text-lg">☀️</span>
          <div className="flex flex-col">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Thời Gian</span>
            <span className="font-pixel text-amber-200 font-bold text-sm leading-tight">
              {timeString}
            </span>
          </div>
        </div>

        {/* Audio Toggle Button */}
        <button
          onClick={onToggleSound}
          title="Bật / Tắt âm thanh chợ nổi"
          className="p-2 bg-amber-800 hover:bg-amber-700 active:bg-amber-900 text-amber-100 rounded-lg border-2 border-amber-600 pixel-btn text-lg"
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>

        {/* Recipe / Guide Button */}
        <button
          onClick={onOpenRecipes}
          className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs rounded-lg border-2 border-amber-500 pixel-btn hidden sm:flex items-center gap-1"
        >
          <span>📖</span>
          <span>Công Thức</span>
        </button>

        {/* Story Button */}
        <button
          onClick={onOpenStory}
          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg border-2 border-emerald-500 pixel-btn hidden sm:flex items-center gap-1"
        >
          <span>🌾</span>
          <span>Sự Tích Chợ Nổi</span>
        </button>
      </div>
    </header>
  );
};
