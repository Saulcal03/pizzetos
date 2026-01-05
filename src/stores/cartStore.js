import { atom, computed } from 'nanostores';

// --- ESTADO BASE ---
export const cartItems = atom([]);
export const isCartOpen = atom(false); 

// --- COMPUTED HELPERS (Opcional, pero útil para contadores) ---
// Calcula cuántos items hay en total (para que CartCounter lo pueda usar fácil)
export const cartCount = computed(cartItems, items => items.length);

// --- ACCIONES ---
export function addCartItem(item) {
  const currentItems = cartItems.get();
  
  // Generamos un ID único compatible con todos los navegadores
  const uniqueId = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

  const newItem = {
    ...item,
    uniqueId: uniqueId,
    addedAt: Date.now(),
  };

  // En esta lógica 2x1, guardamos cada item por separado (no sumamos cantidad)
  // para poder parearlos después.
  cartItems.set([...currentItems, newItem]);
}

export function removeCartItem(uniqueId) {
  cartItems.set(cartItems.get().filter(i => i.uniqueId !== uniqueId));
}

export function toggleCart(isOpen) {
  isCartOpen.set(isOpen !== undefined ? isOpen : !isCartOpen.get());
}

// --- LÓGICA MAESTRA 2x1 (COMPUTED) ---
// Esta función recalcula los precios y agrupa pares automáticamente
export const groupedCart = computed(cartItems, (items) => {
  let processedItems = [];
  let total = 0;
  
  // 1. Separamos pizzas de especialidad (candidatas a 2x1) del resto
  // Aseguramos que existan antes de filtrar para evitar errores
  const specialtyPizzas = items.filter(i => (i.category === 'Especialidades' || i.type === 'specialty_pizza'));
  const otherItems = items.filter(i => (i.category !== 'Especialidades' && i.type !== 'specialty_pizza'));

  // 2. Agrupamos por tamaño para encontrar pares
  const pizzasBySize = {
    'Familiar': specialtyPizzas.filter(p => p.size === 'Familiar'), // Asumiendo que 'size' viene en el item, si no, usa un default
    'Grande': specialtyPizzas.filter(p => p.size === 'Grande'),
    'Mediana': specialtyPizzas.filter(p => p.size === 'Mediana'),
    'Chica': specialtyPizzas.filter(p => p.size === 'Chica'),
    'N/A': specialtyPizzas.filter(p => !p.size) // Para capturar las que no tengan tamaño definido
  };

  // 3. Procesamos los pares (2x1)
  Object.keys(pizzasBySize).forEach(size => {
    const list = [...pizzasBySize[size]]; // Copia de la lista
    
    while (list.length > 0) {
      const pizza1 = list.shift();
      
      if (list.length > 0) {
        // ¡Tenemos PAREJA! (2x1)
        const pizza2 = list.shift();
        const pairPrice = Math.max(pizza1.price, pizza2.price); 
        
        processedItems.push({
          type: 'promo_pair',
          title: `2x1 ${pizza1.name} y ${pizza2.name}`, // Título combinado
          items: [pizza1, pizza2],
          price: pairPrice,
          uniqueId: `pair-${pizza1.uniqueId}`
        });
        total += pairPrice;
      } else {
        // Pizza HUÉRFANA (Aplica 40% descuento individual)
        // Precio original * 0.6 = Precio con 40% de descuento
        const discountPrice = Math.round(pizza1.price * 0.6); 
        
        processedItems.push({
          ...pizza1,
          displayPrice: discountPrice, // Precio visual con descuento
          originalPrice: pizza1.price,
          isDiscounted: true,
          uniqueId: pizza1.uniqueId
        });
        total += discountPrice;
      }
    }
  });

  // 4. Agregamos el resto de cosas (Refrescos, etc) sin cambios
  otherItems.forEach(item => {
    processedItems.push(item);
    total += item.price;
  });

  return { items: processedItems, total };
});