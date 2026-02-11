// src/components/Common/AddToCartAnimation.jsx
import { useEffect, useState } from 'react';

export default function AddToCartAnimation() {
  const [flyingItems, setFlyingItems] = useState([]);

  useEffect(() => {
    // Escuchar el evento personalizado
    const handleTrigger = (event) => {
      const { x, y } = event.detail;
      const id = Date.now(); 
      
      setFlyingItems(prev => [...prev, { id, startX: x, startY: y }]);

      setTimeout(() => {
        setFlyingItems(prev => prev.filter(item => item.id !== id));
      }, 3000);
    };

    window.addEventListener('trigger-add-to-cart-animation', handleTrigger);
    return () => window.removeEventListener('trigger-add-to-cart-animation', handleTrigger);
  }, []);

  return (
    <>
      {flyingItems.map(item => (
        <FlyingPizza key={item.id} startX={item.startX} startY={item.startY} />
      ))}
    </>
  );
}

function FlyingPizza({ startX, startY }) {
  const [styles, setStyles] = useState({
    left: `${startX}px`,
    top: `${startY}px`,
    opacity: 1,
    transform: 'translate(-50%, -50%) scale(1)' 
  });

  useEffect(() => {
    // 1. Detectar si estamos en móvil (ancho menor a 768px)
    const isMobile = window.innerWidth < 768;

    // 2. Definir el objetivo según el dispositivo
    let targetId = 'cart-icon-target'; // Por defecto Desktop (Arriba derecha)

    if (isMobile) {
        // En móvil buscamos el ícono del footer que acabamos de marcar
        const mobileTarget = document.getElementById('mobile-cart-target');
        // Si por alguna razón no existe, usamos el botón completo
        if (mobileTarget) targetId = 'mobile-cart-target';
        else targetId = 'btn-cart-footer';
    }

    const target = document.getElementById(targetId);

    if (!target) return; // Si no encuentra nada, no hace nada.

    const targetRect = target.getBoundingClientRect();
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    requestAnimationFrame(() => {
        setStyles({
            left: `${targetX}px`,
            top: `${targetY}px`,
            opacity: 0, 
            transform: 'translate(-50%, -50%) scale(0.5)', 
            // Animación lenta y elegante de 2.5s
            transition: 'all 2.5s cubic-bezier(0.25, 1, 0.5, 1)' 
        });
    });

  }, []);

  return (
    <div 
        className="fixed z-[9999] pointer-events-none w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xl border-2 border-white"
        style={styles}
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
    </div>
  );
}