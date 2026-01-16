// src/components/Menu/CreaTuPizza.jsx
import { useState, useEffect, useMemo } from 'react';
import { menuItems } from '../../data/menuData'; 
import { addCartItem } from '../../stores/cartStore';

// --- COMPONENTE VISUAL: SELECTOR DE SABORES (Extraído de ProductModal) ---
const FlavorSelector = ({ selections, setSelections, activeSlot, setActiveSlot, pizzaOptions }) => {
    return (
      <div className="space-y-4">
        
        {/* 1. LOS "SLOTS" (Los botones grandes de Mitad 1 y Mitad 2) */}
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
                   relative p-3 rounded-xl border-2 text-left transition-all overflow-hidden h-24 flex flex-col justify-end
                   ${activeSlot === slotNum 
                     ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                     : 'border-white/10 bg-[#1a1a1a] hover:bg-[#252525]'
                   }
                 `}
               >
                 {/* Imagen de fondo tenue si ya eligió sabor */}
                 {selectedPizza && (
                   <img src={selectedPizza.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[1px]" />
                 )}
                 
                 <div className="relative z-10">
                   <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider block mb-1">
                     Mitad {slotNum}
                   </span>
                   <span className="text-sm font-bold text-white leading-tight block truncate shadow-black drop-shadow-md">
                     {selectedName || "Toca para elegir"}
                   </span>
                 </div>
               </button>
             );
           })}
        </div>

        {/* 2. LA GRILLA DE OPCIONES (Las fotos de las pizzas) */}
        <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-3">
           <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
             <i className="fa-solid fa-pizza-slice text-amber-500 mr-2"></i>
             Elige sabor para: <span className="text-white">Mitad {activeSlot}</span>
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
                     // Auto-avanzar al siguiente slot si es el 1
                     if (activeSlot === 1) setActiveSlot(2);
                   }}
                   className={`
                     group relative rounded-lg overflow-hidden aspect-square border transition-all
                     ${isSelected ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-transparent opacity-70 hover:opacity-100'}
                   `}
                 >
                   <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" loading="lazy" />
                   {/* Gradiente para leer texto */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-1 flex items-end">
                     <span className="text-[9px] md:text-[10px] font-bold text-white leading-tight">{pizza.name}</span>
                   </div>
                   {/* Checkmark si está seleccionado */}
                   {isSelected && (
                     <div className="absolute top-1 right-1 bg-amber-500 text-black w-4 h-4 rounded-full flex items-center justify-center text-[10px] shadow-lg">
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

  // Filtramos solo las pizzas para las opciones
  const pizzaOptions = useMemo(() => menuItems.filter(item => item.category === 'Pizzas'), []);

  const preciosMap = { "Chica": 180, "Mediana": 255, "Grande": 315, "Familiar": 375 };
  
  const [size, setSize] = useState('Mediana');
  // Usamos un objeto selections como en tu Modal
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
      
      {/* Contenedor Principal */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#121212]">
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulse"></div>

        <div className="flex flex-col lg:flex-row">
          
          {/* COLUMNA IZQUIERDA: IMAGEN */}
          <div className="lg:w-5/12 relative min-h-[250px] lg:min-h-full overflow-hidden group">
            <img 
              src="/img/CREA TU PIZZA.webp" 
              alt="Crea tu pizza" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] lg:bg-gradient-to-r lg:from-transparent lg:to-[#121212] via-[#121212]/50"></div>
            
            <div className="absolute bottom-6 left-6 z-10">
              <span className="bg-amber-500 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block shadow-lg">
                Personalizada
              </span>
              <h3 className="text-3xl font-serif text-white italic drop-shadow-md">
                A Tu Gusto
              </h3>
            </div>
          </div>

          {/* COLUMNA DERECHA: CONTROLES VISUALES */}
          <div className="lg:w-7/12 p-5 lg:p-8 relative z-10">
            <div className="mb-6 flex justify-between items-end">
              <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Crea tu Pizza</h2>
                  <p className="text-neutral-400 text-xs md:text-sm">
                    40% OFF Individual o arma tu 2x1.
                  </p>
              </div>
              {/* Selector de Tamaño Compacto */}
              <div className="text-right">
                  <label className="text-[10px] font-bold text-amber-500 uppercase block mb-1">Tamaño</label>
                  <select 
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="bg-[#1a1a1a] text-white border border-white/20 rounded-lg py-1 px-2 text-sm focus:border-amber-500 outline-none cursor-pointer"
                  >
                    {Object.entries(preciosMap).map(([key, val]) => (
                      <option key={key} value={key}>{key} - ${val}</option>
                    ))}
                  </select>
              </div>
            </div>

            {/* AQUI ESTÁ LA MAGIA VISUAL */}
            <FlavorSelector 
                selections={selections}
                setSelections={setSelections}
                activeSlot={activeSlot}
                setActiveSlot={setActiveSlot}
                pizzaOptions={pizzaOptions}
            />

            {/* Mensaje de Error */}
            {error.msg && (
              <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-bold flex items-center gap-2 animate-pulse">
                <i className="fa-solid fa-circle-exclamation"></i> {error.msg}
              </div>
            )}

            {/* Botón de Acción */}
            <button 
              onClick={handleSubmit}
              className="mt-6 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transform transition-all active:scale-95 flex justify-between items-center group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              
              <span className="relative z-10 flex items-center gap-2 text-lg">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                TERMINAR PIZZA
              </span>
              
              <div className="relative z-10 flex flex-col items-end leading-none">
                <span className="text-sm opacity-60 line-through font-medium">${priceFull}</span>
                <span className="text-xl font-bold">${priceIndividual.toFixed(0)}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}