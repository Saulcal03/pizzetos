// src/components/Menu/SizeSelector.jsx
import { useStore } from '@nanostores/react';
import { selectedGlobalSize } from '../../stores/cartStore';

export default function SizeSelector() {
  const currentSize = useStore(selectedGlobalSize);

  // Definimos los tamaños con sus propiedades visuales
  // Usamos SVGs inline para tener control total del diseño sin instalar librerías extra
  const sizes = [
    { 
      id: 'Chica', 
      label: 'Personal', 
      sub: '4 Rebanadas', 
      price: '$120', 
      // Icono: Pizza pequeña (scale pequeña)
      path: (
        <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 transition-all duration-300 group-hover:scale-110 group-hover:text-amber-400">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 3 L12 21" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 12 L21 12" stroke="currentColor" strokeWidth="1.5" />
            {/* Detalles (Pepperoni) */}
            <circle cx="8" cy="8" r="1" fill="currentColor" className="opacity-50"/>
            <circle cx="16" cy="16" r="1" fill="currentColor" className="opacity-50"/>
        </svg>
      )
    },
    { 
      id: 'Mediana', 
      label: 'Mediana', 
      sub: '8 Rebanadas', 
      price: '$180',
      // Icono: Pizza normal
      path: (
        <svg viewBox="0 0 24 24" fill="none" className="w-14 h-14 transition-all duration-300 group-hover:scale-110 group-hover:text-amber-400">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 2 L12 22" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2 12 L22 12" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4.93 4.93 L19.07 19.07" stroke="currentColor" strokeWidth="1.5" />
            <path d="M19.07 4.93 L4.93 19.07" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    },
    { 
      id: 'Grande', 
      label: 'Grande', 
      sub: '12 Rebanadas', 
      price: '$230',
      // Icono: Pizza grande con borde doble
      path: (
        <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16 transition-all duration-300 group-hover:scale-110 group-hover:text-amber-400">
            <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.5" className="opacity-50" />
            <path d="M12 1 L12 23" stroke="currentColor" strokeWidth="1.5" />
            <path d="M1 12 L23 12" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4.22 4.22 L19.78 19.78" stroke="currentColor" strokeWidth="1.5" />
            <path d="M19.78 4.22 L4.22 19.78" stroke="currentColor" strokeWidth="1.5" />
             {/* Más detalles */}
             <circle cx="12" cy="6" r="1.5" fill="currentColor" className="opacity-40"/>
             <circle cx="6" cy="12" r="1.5" fill="currentColor" className="opacity-40"/>
             <circle cx="18" cy="12" r="1.5" fill="currentColor" className="opacity-40"/>
        </svg>
      )
    },
    { 
      id: 'Familiar', 
      label: 'Familiar', 
      sub: '16 Rebanadas', 
      price: '$290',
      // Icono: Pizza rectangular o muy grande
      path: (
        <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16 transition-all duration-300 group-hover:scale-110 group-hover:text-amber-400">
           <rect x="2" y="4" width="20" height="16" rx="4" stroke="currentColor" strokeWidth="1.5" />
           <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
           <line x1="7" y1="4" x2="7" y2="20" stroke="currentColor" strokeWidth="1.5" />
           <line x1="17" y1="4" x2="17" y2="20" stroke="currentColor" strokeWidth="1.5" />
           <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-serif text-white italic mb-2">
                Elige tu Hambre
            </h2>
            <p className="text-neutral-400 text-sm tracking-widest uppercase">Selecciona un tamaño para ver el menú</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {sizes.map((size) => {
                const isSelected = currentSize === size.id;

                return (
                    <button
                        key={size.id}
                        onClick={() => selectedGlobalSize.set(size.id)}
                        className={`
                            group relative overflow-hidden rounded-2xl border transition-all duration-300
                            flex flex-col items-center justify-center py-8 px-4
                            ${isSelected 
                                ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]' 
                                : 'bg-white/5 border-white/10 hover:border-amber-500/50 hover:bg-white/10'
                            }
                        `}
                    >
                        {/* Fondo con brillo sutil */}
                        <div className={`absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                        {/* Icono SVG */}
                        <div className={`mb-4 text-neutral-300 transition-colors duration-300 ${isSelected ? 'text-amber-500' : 'group-hover:text-amber-400'}`}>
                            {size.path}
                        </div>

                        {/* Textos */}
                        <h3 className={`font-serif text-xl italic font-bold mb-1 transition-colors ${isSelected ? 'text-amber-500' : 'text-white'}`}>
                            {size.id}
                        </h3>
                        
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-2">
                            {size.sub}
                        </p>

                        <div className={`
                            px-4 py-1 rounded-full text-xs font-bold border transition-all
                            ${isSelected 
                                ? 'bg-amber-500 text-black border-amber-500' 
                                : 'bg-transparent text-neutral-500 border-neutral-700 group-hover:border-amber-500/50 group-hover:text-amber-500'
                            }
                        `}>
                            Desde {size.price}
                        </div>

                    </button>
                );
            })}
        </div>
    </div>
  );
}