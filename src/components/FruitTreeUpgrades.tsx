import React from 'react';
import { FruitBiet, Upgrade } from '../types/game';

interface FruitTreeUpgradesProps {
  fruits: FruitBiet[];
  activeHanging: string[];
  onToggleHangFruit: (fruitName: string) => void;
  upgrades: Upgrade[];
  coins: number;
  onBuyUpgrade: (upgradeId: string) => void;
}

export const FruitTreeUpgrades: React.FC<FruitTreeUpgradesProps> = ({
  fruits,
  activeHanging,
  onToggleHangFruit,
  upgrades,
  coins,
  onBuyUpgrade,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-4 p-4 bg-amber-100 rounded-xl pixel-border flex flex-col gap-6">
      {/* Cây Bẹo Section Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold font-pixel text-amber-950 flex items-center gap-2">
            <span>🎋</span> CÂY BẸO TREO TRÁI CÂY (BIỂU TƯỢNG CHỢ NỔI)
          </h2>
          <span className="text-xs bg-amber-300 text-amber-950 px-2 py-1 rounded font-bold">
            Đang treo: {activeHanging.length} / 3 loại
          </span>
        </div>
        <p className="text-xs text-amber-800 mb-3">
          Ở Chợ Nổi Miền Tây, người bán treo gì trên Cây Bẹo bằng tre thì bán thức ấy! Hãy treo trái cây để thu hút khách chèo xuồng đến.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {fruits.map((f) => {
            const isHanging = activeHanging.includes(f.name);
            return (
              <div
                key={f.id}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-between text-center transition-all ${
                  isHanging
                    ? 'bg-amber-300 border-amber-900 shadow-[2px_2px_0px_#78350f]'
                    : 'bg-amber-50 border-amber-800 hover:bg-amber-200'
                }`}
              >
                <span className="text-3xl mb-1">{f.icon}</span>
                <span className="font-bold text-xs text-amber-950">{f.name}</span>
                <span className="text-[10px] text-amber-800 my-1">{f.effect}</span>
                <button
                  onClick={() => onToggleHangFruit(f.name)}
                  className={`w-full mt-2 py-1.5 px-2 rounded font-bold text-xs pixel-btn border ${
                    isHanging
                      ? 'bg-red-700 text-white border-red-950'
                      : 'bg-emerald-700 text-white border-emerald-950'
                  }`}
                >
                  {isHanging ? 'Gỡ Xuống' : 'Treo Lên Bẹo'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upgrades Section */}
      <div className="border-t-2 border-amber-300 pt-4">
        <h2 className="text-lg font-bold font-pixel text-amber-950 mb-2 flex items-center gap-2">
          <span>🛶</span> NÂNG CẤP GHE & DỤNG CỤ NẤU HỦ TIẾU
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {upgrades.map((upg) => (
            <div
              key={upg.id}
              className="p-3 bg-amber-50 rounded-xl border-2 border-amber-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-amber-950">{upg.title}</span>
                  <span className="text-xs font-bold text-amber-700 font-pixel">
                    Cấp {upg.level}/{upg.maxLevel}
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-1">{upg.description}</p>
                <div className="text-[11px] font-semibold text-emerald-800 mt-2">
                  ✨ {upg.effectText}
                </div>
              </div>

              <button
                onClick={() => onBuyUpgrade(upg.id)}
                disabled={upg.level >= upg.maxLevel || coins < upg.cost}
                className={`w-full mt-3 py-2 px-3 rounded-lg font-bold text-xs font-pixel flex items-center justify-center gap-2 border-2 ${
                  upg.level >= upg.maxLevel
                    ? 'bg-slate-400 text-slate-800 border-slate-600 cursor-not-allowed'
                    : coins >= upg.cost
                    ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-900 pixel-btn'
                    : 'bg-amber-200 text-amber-700 border-amber-400 cursor-not-allowed'
                }`}
              >
                <span>🪙</span>
                <span>
                  {upg.level >= upg.maxLevel ? 'ĐÃ TỐI ĐA' : `Nâng Cấp (${upg.cost} Xu)`}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
