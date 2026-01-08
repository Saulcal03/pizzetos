// src/components/Menu/SizeSelector.jsx
import { useStore } from '@nanostores/react';
import { selectedGlobalSize } from '../../stores/cartStore';

export default function SizeSelector() {
  const currentSize = useStore(selectedGlobalSize);

  const sizes = [
    { 
      id: 'Chica', 
      label: 'Personal', 
      sub: 'Individual', 
      price: '$180',
      path: (
        // Pizza Pequeña: El interior gira suavemente al hacer hover
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14">
            {/* Aro exterior estático */}
            <circle cx="12" cy="12" r="10" className="opacity-80" />
            {/* Grupo interno que gira */}
            <g className="origin-center transition-transform duration-700 ease-in-out group-hover:rotate-90">
                <path d="M12 3 L12 21" />
                <path d="M3 12 L21 12" />
                <circle cx="7" cy="7" r="1" fill="currentColor" className="opacity-70"/>
                <circle cx="17" cy="17" r="1" fill="currentColor" className="opacity-70"/>
            </g>
        </svg>
      )
    },
    { 
      id: 'Mediana', 
      label: 'Mediana', 
      sub: 'Para Compartir', 
      price: '$255',
      path: (
        // Pizza Mediana: Cortes giran en sentido contrario
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
            <circle cx="12" cy="12" r="11" className="opacity-80" />
            <g className="origin-center transition-transform duration-700 ease-in-out group-hover:-rotate-45">
                <path d="M12 1 L12 23" />
                <path d="M4.22 4.22 L19.78 19.78" />
                <path d="M19.78 4.22 L4.22 19.78" />
            </g>
            {/* Peperonis fijos que pulsan */}
            <circle cx="12" cy="7" r="1.2" fill="currentColor" className="opacity-60 animate-pulse"/>
            <circle cx="7" cy="16" r="1.2" fill="currentColor" className="opacity-60 animate-pulse delay-300"/>
            <circle cx="17" cy="16" r="1.2" fill="currentColor" className="opacity-60 animate-pulse delay-700"/>
        </svg>
      )
    },
    { 
      id: 'Grande', 
      label: 'Grande', 
      sub: 'La Favorita', 
      price: '$315',
      path: (
        // Pizza Grande: Anillos concéntricos que hacen "zoom"
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
            <circle cx="12" cy="12" r="11" className="transition-all duration-500 group-hover:r-12" />
            <circle cx="12" cy="12" r="8" strokeWidth="1" className="opacity-60 transition-all duration-500 group-hover:r-9" />
            <g className="origin-center opacity-80">
                 <path d="M12 1 L12 23" />
                 <path d="M1 12 L23 12" />
                 <path d="M4.22 4.22 L19.78 19.78" />
                 <path d="M19.78 4.22 L4.22 19.78" />
            </g>
        </svg>
      )
    },
    { 
      id: 'Familiar', 
      label: 'Familiar', 
      sub: 'Banquete Total', 
      price: '$375',
      // --- CORRECCIÓN AQUÍ ---
      // Se ha simplificado y corregido el SVG de la pizza familiar para asegurar que se muestre.
      // Se ve más densa y grande que las demás.
      path: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 transition-transform duration-500 group-hover:scale-105">
            {/* Doble borde para dar sensación de tamaño y grosor */}
            <circle cx="12" cy="12" r="11.5" strokeWidth="2" />
            <circle cx="12" cy="12" r="10" className="opacity-50" />

            {/* 8 Cortes definidos */}
            <g className="opacity-80">
                <path d="M12 0.5 L12 23.5" />
                <path d="M0.5 12 L23.5 12" />
                <path d="M3.8 3.8 L20.2 20.2" />
                <path d="M20.2 3.8 L3.8 20.2" />
            </g>

            {/* Muchos ingredientes que pulsan suavemente */}
            <g className="animate-pulse opacity-60 fill-current">
                <circle cx="8" cy="8" r="1.1" />
                <circle cx="16" cy="8" r="1.1" />
                <circle cx="8" cy="16" r="1.1" />
                <circle cx="16" cy="16" r="1.1" />
                <circle cx="12" cy="4" r="0.9" />
                <circle cx="12" cy="20" r="0.9" />
                <circle cx="4" cy="12" r="0.9" />
                <circle cx="20" cy="12" r="0.9" />
            </g>
        </svg>
      )
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
        
        {/* Encabezado Premium */}
        <div className="text-center mb-16 relative font-serif">
            <h2 className="text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 italic mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                Elige tu Hambre
            </h2>
            <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-4 opacity-50"></div>
            <p className="text-amber-200/70 text-sm md:text-base font-light tracking-[0.3em] uppercase drop-shadow-sm">
                Selecciona la experiencia ideal
            </p>
        </div>

        {/* Grid de Tarjetas con efecto 3D */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 px-2">
            {sizes.map((size) => {
                const isSelected = currentSize === size.id;

                return (
                    <button
                        key={size.id}
                        onClick={() => selectedGlobalSize.set(size.id)}
                        // Clases base para la tarjeta premium
                        className={`
                            group relative rounded-3xl border transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                            flex flex-col items-center justify-between py-8 px-4 min-h-[260px] overflow-hidden
                            backdrop-blur-xl perspective-1000
                            /* Efecto de elevación al hover y seleccionado */
                            hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.3)]
                            ${isSelected 
                                ? 'bg-gradient-to-br from-neutral-900/90 to-black/90 border-amber-500/80 shadow-[0_0_50px_-10px_rgba(245,158,11,0.5)] -translate-y-1 scale-[1.03] z-10' 
                                : 'bg-gradient-to-br from-neutral-900/50 to-black/50 border-white/10 hover:border-amber-500/40 hover:bg-neutral-900/70'
                            }
                        `}
                    >
                        {/* Luz de fondo ambiental */}
                        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.3),transparent_70%)] transition-opacity duration-700 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`}></div>
                        
                        {/* Destello en el borde al hacer hover */}
                        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-b from-white/10 to-transparent pointer-events-none mix-blend-overlay"></div>

                        {/* Icono SVG con contenedor para efectos de luz */}
                        <div className="relative mt-2">
                            {/* Luz trasera del icono */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-amber-500/30 blur-2xl rounded-full transition-all duration-500 ${isSelected ? 'opacity-100 scale-125' : 'opacity-0 group-hover:opacity-50 scale-100'}`}></div>
                            
                            <div className={`relative transform transition-all duration-500 drop-shadow-lg ${isSelected ? 'text-amber-400 scale-110' : 'text-neutral-400 group-hover:text-amber-300 group-hover:scale-105'}`}>
                                {size.path}
                            </div>
                        </div>

                        {/* Textos */}
                        <div className="flex flex-col items-center mt-6 z-10 relative">
                            <h3 className={`font-serif text-3xl italic font-bold transition-all duration-300 drop-shadow-md ${isSelected ? 'text-white scale-105' : 'text-neutral-300 group-hover:text-white'}`}>
                                {size.label}
                            </h3>
                            <div className={`h-px w-12 my-2 transition-all duration-500 ${isSelected ? 'bg-amber-500' : 'bg-neutral-700 group-hover:bg-amber-500/50'}`}></div>
                            <p className="text-xs md:text-sm text-amber-300/90 font-semibold uppercase tracking-widest">
                                {size.sub}
                            </p>
                        </div>

                        {/* Botón de Precio */}
                        <div className={`
                            mt-6 px-8 py-2 rounded-full text-sm md:text-base font-bold border transition-all duration-300 relative overflow-hidden group/btn
                            ${isSelected 
                                ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]' 
                                : 'bg-black/40 text-amber-200/80 border-amber-900/50 group-hover:border-amber-500/50 group-hover:text-amber-300 group-hover:bg-black/60'
                            }
                        `}>
                            <span className="relative z-10">{size.price}</span>
                            {/* Brillo que pasa por el botón al hacer hover */}
                            <div className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white/20 transition-all duration-300 group-hover/btn:scale-150 group-hover/btn:opacity-100 opacity-0"></div>
                        </div>

                    </button>
                );
            })}
        </div>
    </div>
  );
}