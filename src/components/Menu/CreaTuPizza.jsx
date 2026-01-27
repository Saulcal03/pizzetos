// src/components/Menu/CreaTuPizza.jsx
import { useState, useEffect, useMemo } from 'react';
import { menuItems } from '../../data/menuData'; 
import { addCartItem } from '../../stores/cartStore';

// --- COMPONENTE VISUAL: SELECTOR DE SABORES (Versión Final iOS Fix) ---
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
                   relative p-3 rounded-2xl border-2 text-left transition-all overflow-hidden min-h-[90px] flex flex-col justify-end
                   ${activeSlot === slotNum ? 'border-amber-500 bg-amber-50' : 'border-neutral-100 bg-neutral-50'}
                 `}
               >
                 {selectedPizza && (
                   <img 
                     src={selectedPizza.image} 
                     alt="" 
                     className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[0.5px]" 
                   />
                 )}
                 <div className="relative z-10 w-full">
                   <span className={`text-[9px] font-bold uppercase tracking-wider block mb-0.5 ${activeSlot === slotNum ? 'text-amber-600' : 'text-neutral-400'}`}>
                     Mitad {slotNum}
                   </span>
                   <span className="text-[11px] font-black leading-tight block truncate w-full text-neutral-900">
                     {selectedName || "Elegir sabor"}
                   </span>
                 </div>
               </button>
             );
           })}
        </div>

        {/* 2. LA GRILLA DE OPCIONES - Fix para amontonamiento en iOS */}
        <div className="bg-neutral-50/50 rounded-2xl border border-neutral-100 p-2 backdrop-blur-sm">
            <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-2 ml-1">
              Sabor para: <span className="text-neutral-900">Mitad {activeSlot}</span>
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
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
                      group relative rounded-xl overflow-hidden border-2 transition-all min-w-0
                      ${isSelected ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-transparent'}
                    `}
                  >
                    <div className="aspect-square w-full relative">
                        <img 
                          src={pizza.image} 
                          className="absolute inset-0 w-full h-full object-cover" 
                          alt={pizza.name}
                          loading="lazy" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-2 flex items-end">
                          <span className="text-[10px] leading-tight font-bold text-white line-clamp-2 text-left">
                            {pizza.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-amber-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-md border border-white z-20">
                            <i className="fa-solid fa-check"></i>
                          </div>
                        )}
                    </div>
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
          <div className="lg:w-5/12 relative min-h-[250px] lg:min-h-full overflow-hidden group">
            <img src="/img/CREA TU PIZZA.webp" alt="Crea tu pizza" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white"></div>
            <div className="absolute bottom-8 left-8 z-10">
              <span className="bg-amber-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-3 inline-block shadow-lg">Personalizada</span>
              <h3 className="text-4xl font-serif text-neutral-900 italic font-black">Tu Receta</h3>
            </div>
          </div>

          <div className="lg:w-7/12 p-5 lg:p-10 relative z-10">
            <div className="mb-6">
                <h2 className="text-3xl font-black text-neutral-900 mb-4 tracking-tight">Crea tu Pizza</h2>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Tamaño</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(preciosMap).map(([s, val]) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`
                          py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center justify-center
                          ${size === s ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-neutral-100 bg-neutral-50 text-neutral-500'}
                        `}
                      >
                        <span className={`text-[10px] font-black uppercase ${size === s ? 'text-amber-600' : 'text-neutral-400'}`}>{s}</span>
                        <span className={`text-xs font-bold ${size === s ? 'text-neutral-900' : 'text-neutral-600'}`}>${val}</span>
                      </button>
                    ))}
                  </div>
                </div>
            </div>

            <FlavorSelector selections={selections} setSelections={setSelections} activeSlot={activeSlot} setActiveSlot={setActiveSlot} pizzaOptions={pizzaOptions} />

            {error.msg && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-bold flex items-center gap-2 animate-bounce">
                <i className="fa-solid fa-circle-exclamation"></i> {error.msg}
              </div>
            )}

            {/* BOTÓN CORREGIDO: "AGREGAR AL CARRITO" COMPLETO */}
            <button 
              onClick={handleSubmit}
              className="mt-6 w-full bg-neutral-900 hover:bg-black text-amber-400 font-black py-4 px-5 rounded-2xl shadow-xl flex justify-between items-center border-b-4 border-amber-600 active:scale-[0.98] transition-transform overflow-hidden"
            >
              <span className="flex items-center gap-2 text-[15px] sm:text-lg italic uppercase tracking-tight shrink-0">
                <i className="fa-solid fa-wand-magic-sparkles text-amber-500"></i>
                Agregar al carrito
              </span>
              <div className="flex flex-col items-end leading-none ml-2">
                <span className="text-[10px] opacity-50 line-through text-white/70">${priceFull}</span>
                <span className="text-xl font-black text-white">${priceIndividual.toFixed(0)}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}