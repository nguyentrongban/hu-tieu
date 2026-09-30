/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { MekongMarketCanvas } from './components/MekongMarketCanvas';
import { CookingPanel } from './components/CookingPanel';
import { FruitTreeUpgrades } from './components/FruitTreeUpgrades';
import { RecipeModal, StoryModal } from './components/Modals';
import {
  playCoinSound,
  playGoHuTieuSound,
  playCookSound,
  playQuestCompleteSound,
  toggleAmbientRiver,
} from './utils/audio';
import { FruitBiet, Upgrade } from './types/game';

// Import generated pixel art visual assets
import heroImage from './assets/images/hero_mekong_floating_market_1790697867394.jpg';
import vendorImage from './assets/images/mekong_boat_vendor_1790697885865.jpg';
import boatImage from './assets/images/mekong_xuong_ba_la_1790697899889.jpg';
import bowlImage from './assets/images/mekong_hu_tieu_bowl_1790697911742.jpg';

export default function App() {
  // Required Initial State
  const [coins, setCoins] = useState<number>(578); // Exact requested initial coins: 578
  const [timeString, setTimeString] = useState<string>('Sáng 08:22'); // Exact requested initial clock: Sáng 08:22
  const [servedCount, setServedCount] = useState<number>(1); // Initial quest state: 1/5
  const [questTarget] = useState<number>(5);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'GAME' | 'TREE' | 'GALLERY'>('GAME');

  // Modals
  const [showRecipes, setShowRecipes] = useState<boolean>(false);
  const [showStory, setShowStory] = useState<boolean>(false);

  // Animation states
  const [vendorCooking, setVendorCooking] = useState<boolean>(false);
  const [servingAnimation, setServingAnimation] = useState<boolean>(false);

  // Ingredients for bowl preparation
  const [ingredients, setIngredients] = useState([
    { id: '1', name: 'Sợi hủ tiếu', icon: '🍜', added: true },
    { id: '2', name: 'Nước lèo ninh xương', icon: '🫕', added: true },
    { id: '3', name: 'Thịt xá xíu', icon: '🥩', added: true },
    { id: '4', name: 'Trứng cút', icon: '🥚', added: false },
    { id: '5', name: 'Tôm tươi', icon: '🦐', added: false },
    { id: '6', name: 'Hẹ & Giá', icon: '🌿', added: true },
  ]);

  // Cây Bẹo Hanging Fruits
  const [fruits] = useState<FruitBiet[]>([
    { id: '1', name: 'Thơm / Dứa', icon: '🍍', effect: '+15% Tiền Típ', unlocked: true, cost: 0 },
    { id: '2', name: 'Dưa hấu', icon: '🍉', effect: 'Khách Kiên Nhẫn Hơn', unlocked: true, cost: 0 },
    { id: '3', name: 'Chôm chôm', icon: '🔴', effect: '+20% Xu Đơn Đặc Biệt', unlocked: true, cost: 0 },
    { id: '4', name: 'Xoài cát', icon: '🥭', effect: 'Thu Hút VIP Sông Tiền', unlocked: true, cost: 50 },
    { id: '5', name: 'Dừa tươi', icon: '🥥', effect: 'Phục vụ Nhanh Hơn', unlocked: true, cost: 80 },
  ]);
  const [activeHanging, setActiveHanging] = useState<string[]>(['Thơm / Dứa', 'Dưa hấu', 'Chôm chôm']);

  // Boat Upgrades
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: 'pot',
      title: 'Nồi Nước Lèo Bằng Đồng',
      description: 'Nước lèo sôi nhanh hơn, tỏa hương thơm ngát khắp khúc sông.',
      cost: 150,
      level: 1,
      maxLevel: 3,
      effectText: 'Tăng tốc nấu +25%',
    },
    {
      id: 'boat',
      title: 'Ghe Gỗ Mái Lá Mới',
      description: 'Che nắng sớm ấm áp, tạo không gian thoáng mát cho thực khách.',
      cost: 250,
      level: 1,
      maxLevel: 3,
      effectText: 'Tăng lượng khách +30%',
    },
    {
      id: 'pole',
      title: 'Cây Bẹo Tre Cao Cấp',
      description: 'Treo thêm nhiều loại trái cây thu hút khách xuồng xa.',
      cost: 300,
      level: 1,
      maxLevel: 2,
      effectText: 'Mở rộng vị trí treo trái cây',
    },
  ]);

  // Active Customers Queue floating on canoes
  const [customers, setCustomers] = useState([
    {
      id: 'c1',
      name: 'Chú Sáu (Xuồng Ba Lá)',
      orderName: 'Hủ Tiếu Gõ Truyền Thống',
      patience: 90,
      maxPatience: 100,
      xPos: 120,
    },
    {
      id: 'c2',
      name: 'Cô Ba Miền Tây',
      orderName: 'Hủ Tiếu Mì Đặc Biệt',
      patience: 80,
      maxPatience: 100,
      xPos: 650,
    },
  ]);

  // Time simulation clock
  useEffect(() => {
    const timer = setInterval(() => {
      // Gradually advance clock format e.g. "Sáng 08:22"
      setTimeString((prev) => {
        const match = prev.match(/(\d+):(\d+)/);
        if (match) {
          let mins = parseInt(match[2], 10) + 1;
          let hrs = parseInt(match[1], 10);
          if (mins >= 60) {
            mins = 0;
            hrs = (hrs + 1) % 24;
          }
          const minStr = mins < 10 ? `0${mins}` : `${mins}`;
          const hrStr = hrs < 10 ? `0${hrs}` : `${hrs}`;
          return `Sáng ${hrStr}:${minStr}`;
        }
        return 'Sáng 08:22';
      });

      // Decrease patience slowly
      setCustomers((prev) =>
        prev.map((c) => ({
          ...c,
          patience: Math.max(10, c.patience - 0.5),
        }))
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Ambient sound toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    toggleAmbientRiver(next);
  };

  // Toggle Ingredient
  const handleToggleIngredient = (id: string) => {
    if (soundEnabled) playGoHuTieuSound();
    setIngredients((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, added: !ing.added } : ing))
    );
  };

  // Toggle Hanging Fruit on Cây Bẹo
  const handleToggleHangFruit = (fruitName: string) => {
    if (soundEnabled) playCoinSound();
    setActiveHanging((prev) => {
      if (prev.includes(fruitName)) {
        return prev.filter((f) => f !== fruitName);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), fruitName];
      }
      return [...prev, fruitName];
    });
  };

  // Buy Upgrade
  const handleBuyUpgrade = (upgradeId: string) => {
    const target = upgrades.find((u) => u.id === upgradeId);
    if (!target || coins < target.cost || target.level >= target.maxLevel) return;

    if (soundEnabled) playQuestCompleteSound();
    setCoins((prev) => prev - target.cost);
    setUpgrades((prev) =>
      prev.map((u) =>
        u.id === upgradeId ? { ...u, level: u.level + 1, cost: Math.floor(u.cost * 1.6) } : u
      )
    );
  };

  // Primary Action: "BÁN HỦ TIẾU"
  const handleCookAndServe = () => {
    if (vendorCooking) return;

    if (soundEnabled) {
      playGoHuTieuSound();
      playCookSound();
    }

    setVendorCooking(true);

    setTimeout(() => {
      if (soundEnabled) playCoinSound();

      setVendorCooking(false);
      setServingAnimation(true);

      // Earn Coins (25 Xu base + bonus)
      const earned = 25;
      setCoins((prev) => prev + earned);

      // Advance Quest Progression
      setServedCount((prev) => {
        const next = prev + 1;
        if (next >= questTarget) {
          if (soundEnabled) playQuestCompleteSound();
        }
        return next;
      });

      // Update customers
      setCustomers((prev) => {
        const remaining = prev.slice(1);
        const newCustomerNames = [
          'Anh Tư Sông Tiền',
          'Bác Tám Căn Giờ',
          'Chị Mười Chợ Nổi',
          'Em Mai Cần Thơ',
        ];
        const newOrders = [
          'Hủ Tiếu Gõ Truyền Thống',
          'Hủ Tiếu Mì Đặc Biệt',
          'Hủ Tiếu Tôm Thịt Cửu Long',
          'Hủ Tiếu Thập Cẩm',
        ];
        const randomName = newCustomerNames[Math.floor(Math.random() * newCustomerNames.length)];
        const randomOrder = newOrders[Math.floor(Math.random() * newOrders.length)];

        return [
          ...remaining,
          {
            id: `c_${Date.now()}`,
            name: randomName,
            orderName: randomOrder,
            patience: 100,
            maxPatience: 100,
            xPos: Math.random() > 0.5 ? 140 : 640,
          },
        ];
      });

      setTimeout(() => {
        setServingAnimation(false);
      }, 1500);
    }, 800);
  };

  // Quest Text string required
  const questText = `Nhiệm vụ: Phục vụ khách hàng ${servedCount}/${questTarget}`;

  return (
    <div className="min-h-screen bg-amber-50 text-slate-800 p-2 sm:p-4 md:p-6 selection:bg-amber-300">
      {/* Header Bar */}
      <HeaderBar
        coins={coins}
        timeString={timeString}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenStory={() => setShowStory(true)}
        onOpenRecipes={() => setShowRecipes(true)}
      />

      {/* Navigation Tabs */}
      <div className="w-full max-w-4xl mx-auto mb-4 flex items-center justify-between bg-amber-200 p-1.5 rounded-xl border-2 border-amber-900 shadow-sm">
        <button
          onClick={() => setActiveTab('GAME')}
          className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs sm:text-sm font-pixel transition-all ${
            activeTab === 'GAME'
              ? 'bg-amber-800 text-amber-100 border-2 border-amber-950 shadow-sm'
              : 'text-amber-900 hover:bg-amber-300'
          }`}
        >
          🍜 QUÁN HỦ TIẾU GÕ
        </button>
        <button
          onClick={() => setActiveTab('TREE')}
          className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs sm:text-sm font-pixel transition-all ${
            activeTab === 'TREE'
              ? 'bg-amber-800 text-amber-100 border-2 border-amber-950 shadow-sm'
              : 'text-amber-900 hover:bg-amber-300'
          }`}
        >
          🎋 CÂY BẸO & NÂNG CẤP
        </button>
        <button
          onClick={() => setActiveTab('GALLERY')}
          className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs sm:text-sm font-pixel transition-all ${
            activeTab === 'GALLERY'
              ? 'bg-amber-800 text-amber-100 border-2 border-amber-950 shadow-sm'
              : 'text-amber-900 hover:bg-amber-300'
          }`}
        >
          🖼️ BỘ ẢNH PIXEL ART
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'GAME' && (
        <main className="flex flex-col items-center">
          {/* 16-Bit Pixel Canvas Game Viewport */}
          <MekongMarketCanvas
            vendorCooking={vendorCooking}
            customers={customers}
            hangingFruits={activeHanging}
            servingAnimation={servingAnimation}
            timeString={timeString}
            coins={coins}
          />

          {/* Interactive Cooking & Serving Controls */}
          <CookingPanel
            ingredients={ingredients}
            onToggleIngredient={handleToggleIngredient}
            onCookAndServe={handleCookAndServe}
            isCooking={vendorCooking}
            selectedCustomerOrder={customers[0]?.orderName}
            questProgress={questText}
          />
        </main>
      )}

      {activeTab === 'TREE' && (
        <FruitTreeUpgrades
          fruits={fruits}
          activeHanging={activeHanging}
          onToggleHangFruit={handleToggleHangFruit}
          upgrades={upgrades}
          coins={coins}
          onBuyUpgrade={handleBuyUpgrade}
        />
      )}

      {activeTab === 'GALLERY' && (
        <div className="w-full max-w-4xl mx-auto p-6 bg-amber-100 rounded-xl pixel-border">
          <h2 className="text-xl font-bold font-pixel text-amber-950 mb-2 flex items-center gap-2">
            <span>🖼️</span> BỘ BẢO TÀNG PIXEL ART CHỢ NỔI MIỀN TÂY
          </h2>
          <p className="text-xs text-amber-800 mb-6">
            Visual 16-bit retro pixel art rực rỡ nắng sáng sớm, bờ dừa nước xanh mướt, chiếc ghe gỗ mái lá gõ hủ tiếu giòn giã trên dòng sông Cửu Long.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-3 bg-amber-50 rounded-xl border-2 border-amber-800">
              <img
                src={heroImage}
                alt="2D pixel art screenshot Mekong Floating market"
                className="w-full h-auto rounded-lg pixelated border-2 border-amber-900 shadow-md"
              />
              <div className="mt-2 font-bold text-sm text-amber-950 font-pixel">
                Khung Cảnh Nắng Sớm Chợ Nổi Hủ Tiếu Gõ
              </div>
              <p className="text-xs text-amber-800 mt-1">
                Chiếc ghe gỗ mái lá nghiêng mình trên sông nước phù sa, bảng hiệu HỦ TIẾU GÕ đỏ tươi nổi bật dưới ánh nắng ấm.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border-2 border-amber-800">
              <img
                src={vendorImage}
                alt="Pixel vendor in green áo bà ba and nón lá"
                className="w-full h-auto rounded-lg pixelated border-2 border-amber-900 shadow-md"
              />
              <div className="mt-2 font-bold text-sm text-amber-950 font-pixel">
                Chị Bán Hủ Tiếu Áo Bà Ba Xanh & Nón Lá
              </div>
              <p className="text-xs text-amber-800 mt-1">
                Trang phục áo bà ba truyền thống, khăn rằn vắt vai, nụ cười xởi lởi phục vụ tô hủ tiếu bốc khói ngút ngàn.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border-2 border-amber-800">
              <img
                src={boatImage}
                alt="Pixel Xuồng ba lá customer canoe"
                className="w-full h-auto rounded-lg pixelated border-2 border-amber-900 shadow-md"
              />
              <div className="mt-2 font-bold text-sm text-amber-950 font-pixel">
                Xuồng Ba Lá Thực Khách Bơi Đến
              </div>
              <p className="text-xs text-amber-800 mt-1">
                Khách bơi xuồng chèo dọc sông, vừa thưởng thức tô hủ tiếu vừa ngắm bình minh rực rỡ.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border-2 border-amber-800">
              <img
                src={bowlImage}
                alt="Pixel bowl of Vietnamese Hu Tieu noodle soup"
                className="w-full h-auto rounded-lg pixelated border-2 border-amber-900 shadow-md"
              />
              <div className="mt-2 font-bold text-sm text-amber-950 font-pixel">
                Tô Hủ Tiếu Gõ Nóng Hổi Thơm Lừng
              </div>
              <p className="text-xs text-amber-800 mt-1">
                Bát hủ tiếu ngọt xương đậm đà, thịt xá xíu hồng, trứng cút bùi, hẹ xanh tươi roi rói.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <RecipeModal isOpen={showRecipes} onClose={() => setShowRecipes(false)} />
      <StoryModal isOpen={showStory} onClose={() => setShowStory(false)} />
    </div>
  );
}
