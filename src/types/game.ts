export interface Ingredient {
  id: string;
  name: string; // e.g., "Sợi hủ tiếu", "Thịt xá xíu", "Trứng cút", "Tôm tươi", "Hẹ & Giá"
  icon: string;
  cost: number;
}

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  orderName: string; // e.g., "Hủ tiếu mì xá xíu", "Hủ tiếu đặc biệt", "Cà phê sữa đá"
  requiredIngredients: string[];
  price: number;
  patience: number; // 0 to 100
  maxPatience: number;
  xPos: number; // position on river
}

export interface FruitBiet {
  id: string;
  name: string; // "Thơm / Dứa", "Dưa hấu", "Chôm chôm", "Xoài cát", "Dừa tươi"
  icon: string;
  effect: string;
  unlocked: boolean;
  cost: number;
}

export interface Upgrade {
  id: string;
  title: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  effectText: string;
}

export interface Quest {
  id: string;
  title: string;
  current: number;
  target: number;
  rewardCoins: number;
  completed: boolean;
}
