// src/components/Menu/CreaTuPizza.jsx
import { useState, useEffect, useMemo } from 'react';
import { menuItems } from '../../data/menuData'; 
import { addCartItem } from '../../stores/cartStore';

// --- COMPONENTE VISUAL: SELECTOR DE SABORES ---
const FlavorSelector = ({ selections, setSelections, activeSlot, setActiveSlot, pizzaOptions }) => {
    return (
      <div className="space-y-4">
        {/* 1. LOS "SLOTS" (Mitad 1 y Mitad 2) */}
        <div className="grid grid-cols-2 gap-3 mb-2">
           {[1, 2].map((slotNum) => {
             const key = `flavor${slotNum}`;
             const selectedName = selections[key];
             const selectedPizza = pizzaOptions.find(p => p.name === selectedName);

             return (
               <button
                 key={slotNum}
                 onClick={() => setActiveSlot(slotNum)}
                 className={`
                   relative p-3 rounded-2xl border-2 text-left transition-all overflow-hidden h-24 flex flex-col justify-end
                   ${activeSlot === slotNum 
                     ? 'border-amber-500 bg-amber-50 shadow-[0_10px_20px_-5px_rgba(245,158,11,0.2)]' 
                     : 'border-neutral-100 bg-neutral-50 hover:bg-neutral-100'
                   }
                 `}
               >
                 {selectedPizza && (
                   <img src={selectedPizza.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[0.5px]" />
                 )}
                 <div className="relative z-10">
                   <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${activeSlot === slotNum ? 'text-amber-600' : 'text-neutral-400'}`}>
                     Mitad {slotNum}
                   </span>
                   <span className={`text-sm font-black leading-tight block truncate ${selectedName ? 'text-neutral-900' : 'text-neutral-400 italic'}`}>
                     {selectedName || "Toca para elegir"}
                   </span>
                 </div>
               </button>
             );
           })}
        </div>

        {/* 2. LA GRILLA DE OPCIONES */}
        <div className="bg-neutral-50/50 rounded-2xl border border-neutral-100 p-3 backdrop-blur-sm">
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
              <i className="fa-solid fa-pizza-slice text-amber-500 mr-2"></i>
              Sabor para: <span className="text-neutral-900">Mitad {activeSlot}</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
              {pizzaOptions.map(pizza => {
                const currentKey = `flavor${activeSlot}`;
                const isSelected = selections[currentKey] === pizza.name;
                return (
                  <button 
                    key={pizza.id}
                    onClick={() => {
                      setSelections({ ...selections, [currentKey]: pizza.name });
                      if (activeSlot === 1) setActiveSlot(2);
                    }}
                    className={`
                      group relative rounded-xl overflow-hidden aspect-square border-2 transition-all
                      ${isSelected ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-transparent opacity-80 hover:opacity-100 shadow-sm'}
                    `}
                  >
                    <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-1.5 flex items-end">
                      <span className="text-[9px] font-bold text-white leading-tight">{pizza.name}</span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-amber-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-md border border-white">
                        <i className="fa-solid fa-check"></i>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
        </div>
      </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function CreaTuPizza() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { setIsVisible(true); }, []);

  const pizzaOptions = useMemo(() => menuItems.filter(item => item.category === 'Pizzas'), []);
  const preciosMap = { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 };
  
  const [size, setSize] = useState('Mediana');
  const [selections, setSelections] = useState({ flavor1: '', flavor2: '' });
  const [activeSlot, setActiveSlot] = useState(1);
  const [error, setError] = useState({ field: '', msg: '' });

  const priceFull = preciosMap[size];
  const priceIndividual = priceFull * 0.6; 

  const handleSubmit = () => {
    const { flavor1, flavor2 } = selections;
    if (!flavor1) return setError({ field: 'flavor1', msg: 'Falta elegir la Mitad 1.' });
    if (!flavor2) return setError({ field: 'flavor2', msg: 'Falta elegir la Mitad 2.' });
    if (flavor1 === flavor2) return setError({ field: 'both', msg: 'Elige dos especialidades distintas.' });
    
    setError({ field: '', msg: '' });
    const newItem = {
      id: `custom-${Date.now()}`,
      name: `Pizza Personalizada (${flavor1} y ${flavor2})`,
      description: `Especialidades: ${flavor1} y ${flavor2}`,
      category: 'Pizzas',
      size: size,
      priceFull: priceFull,
      price: priceFull,
      prices: preciosMap,
      image: '/img/CREA TU PIZZA.webp', 
      type: 'personalizada'
    };
    addCartItem(newItem);
    setSelections({ flavor1: '', flavor2: '' });
    setActiveSlot(1);
  };

  return (
    <div className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="relative overflow-hidden rounded-[2.5rem] border border-neutral-200 shadow-xl bg-white/80 backdrop-blur-md">
        
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row">
          {/* COLUMNA IZQUIERDA: IMAGEN */}
          <div className="lg:w-5/12 relative min-h-[280px] lg:min-h-full overflow-hidden group">
            <img src="/img/CREA TU PIZZA.webp" alt="Crea tu pizza" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white"></div>
            <div className="absolute bottom-8 left-8 z-10">
              <span className="bg-amber-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-3 inline-block shadow-lg">Personalizada</span>
              <h3 className="text-4xl font-serif text-neutral-900 italic font-black">Tu Receta</h3>
            </div>
          </div>

          {/* COLUMNA DERECHA: CONTROLES */}
          <div className="lg:w-7/12 p-6 lg:p-10 relative z-10">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-neutral-900 mb-4 tracking-tight">Crea tu Pizza</h2>
                
                {/* --- NUEVO SELECTOR DE TAMAÑO ESTILO "CARDS" --- */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Selecciona el Tamaño</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(preciosMap).map(([s, val]) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`
                          py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1
                          ${size === s 
                            ? 'border-amber-500 bg-amber-50 shadow-sm' 
                            : 'border-neutral-100 bg-neutral-50 hover:border-neutral-200 text-neutral-500'
                          }
                        `}
                      >
                        <span className={`text-[11px] font-black uppercase ${size === s ? 'text-amber-600' : 'text-neutral-400'}`}>{s}</span>
                        <span className={`text-sm font-bold ${size === s ? 'text-neutral-900' : 'text-neutral-600'}`}>${val}</span>
                      </button>
                    ))}
                  </div>
                </div>
            </div>

            <FlavorSelector selections={selections} setSelections={setSelections} activeSlot={activeSlot} setActiveSlot={setActiveSlot} pizzaOptions={pizzaOptions} />

            {error.msg && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2 animate-bounce">
                <i className="fa-solid fa-circle-exclamation"></i> {error.msg}
              </div>
            )}

            <button 
              onClick={handleSubmit}
              className="mt-8 w-full bg-neutral-900 hover:bg-black text-amber-400 font-black py-5 px-8 rounded-2xl shadow-xl transform transition-all active:scale-95 flex justify-between items-center group overflow-hidden border-b-4 border-amber-600"
            >
              <span className="relative z-10 flex items-center gap-3 text-lg italic">
                <i className="fa-solid fa-wand-magic-sparkles text-amber-500"></i>
                AGREGAR AL CARRITO
              </span>
              <div className="relative z-10 flex flex-col items-end leading-none">
                <span className="text-xs opacity-50 line-through font-bold text-white/70">${priceFull}</span>
                <span className="text-2xl font-black text-white">${priceIndividual.toFixed(0)}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}