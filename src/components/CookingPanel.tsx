import React from 'react';

interface IngredientItem {
  id: string;
  name: string;
  icon: string;
  added: boolean;
}

interface CookingPanelProps {
  ingredients: IngredientItem[];
  onToggleIngredient: (id: string) => void;
  onCookAndServe: () => void;
  isCooking: boolean;
  selectedCustomerOrder?: string;
  questProgress: string; // e.g. "Nhiệm vụ: Phục vụ khách hàng 1/5"
}

export const CookingPanel: React.FC<CookingPanelProps> = ({
  ingredients,
  onToggleIngredient,
  onCookAndServe,
  isCooking,
  selectedCustomerOrder,
  questProgress,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-4 p-4 bg-amber-100 rounded-xl pixel-border flex flex-col gap-4">
      {/* Top Status & Selected Order Banner */}
      <div className="flex flex-wrap items-center justify-between bg-amber-200 p-3 rounded-lg border-2 border-amber-900 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍲</span>
          <div>
            <div className="text-xs text-amber-800 font-semibold uppercase tracking-wider">Đang Chuẩn Bị Cho Khách:</div>
            <div className="text-base font-bold text-amber-950 font-pixel">
              {selectedCustomerOrder || 'Chưa có đơn hàng (Chờ khách đến xuồng)'}
            </div>
          </div>
        </div>

        {/* Quest Bar Display */}
        <div className="bg-red-800 text-amber-100 px-4 py-2 rounded-lg border-2 border-red-950 font-bold text-sm font-pixel flex items-center gap-2 shadow-sm">
          <span>📜</span>
          <span>{questProgress}</span>
        </div>
      </div>

      {/* Ingredient Selector Grid */}
      <div>
        <div className="text-xs font-bold text-amber-900 mb-2 flex items-center justify-between">
          <span>CHỌN NGUYÊN LIỆU NẤU HỦ TIẾU GÕ:</span>
          <span className="text-amber-700 italic">Nhấp vào từng nguyên liệu để thêm vào bát</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {ingredients.map((ing) => (
            <button
              key={ing.id}
              onClick={() => onToggleIngredient(ing.id)}
              className={`p-2 rounded-lg pixel-btn font-bold text-xs flex flex-col items-center justify-center gap-1 border-2 transition-all ${
                ing.added
                  ? 'bg-emerald-600 text-white border-emerald-900 shadow-[2px_2px_0px_#064e3b]'
                  : 'bg-amber-50 text-amber-900 border-amber-800 hover:bg-amber-200'
              }`}
            >
              <span className="text-2xl">{ing.icon}</span>
              <span className="text-center">{ing.name}</span>
              {ing.added && <span className="text-[10px] bg-emerald-800 text-emerald-100 px-1 rounded">✓ Đã thêm</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Red Serving Button "Bán hủ tiếu" */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t-2 border-amber-300">
        <div className="text-xs text-amber-900">
          💡 <span className="font-semibold">Mẹo Miền Tây:</span> Hoàn thành nguyên liệu đúng yêu cầu của khách để nhận thưởng tiền Xu cao hơn và hoàn thành Nhiệm Vụ!
        </div>

        <button
          onClick={onCookAndServe}
          disabled={isCooking}
          className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-lg font-pixel rounded-xl pixel-border-red shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-3 cursor-pointer"
        >
          <span className="text-2xl animate-bounce">🍜</span>
          <span>{isCooking ? 'ĐANG CHẾ BIẾN...' : 'BÁN HỦ TIẾU'}</span>
        </button>
      </div>
    </div>
  );
};
