import { useStore } from '@nanostores/react';
import { selectedGlobalSize } from '../../stores/cartStore';

export default function SizeSelector() {
  const currentSize = useStore(selectedGlobalSize);

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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
        
        {/* Encabezado Premium */}
        <div className="text-center mb-16 relative font-serif -mt-12 md:-mt-20 z-20">
            <h2 className="text-4xl md:text-6xl leading-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-600 to-amber-900 italic pb-2 mb-8 drop-shadow-md">
                Elige tu Hambre
            </h2>
            
            <div className="h-1 w-48 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6 opacity-70"></div>
            
            <p className="text-amber-800/70 text-sm md:text-base font-bold tracking-[0.3em] uppercase drop-shadow-sm">
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
                            group relative rounded-[2.5rem] border transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                            flex flex-col items-center justify-between py-10 px-4 min-h-[280px]
                            ${isSelected 
                                ? 'bg-white border-amber-500 shadow-[0_25px_50px_-15px_rgba(120,60,0,0.2)] -translate-y-4 scale-[1.03] z-10' 
                                : 'bg-amber-50 border-amber-100 hover:border-amber-400 hover:bg-white hover:-translate-y-2'
                            }
                        `}
                    >
                        {/* Brillo suave interno en la tarjeta */}
                        <div className={`absolute inset-0 rounded-[2.5rem] transition-opacity duration-700 ${isSelected ? 'opacity-100' : 'opacity-0'} bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.08),transparent_70%)]`}></div>

                        {/* Icono SVG */}
                        <div className="relative mt-2">
                            <div className={`relative transform transition-all duration-500 ${isSelected ? 'text-amber-600 scale-110 drop-shadow-md' : 'text-stone-400 group-hover:text-amber-500'}`}>
                                {size.path}
                            </div>
                        </div>

                        {/* Textos */}
                        <div className="flex flex-col items-center mt-6 z-10 relative">
                            <h3 className={`font-serif text-3xl italic font-bold transition-all duration-300 drop-shadow-sm ${isSelected ? 'text-stone-900 scale-105' : 'text-stone-700 group-hover:text-stone-900'}`}>
                                {size.label}
                            </h3>
                            <div className={`h-px w-12 my-2 transition-all duration-500 ${isSelected ? 'bg-amber-500 w-16' : 'bg-amber-200 group-hover:bg-amber-400'}`}></div>
                            <p className={`text-xs md:text-sm font-bold uppercase tracking-widest ${isSelected ? 'text-amber-600' : 'text-stone-400 group-hover:text-amber-500'}`}>
                                {size.sub}
                            </p>
                        </div>

                        {/* Botón de Precio */}
                        <div className={`
                            mt-6 px-8 py-2 rounded-full text-sm md:text-base font-bold border transition-all duration-300 relative overflow-hidden group/btn
                            ${isSelected 
                                ? 'bg-amber-500 text-white border-amber-400 shadow-lg' 
                                : 'bg-white text-stone-600 border-amber-100 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:border-amber-300'
                            }
                        `}>
                            <span className="relative z-10">{size.price}</span>
                            <div className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white/20 transition-all duration-300 group-hover/btn:scale-150 group-hover/btn:opacity-100 opacity-0"></div>
                        </div>

                    </button>
                );
            })}
        </div>
    </div>
  );
}