import { useState } from 'react';
import { addCartItem } from '../../stores/cartStore';

export default function AddToCartBtn({ id, name, category, imageSrc, basePrice }) {
  // Estado local para manejar el tamaño seleccionado
  const [selectedSize, setSelectedSize] = useState('Familiar');
  const [currentPrice, setCurrentPrice] = useState(basePrice);
  const [isAnimating, setIsAnimating] = useState(false);

  // Lógica de precios según tamaño (proporción basada en tu código original)
  const handleSizeChange = (e) => {
    const size = e.target.value;
    setSelectedSize(size);
    
    // Ajuste de precio simple (puedes refinar estos factores)
    if (size === 'Familiar') setCurrentPrice(basePrice);
    if (size === 'Grande') setCurrentPrice(basePrice * 0.85); // Ejemplo aprox
    if (size === 'Mediana') setCurrentPrice(basePrice * 0.70); // Ejemplo aprox
  };

  const handleAddToCart = () => {
    // Animación visual del botón
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // Añadir al Store global
    addCartItem({
      id,
      name,
      category, // Importante para la lógica 2x1 futura
      size: selectedSize,
      price: Math.round(currentPrice), // Redondeamos para evitar decimales raros
      imageSrc,
      type: 'specialty_pizza' // Para identificar tipo de producto
    });
  };

  return (
    <div className="mt-auto space-y-3">
      {/* Selector de Tamaño */}
      <div className="relative">
        <select 
          value={selectedSize}
          onChange={handleSizeChange}
          className="w-full appearance-none bg-brand-dark border border-white/10 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow cursor-pointer transition-colors"
        >
          <option value="Familiar">Familiar - ${basePrice}</option>
          {/* Calculamos precios al vuelo para mostrar en opciones */}
          <option value="Grande">Grande - ${Math.round(basePrice * 0.85)}</option>
          <option value="Mediana">Mediana - ${Math.round(basePrice * 0.70)}</option>
        </select>
        
        {/* Flecha SVG decorativa */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-brand-yellow">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>

      {/* Botón de Acción */}
      <button 
        onClick={handleAddToCart}
        className={`w-full bg-brand-yellow text-brand-dark font-bold py-3 rounded-xl shadow-lg hover:shadow-neon transform active:scale-95 transition-all duration-200 flex justify-center items-center gap-2 ${isAnimating ? 'scale-95 bg-yellow-400' : ''}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
        {isAnimating ? '¡Añadido!' : 'Agregar al Pedido'}
      </button>
    </div>
  );
}