import React, { useEffect, useRef } from 'react';

interface MekongMarketCanvasProps {
  vendorCooking: boolean;
  customers: Array<{
    id: string;
    name: string;
    orderName: string;
    patience: number;
    maxPatience: number;
    xPos: number;
  }>;
  hangingFruits: string[]; // List of fruit names on Cây Bẹo e.g. ["Dứa", "Dưa hấu", "Chôm chôm"]
  servingAnimation: boolean;
  timeString: string;
  coins: number;
}

export const MekongMarketCanvas: React.FC<MekongMarketCanvasProps> = ({
  vendorCooking,
  customers,
  hangingFruits,
  servingAnimation,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    let animationFrameId: number;
    let tick = 0;

    // Floating particles (steam, light motes, water ripples)
    const steamParticles: { x: number; y: number; size: number; opacity: number; speedY: number }[] = [];
    for (let i = 0; i < 12; i++) {
      steamParticles.push({
        x: 235 + Math.random() * 14 - 7,
        y: 200 + Math.random() * 15,
        size: 3 + Math.random() * 4,
        opacity: Math.random(),
        speedY: 0.4 + Math.random() * 0.4,
      });
    }

    const render = () => {
      tick++;
      const width = canvas.width;
      const height = canvas.height;

      // --- 1. SKY & MORNING SUNLIGHT (WARM VIBRANT PASTEL GRADIENT) ---
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.55);
      skyGrad.addColorStop(0, '#7dd3fc'); // Sky blue
      skyGrad.addColorStop(0.5, '#bae6fd');
      skyGrad.addColorStop(0.85, '#fde68a'); // Warm morning yellow
      skyGrad.addColorStop(1, '#fef08a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height * 0.55);

      // Pixel Sun (Top Right Sun)
      const sunX = width - 70;
      const sunY = 45;
      const sunPulse = Math.sin(tick * 0.05) * 2;

      // Sun Halo Rays
      ctx.fillStyle = 'rgba(254, 240, 138, 0.3)';
      ctx.fillRect(sunX - 22 - sunPulse, sunY - 22 - sunPulse, 44 + sunPulse * 2, 44 + sunPulse * 2);
      ctx.fillStyle = 'rgba(253, 224, 71, 0.6)';
      ctx.fillRect(sunX - 16, sunY - 16, 32, 32);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(sunX - 11, sunY - 11, 22, 22);

      // Pixel Clouds
      const cloudX1 = ((tick * 0.3) % (width + 120)) - 60;
      const cloudX2 = (((tick * 0.2) + 200) % (width + 120)) - 60;

      const drawPixelCloud = (cx: number, cy: number) => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx, cy, 40, 10);
        ctx.fillRect(cx + 8, cy - 6, 24, 16);
        ctx.fillRect(cx + 16, cy - 10, 12, 10);
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(cx, cy + 8, 40, 3);
      };

      drawPixelCloud(cloudX1, 30);
      drawPixelCloud(cloudX2, 60);

      // --- 2. RIVERBANK & WATER COCONUT TREES (DỪA NƯỚC) ---
      const bankY = height * 0.42;

      // Far riverbank silhouette
      ctx.fillStyle = '#166534'; // Deep tropical green
      for (let x = 0; x < width; x += 16) {
        const treeH = 30 + Math.sin(x * 0.05) * 8;
        ctx.fillRect(x, bankY - treeH, 16, treeH);
      }

      // Water Coconut Palm Leaves (Dừa Nước)
      ctx.fillStyle = '#15803d'; // Medium palm green
      for (let x = 0; x < width; x += 32) {
        // Fronds
        ctx.fillRect(x - 8, bankY - 38, 6, 20);
        ctx.fillRect(x + 10, bankY - 42, 6, 24);
        ctx.fillRect(x - 14, bankY - 30, 28, 6);
        ctx.fillRect(x - 20, bankY - 24, 40, 6);
      }
      ctx.fillStyle = '#22c55e'; // Highlight green
      for (let x = 8; x < width; x += 32) {
        ctx.fillRect(x - 10, bankY - 34, 4, 12);
        ctx.fillRect(x + 8, bankY - 36, 4, 14);
      }

      // --- 3. MUDDY MEKONG RIVER WATER (SÔNG MẸ ĐỤC PHÙ SA) ---
      const riverGrad = ctx.createLinearGradient(0, bankY, 0, height);
      riverGrad.addColorStop(0, '#a16207'); // Muddy golden brown
      riverGrad.addColorStop(0.3, '#854d0e');
      riverGrad.addColorStop(0.7, '#713f12');
      riverGrad.addColorStop(1, '#582f0e');
      ctx.fillStyle = riverGrad;
      ctx.fillRect(0, bankY, width, height - bankY);

      // Water Ripples & Morning Sunlight Reflections
      const waveShift = (tick * 0.5) % 16;
      ctx.fillStyle = '#fde047'; // Golden morning glint
      for (let y = bankY + 10; y < height; y += 14) {
        const rowOffset = (y % 4 === 0) ? waveShift : -waveShift;
        for (let x = 0; x < width; x += 40) {
          ctx.fillRect(x + rowOffset, y, 12, 2);
        }
      }

      ctx.fillStyle = '#ca8a04'; // Muted ripple
      for (let y = bankY + 18; y < height; y += 18) {
        const rowOffset = (y % 3 === 0) ? -waveShift * 0.8 : waveShift * 0.8;
        for (let x = 20; x < width; x += 50) {
          ctx.fillRect(x + rowOffset, y, 18, 2);
        }
      }

      // --- 4. CUSTOMER CANOES (XUỒNG BA LÁ) ON THE RIVER ---
      customers.forEach((cust, idx) => {
        const boatY = bankY + 45 + idx * 35;
        const boatX = cust.xPos;
        const bob = Math.sin(tick * 0.08 + idx * 1.5) * 3;

        // Wooden Xuồng Ba Lá Body
        ctx.fillStyle = '#78350f'; // Dark wood
        ctx.beginPath();
        ctx.moveTo(boatX - 35, boatY + bob + 10);
        ctx.lineTo(boatX - 25, boatY + bob + 22);
        ctx.lineTo(boatX + 25, boatY + bob + 22);
        ctx.lineTo(boatX + 35, boatY + bob + 10);
        ctx.fill();

        ctx.fillStyle = '#b45309'; // Medium wood plank
        ctx.fillRect(boatX - 22, boatY + bob + 12, 44, 8);

        // Water Splash under Canoe
        ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
        ctx.fillRect(boatX - 30, boatY + bob + 21, 60, 2);

        // Customer Figure in Canoe
        // Conical hat
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.moveTo(boatX, boatY + bob - 16);
        ctx.lineTo(boatX - 12, boatY + bob - 4);
        ctx.lineTo(boatX + 12, boatY + bob - 4);
        ctx.fill();

        // Customer Shirt
        ctx.fillStyle = idx % 2 === 0 ? '#38bdf8' : '#f472b6'; // Pastel blue or pink shirt
        ctx.fillRect(boatX - 6, boatY + bob - 4, 12, 14);

        // Order Speech Bubble
        const bubbleY = boatY + bob - 42;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(boatX - 45, bubbleY, 90, 20);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        ctx.strokeRect(boatX - 45, bubbleY, 90, 20);

        // Bubble Triangle Pointer
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(boatX - 3, bubbleY + 20, 6, 4);

        // Order Text inside Bubble
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 10px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(cust.orderName, boatX, bubbleY + 13);

        // Patience Bar
        const pRatio = Math.max(0, cust.patience / cust.maxPatience);
        ctx.fillStyle = '#334155';
        ctx.fillRect(boatX - 20, bubbleY - 6, 40, 4);
        ctx.fillStyle = pRatio > 0.5 ? '#22c55e' : pRatio > 0.25 ? '#eab308' : '#ef4444';
        ctx.fillRect(boatX - 20, bubbleY - 6, 40 * pRatio, 4);
      });

      // --- 5. MAIN WOODEN FLOATING MARKET BOAT (GHE HỦ TIẾU GÕ) ---
      const boatBaseX = 220;
      const boatBaseY = bankY + 80;
      const boatBob = Math.sin(tick * 0.05) * 4;

      // Wooden Boat Hull (Ghe Gỗ Miền Tây)
      // Dark wood outline
      ctx.fillStyle = '#3f2305';
      ctx.beginPath();
      ctx.moveTo(boatBaseX - 110, boatBaseY + boatBob + 10);
      ctx.lineTo(boatBaseX - 85, boatBaseY + boatBob + 50);
      ctx.lineTo(boatBaseX + 105, boatBaseY + boatBob + 50);
      ctx.lineTo(boatBaseX + 125, boatBaseY + boatBob + 10);
      ctx.fill();

      // Plank details
      ctx.fillStyle = '#854d0e'; // Main hull warm brown
      ctx.beginPath();
      ctx.moveTo(boatBaseX - 102, boatBaseY + boatBob + 14);
      ctx.lineTo(boatBaseX - 80, boatBaseY + boatBob + 45);
      ctx.lineTo(boatBaseX + 98, boatBaseY + boatBob + 45);
      ctx.lineTo(boatBaseX + 118, boatBaseY + boatBob + 14);
      ctx.fill();

      // Yellow Boat Bow Eyes (Mắt Ghe Miền Tây - Traditional eyes painted on Mekong boats!)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(boatBaseX - 98, boatBaseY + boatBob + 20, 10, 8);
      ctx.fillStyle = '#000000';
      ctx.fillRect(boatBaseX - 94, boatBaseY + boatBob + 22, 5, 5);
      ctx.fillStyle = '#ef4444'; // Red bow trim
      ctx.fillRect(boatBaseX - 105, boatBaseY + boatBob + 12, 20, 3);

      // Straw Roof (Mái Lá)
      ctx.fillStyle = '#f59e0b'; // Warm straw yellow
      ctx.fillRect(boatBaseX - 70, boatBaseY + boatBob - 55, 140, 18);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(boatBaseX - 75, boatBaseY + boatBob - 37, 150, 6);
      // Support Wooden Poles
      ctx.fillStyle = '#543310';
      ctx.fillRect(boatBaseX - 60, boatBaseY + boatBob - 31, 6, 45);
      ctx.fillRect(boatBaseX + 54, boatBaseY + boatBob - 31, 6, 45);

      // --- SIGN MOUNTED ON BOAT ROOF: "HỦ TIẾU GÕ" ---
      const signX = boatBaseX - 55;
      const signY = boatBaseY + boatBob - 88;
      const signW = 110;
      const signH = 30;

      // Red Retro Frame
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(signX, signY, signW, signH);
      ctx.fillStyle = '#fef08a'; // Bright pastel inner board
      ctx.fillRect(signX + 3, signY + 3, signW - 6, signH - 6);

      // Sign Text: "HỦ TIẾU GÕ"
      ctx.fillStyle = '#991b1b';
      ctx.font = '900 13px "Silkscreen", "Be Vietnam Pro", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('HỦ TIẾU GÕ', boatBaseX, signY + 20);

      // --- TALL BAMBOO POLE (CÂY BẸO) HANGING FRUITS IN FRONT OF BOAT ---
      const beoX = boatBaseX + 110;
      const beoY = boatBaseY + boatBob + 10;
      // Bamboo pole stem
      ctx.fillStyle = '#65a30d'; // Bamboo green
      ctx.fillRect(beoX, beoY - 110, 6, 110);
      ctx.fillStyle = '#84cc16';
      ctx.fillRect(beoX + 2, beoY - 108, 2, 106);

      // Bamboo nodes
      ctx.fillStyle = '#3f6212';
      for (let nodeY = beoY - 100; nodeY < beoY; nodeY += 25) {
        ctx.fillRect(beoX - 1, nodeY, 8, 3);
      }

      // Hanging Fruits on Cây Bẹo
      const fruitYStart = beoY - 95;
      hangingFruits.forEach((fruitName, fIdx) => {
        const fy = fruitYStart + fIdx * 24;
        // String
        ctx.fillStyle = '#78350f';
        ctx.fillRect(beoX - 6, fy - 6, 8, 2);

        if (fruitName.includes('Dứa') || fruitName.includes('Thơm') || fruitName === 'Thơm') {
          // Pineapple
          ctx.fillStyle = '#eab308';
          ctx.fillRect(beoX - 12, fy, 12, 16);
          ctx.fillStyle = '#84cc16'; // Crown
          ctx.fillRect(beoX - 10, fy - 6, 8, 6);
        } else if (fruitName.includes('Dưa hấu')) {
          // Watermelon
          ctx.fillStyle = '#15803d';
          ctx.fillRect(beoX - 14, fy, 16, 16);
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(beoX - 12, fy + 2, 4, 12);
        } else if (fruitName.includes('Chôm chôm')) {
          // Rambutan
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(beoX - 10, fy, 12, 12);
          ctx.fillStyle = '#fde047'; // Hair spiky dots
          ctx.fillRect(beoX - 12, fy + 2, 2, 2);
          ctx.fillRect(beoX + 2, fy + 8, 2, 2);
        } else {
          // Default Coconut/Fruit
          ctx.fillStyle = '#16a34a';
          ctx.fillRect(beoX - 10, fy, 12, 12);
        }
      });

      // --- 6. FRIENDLY VIETNAMESE VENDOR ON THE BOAT ---
      const vendorX = boatBaseX - 25;
      const vendorY = boatBaseY + boatBob - 28;

      // Green Áo Bà Ba Body
      ctx.fillStyle = '#16a34a'; // Vibrant green áo bà ba
      ctx.fillRect(vendorX - 12, vendorY, 24, 26);

      // Checkered Scarf (Khăn Rằn Black/White)
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(vendorX - 10, vendorY, 20, 6);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(vendorX - 8, vendorY, 4, 6);
      ctx.fillRect(vendorX, vendorY, 4, 6);

      // Face
      ctx.fillStyle = '#fde047';
      ctx.fillRect(vendorX - 8, vendorY - 14, 16, 14);
      // Eye & Smile
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(vendorX - 4, vendorY - 10, 2, 3);
      ctx.fillRect(vendorX + 2, vendorY - 10, 2, 3);
      ctx.fillRect(vendorX - 3, vendorY - 4, 6, 2);

      // Conical Hat (Nón Lá)
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(vendorX, vendorY - 26);
      ctx.lineTo(vendorX - 16, vendorY - 12);
      ctx.lineTo(vendorX + 16, vendorY - 12);
      ctx.fill();

      // --- STEAMING METAL POT (NỒI NƯỚC LÈO BỐC KHÓI) ---
      const potX = boatBaseX + 15;
      const potY = boatBaseY + boatBob - 12;

      // Metal Pot
      ctx.fillStyle = '#64748b'; // Metallic grey
      ctx.fillRect(potX - 14, potY, 28, 22);
      ctx.fillStyle = '#94a3b8'; // Highlight
      ctx.fillRect(potX - 12, potY + 2, 6, 18);
      ctx.fillStyle = '#334155'; // Pot Rim
      ctx.fillRect(potX - 16, potY, 32, 4);

      // Boiling Broth Glow inside
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(potX - 12, potY - 2, 24, 3);

      // Animated Steam Particles
      steamParticles.forEach((sp) => {
        sp.y -= sp.speedY;
        if (sp.y < potY - 40) {
          sp.y = potY - 2;
          sp.x = potX + (Math.random() * 16 - 8);
          sp.opacity = 0.8;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${sp.opacity})`;
        ctx.fillRect(sp.x, sp.y, sp.size, sp.size);
      });

      // Serving Bowls on counter
      ctx.fillStyle = '#f8fafc'; // White ceramic bowl
      ctx.fillRect(boatBaseX - 50, boatBaseY + boatBob - 10, 14, 8);
      ctx.fillStyle = '#ef4444'; // Red trim
      ctx.fillRect(boatBaseX - 50, boatBaseY + boatBob - 10, 14, 2);

      // Vendor animation when cooking
      if (vendorCooking) {
        ctx.fillStyle = '#eab308'; // Ladle
        ctx.fillRect(vendorX + 10, vendorY + Math.sin(tick * 0.3) * 4, 12, 3);
      }

      // Serving Golden Coin / Hearts Floating Effect
      if (servingAnimation) {
        const floatY = boatBaseY + boatBob - 60 - ((tick % 30) * 1.5);
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 16px "Silkscreen", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('+25 XU!', boatBaseX - 30, floatY);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [vendorCooking, customers, hangingFruits, servingAnimation]);

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl pixel-border bg-slate-900 shadow-2xl">
      <canvas
        ref={canvasRef}
        width={768}
        height={432}
        className="w-full h-auto block pixelated bg-sky-200 cursor-pointer"
      />
    </div>
  );
};
