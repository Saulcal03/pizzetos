// src/components/Menu/SizeSelector.jsx
import { useStore } from '@nanostores/react';
import { selectedGlobalSize } from '../../stores/cartStore';

export default function SizeSelector() {
  const currentSize = useStore(selectedGlobalSize);

  const sizes = [
    { name: "Chica", price: 180, label: "6 Rebanadas", icon: "🍕" },
    { name: "Mediana", price: 255, label: "8 Rebanadas", icon: "🍕" },
    { name: "Grande", price: 315, label: "10 Rebanadas", icon: "🍕" },
    { name: "Familiar", price: 375, label: "12 Rebanadas", icon: "🍕" }
  ];

  const handleSelect = (sizeName) => {
    // Solo guardamos el tamaño. El index.astro detectará el cambio y ocultará esta vista.
    selectedGlobalSize.set(sizeName);
  };

  return (
    <div className="w-full py-10 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-serif text-white italic mb-4">
          Hola, ¿De qué tamaño tienes hambre?
        </h2>
        <p className="text-neutral-400">Elige para ver nuestras especialidades.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {sizes.map((size, index) => (
            <button
              key={size.name}
              onClick={() => handleSelect(size.name)}
              className="relative group flex flex-col items-center justify-between p-8 rounded-[2rem] bg-neutral-900 border border-white/10 hover:border-amber-500/50 hover:bg-neutral-800 transition-all duration-300 hover:-translate-y-2 h-64"
            >
              <div className="text-6xl mb-4 transform transition-transform group-hover:scale-110 drop-shadow-2xl grayscale group-hover:grayscale-0">
                {size.icon}
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-black italic text-white mb-1 uppercase">{size.name}</h3>
                <span className="text-amber-500 font-bold text-lg">${size.price}</span>
              </div>

              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-4 group-hover:text-white transition-colors">
                {size.label}
              </span>
            </button>
        ))}
      </div>
    </div>
  );
}