// src/components/wheel/ColorWheel.tsx

import React, { useRef, useEffect, useCallback } from 'react';

interface ColorWheelProps {
  currentHue: number;          // Seçili mevcut derece (0 - 360)
  isSegmented?: boolean;      // true: 48 Dilimli Temel Mod, false: Sürekli Tayf
  size?: number;               // Tuval boyutu (Varsayılan: 320px)
  onHueChange: (hue: number) => void; // Açı değiştiğinde çağrılan fonksiyon
}

export const ColorWheel: React.FC<ColorWheelProps> = ({
  currentHue,
  isSegmented = false,
  size = 320,
  onHueChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // HTML5 Canvas Üzerine Çemberi Çizen Motor
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const radius = size / 2;
    const centerX = radius;
    const centerY = radius;
    const outerRadius = radius - 15;
    const innerRadius = radius - 55; // Çember genişliği

    ctx.clearRect(0, 0, size, size);

    if (isSegmented) {
      // TEMEL MOD: 48 Ayrık Dilimli Renk Çemberi
      const segments = 48;
      const angleStep = (Math.PI * 2) / segments;

      for (let i = 0; i < segments; i++) {
        const startAngle = i * angleStep - Math.PI / 2;
        const endAngle = (i + 1) * angleStep - Math.PI / 2;
        const hue = (i / segments) * 360;

        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
        ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
        ctx.closePath();

        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fill();
        ctx.strokeStyle = '#121212';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    } else {
      // GELİŞMİŞ MOD: Pürüzsüz Sürekli Renk Tayfı
      const step = 0.01;
      for (let angle = 0; angle < Math.PI * 2; angle += step) {
        const startAngle = angle - Math.PI / 2;
        const endAngle = angle + step - Math.PI / 2;
        const hue = (angle / (Math.PI * 2)) * 360;

        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
        ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
        ctx.closePath();

        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fill();
      }
    }

    // SEÇİLİ RENK TUTAMAĞI (INDICATOR NODE)
    const hueRad = ((currentHue - 90) * Math.PI) / 180;
    const handleRadius = (outerRadius + innerRadius) / 2;
    const handleX = centerX + handleRadius * Math.cos(hueRad);
    const handleY = centerY + handleRadius * Math.sin(hueRad);

    // Dış Beyaz Halka
    ctx.beginPath();
    ctx.arc(handleX, handleY, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // İç Seçili Renk
    ctx.beginPath();
    ctx.arc(handleX, handleY, 7, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${currentHue}, 100%, 50%)`;
    ctx.fill();
  }, [currentHue, isSegmented, size]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // Fare ve Dokunmatik Etkileşim Hesaplayıcı
  const handleInteract = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;

    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    if (isSegmented) {
      const snapStep = 360 / 48; // 7.5 derece
      angle = Math.round(angle / snapStep) * snapStep;
      if (angle >= 360) angle = 0;
    }

    onHueChange(Math.round(angle * 100) / 100);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleInteract(e.clientX, e.clientY);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleInteract(moveEvent.clientX, moveEvent.clientY);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Mobil cihazlarda sayfanın aşağı/yukarı kaymasını engeller
    const touch = e.touches[0];
    handleInteract(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Çember döndürülürken sayfa kaymasını engeller
    const touch = e.touches[0];
    handleInteract(touch.clientX, touch.clientY);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{ cursor: 'pointer', touchAction: 'none' }}
      />
    </div>
  );
};