import React from 'react';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const recipes = [
    {
      name: 'Hủ Tiếu Gõ Truyền Thống',
      ingredients: ['Sợi hủ tiếu', 'Nước lèo ninh xương', 'Thịt xá xíu', 'Hẹ & Giá'],
      price: '25 Xu',
      desc: 'Món hủ tiếu gõ quen thuộc ngọt thanh vị xương ống ninh kỹ, xắt vài lát thịt xá xíu mỏng, rắc hẹ xanh tươi.',
    },
    {
      name: 'Hủ Tiếu Mì Đặc Biệt',
      ingredients: ['Sợi hủ tiếu', 'Nước lèo ninh xương', 'Thịt xá xíu', 'Trứng cút', 'Hẹ & Giá'],
      price: '35 Xu',
      desc: 'Bát hủ tiếu đậm đà kết hợp trứng cút bùi bùi và thịt xá xíu giòn ngọt, thơm lừng góc sông.',
    },
    {
      name: 'Hủ Tiếu Tôm Thịt Cửu Long',
      ingredients: ['Sợi hủ tiếu', 'Nước lèo ninh xương', 'Thịt xá xíu', 'Tôm tươi', 'Hẹ & Giá'],
      price: '45 Xu',
      desc: 'Đặc sản sông nước Miền Tây với tôm sông ngọt thịt tươi ngon, đánh bắt từ sáng sớm.',
    },
    {
      name: 'Hủ Tiếu Thập Cẩm Thượng Hạng',
      ingredients: ['Sợi hủ tiếu', 'Nước lèo ninh xương', 'Thịt xá xíu', 'Trứng cút', 'Tôm tươi', 'Hẹ & Giá'],
      price: '60 Xu',
      desc: 'Bát hủ tiếu đầy đặn nhất ghe dành cho thực khách sành ăn, đầy đủ tôm, trứng cút, xá xíu ngập tràn.',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-amber-100 max-w-2xl w-full rounded-2xl pixel-border p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b-2 border-amber-800 pb-3 mb-4">
          <h2 className="text-xl font-bold font-pixel text-amber-950 flex items-center gap-2">
            <span>📜</span> SỔ TAY CÔNG THỨC HỦ TIẾU GÕ
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg pixel-btn border border-red-950 text-xs font-pixel"
          >
            Đóng [X]
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {recipes.map((r, i) => (
            <div key={i} className="p-4 bg-amber-50 rounded-xl border-2 border-amber-800 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-amber-950 font-pixel">{r.name}</span>
                <span className="text-xs bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-full font-pixel">
                  Giá: {r.price}
                </span>
              </div>
              <p className="text-xs text-amber-800">{r.desc}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="text-[11px] font-bold text-amber-900 mr-1">Thành phần:</span>
                {r.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-amber-200 text-amber-900 font-semibold px-2 py-0.5 rounded border border-amber-400"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-amber-100 max-w-2xl w-full rounded-2xl pixel-border p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b-2 border-amber-800 pb-3 mb-4">
          <h2 className="text-xl font-bold font-pixel text-amber-950 flex items-center gap-2">
            <span>🌾</span> VĂN HÓA CHỢ NỔI SÔNG CỬU LONG
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg pixel-btn border border-red-950 text-xs font-pixel"
          >
            Đóng [X]
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-amber-900 leading-relaxed">
          <p>
            <strong>Chợ Nổi Miền Tây</strong> (như Chợ Nổi Cái Răng, Phong Điền, Ngã Bảy) là di sản văn hóa đặc sắc của miền sông nước Nam Bộ. Từ tờ mờ sáng, hàng trăm chiếc ghe, xuồng ba lá tấp nập trên sông.
          </p>
          <div className="p-3 bg-amber-200 rounded-lg border-l-4 border-amber-800">
            <strong>Cây Bẹo Là Gi:</strong> Người bán cắm một cây tre dài trước mũi ghe, gọi là <em>Cây Bẹo</em>. Họ treo trái cây gì lên cây tre (như Dưa hấu, Thơm, Chôm chôm) thì khách bơi xuồng qua nhìn từ xa là biết ghe đó bán loại nông sản gì mà không cần phải rao!
          </div>
          <p>
            <strong>Tiếng Gõ HỦ TIẾU GÕ:</strong> Những chiếc ghe bán hủ tiếu gõ len lỏi giữa các xuồng chở trái cây. Người bán cầm hai thanh gỗ gõ "keng... keng... keng" báo hiệu tô hủ tiếu nóng hổi, thơm ngon đã sẵn sàng phục vụ thực khách giữa không gian nắng ấm sớm mai.
          </p>
        </div>
      </div>
    </div>
  );
};
