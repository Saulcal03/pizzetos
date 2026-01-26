import { useStore } from '@nanostores/react';
import { selectedGlobalSize } from '../../stores/cartStore';

export default function SizeSelector() {
  const currentSize = useStore(selectedGlobalSize);

  // --- DEFINICIÓN DE LOS SVG (Sin cambios aquí, solo se mueven abajo) ---
  const sizes = [
    { 
      id: 'Chica', 
      label: 'Chica', 
      sub: '6 Rebanadas', 
      price: '$180',
      path: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14">
            <circle cx="12" cy="12" r="10" className="opacity-80" />
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
      sub: '8 Rebanadas', 
      price: '$255',
      path: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
            <circle cx="12" cy="12" r="11" className="opacity-80" />
            <g className="origin-center transition-transform duration-700 ease-in-out group-hover:-rotate-45">
                <path d="M12 1 L12 23" />
                <path d="M4.22 4.22 L19.78 19.78" />
                <path d="M19.78 4.22 L4.22 19.78" />
            </g>
            <circle cx="12" cy="7" r="1.2" fill="currentColor" className="opacity-60 animate-pulse"/>
            <circle cx="7" cy="16" r="1.2" fill="currentColor" className="opacity-60 animate-pulse delay-300"/>
            <circle cx="17" cy="16" r="1.2" fill="currentColor" className="opacity-60 animate-pulse delay-700"/>
        </svg>
      )
    },
    { 
      id: 'Grande', 
      label: 'Grande', 
      sub: '10 Rebanadas', 
      price: '$315',
      path: (
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
      sub: '12 Rebanadas', 
      price: '$375',
      path: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 transition-transform duration-500 group-hover:scale-105">
            <circle cx="12" cy="12" r="11.5" strokeWidth="2" />
            <circle cx="12" cy="12" r="10" className="opacity-50" />
            <g className="opacity-80">
                <path d="M12 0.5 L12 23.5" />
                <path d="M0.5 12 L23.5 12" />
                <path d="M3.8 3.8 L20.2 20.2" />
                <path d="M20.2 3.8 L3.8 20.2" />
            </g>
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
  // ---------------------------------------------------------

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
        
        {/* Encabezado Premium (Ligeramente más intenso) */}
        <div className="text-center mb-16 relative font-serif -mt-12 md:-mt-20 z-20">
            <h2 className="text-4xl md:text-6xl leading-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-700 to-amber-950 italic pb-2 mb-8 drop-shadow-md">
                Elige tu Hambre
            </h2>
            
            <div className="h-1 w-48 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-6 opacity-80"></div>
            
            <p className="text-amber-900/80 text-sm md:text-base font-bold tracking-[0.3em] uppercase drop-shadow-sm">
                Selecciona la experiencia ideal
            </p>
        </div>

        {/* Grid de Tarjetas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 px-2">
            {sizes.map((size) => {
                const isSelected = currentSize === size.id;

                return (
                    <button
                        key={size.id}
                        onClick={() => selectedGlobalSize.set(size.id)}
                        className={`
                            group relative rounded-[2.5rem] border-2 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                            flex flex-col items-center justify-between py-10 px-4 min-h-[280px]
                            ${isSelected 
                                /* SELECCIONADO: Fondo blanco puro para contraste máximo, borde dorado intenso, sombra dorada fuerte */
                                ? 'bg-white border-amber-600 shadow-[0_25px_50px_-12px_rgba(217,119,6,0.5)] -translate-y-4 scale-[1.03] z-10' 
                                /* NO SELECCIONADO: Fondo crema rico, borde dorado suave. Hover: se vuelve más dorado */
                                : 'bg-[#FFF8E7] border-amber-200/80 hover:border-amber-500 hover:bg-amber-50 hover:-translate-y-2'
                            }
                        `}
                    >
                        {/* Brillo suave interno (Más cálido y fuerte) */}
                        <div className={`absolute inset-0 rounded-[2.5rem] transition-opacity duration-700 ${isSelected ? 'opacity-100' : 'opacity-0'} bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.3),transparent_70%)]`}></div>

                        {/* Icono SVG (Colores más profundos) */}
                        <div className="relative mt-2">
                            <div className={`relative transform transition-all duration-500 ${isSelected ? 'text-amber-600 scale-110 drop-shadow-[0_2px_4px_rgba(217,119,6,0.3)]' : 'text-amber-900/30 group-hover:text-amber-600'}`}>
                                {size.path}
                            </div>
                        </div>

                        {/* Textos (Tonos café/dorado oscuro para contraste) */}
                        <div className="flex flex-col items-center mt-6 z-10 relative">
                            <h3 className={`font-serif text-3xl italic font-bold transition-all duration-300 drop-shadow-sm ${isSelected ? 'text-amber-950 scale-105' : 'text-amber-900/60 group-hover:text-amber-950'}`}>
                                {size.label}
                            </h3>
                            {/* Línea divisora más fuerte */}
                            <div className={`h-px w-12 my-2 transition-all duration-500 ${isSelected ? 'bg-amber-600 w-16' : 'bg-amber-300 group-hover:bg-amber-500'}`}></div>
                            <p className={`text-xs md:text-sm font-bold uppercase tracking-widest ${isSelected ? 'text-amber-700' : 'text-amber-900/40 group-hover:text-amber-700'}`}>
                                {size.sub}
                            </p>
                        </div>

                        {/* Botón de Precio (Más sólido y llamativo) */}
                        <div className={`
                            mt-6 px-8 py-2 rounded-full text-sm md:text-base font-bold border-2 transition-all duration-300 relative overflow-hidden group/btn
                            ${isSelected 
                                ? 'bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-600/30' 
                                : 'bg-white/60 text-amber-800 border-amber-300 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500'
                            }
                        `}>
                            <span className="relative z-10">{size.price}</span>
                            <div className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white/30 transition-all duration-300 group-hover/btn:scale-150 group-hover/btn:opacity-100 opacity-0"></div>
                        </div>

                    </button>
                );
            })}
        </div>
    </div>
  );
}