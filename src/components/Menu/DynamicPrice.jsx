// src/components/Menu/DynamicPrice.jsx
import { useStore } from '@nanostores/react';
import { selectedGlobalSize } from '../../stores/cartStore';

export default function DynamicPrice({ prices, basePrice }) {
  // Escuchamos el tamaño seleccionado arriba (Chica, Mediana, Grande, etc.)
  const $size = useStore(selectedGlobalSize);

  // LÓGICA:
  // 1. Si el producto tiene lista de precios (es pizza) Y hay un tamaño seleccionado globalmente...
  if (prices && $size && prices[$size]) {
    return <span className="text-xl font-bold text-amber-500">${prices[$size]}</span>;
  }

  // 2. Si no hay tamaño seleccionado o no coincide, mostramos el precio base (o el más chico)
  return <span className="text-xl font-bold text-amber-500">${basePrice}</span>;
}