// src/stores/cartStore.js
import { atom, computed } from 'nanostores';

// --- ESTADO BASE ---
export const cartItems = atom([]);
export const isCartOpen = atom(false);
export const isModalOpen = atom(false);
export const currentProduct = atom(null);
export const selectedGlobalSize = atom(null); // Para el selector "Pro" de tamaño

// --- HELPERS ---
export const cartCount = computed(cartItems, items => items.length);

// --- ACCIONES MODAL ---
export function openProductModal(product) {
  currentProduct.set(product);
  isModalOpen.set(true);
}

export function closeProductModal() {
  isModalOpen.set(false);
  currentProduct.set(null);
}

// --- ACCIONES CARRITO ---
export function addCartItem(item) {
  const currentItems = cartItems.get();
  const uniqueId = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  cartItems.set([...currentItems, { ...item, uniqueId, addedAt: Date.now() }]);
}

export function removeCartItem(uniqueId) {
  cartItems.set(cartItems.get().filter(i => i.uniqueId !== uniqueId));
}

export function toggleCart(isOpen) {
  isCartOpen.set(isOpen !== undefined ? isOpen : !isCartOpen.get());
}

// --- LÓGICA MAESTRA 2x1 (CORREGIDA: AUTOMÁTICA) ---
export const groupedCart = computed(cartItems, (items) => {
  let processedItems = [];
  let total = 0;
  
  // 1. Tomamos TODAS las pizzas, sin importar si eligieron promo o individual
  const allPizzas = items.filter(i => i.category === 'Pizzas' || i.category === 'Especialidades del Mar');
  const otherItems = items.filter(i => i.category !== 'Pizzas' && i.category !== 'Especialidades del Mar');

  // 2. Las agrupamos por tamaño
  const pizzasBySize = {};
  allPizzas.forEach(p => {
    // Si por error no trae size, lo mandamos a 'General'
    const size = p.size || 'General';
    if (!pizzasBySize[size]) pizzasBySize[size] = [];
    pizzasBySize[size].push(p);
  });

  // 3. Emparejamos automáticamente (Estrategia: El usuario siempre gana)
  Object.keys(pizzasBySize).forEach(size => {
    const list = [...pizzasBySize[size]];
    
    // Ordenamos por precio para emparejar las más caras juntas (o estrategia que prefieras)
    // Aquí simplemente vamos tomando de 2 en 2
    while (list.length > 0) {
      const pizza1 = list.shift();
      
      if (list.length > 0) {
        // --- TENEMOS PAREJA (2x1) ---
        const pizza2 = list.shift();
        
        // Precio: La más cara de las dos define el precio del par (lógica estándar)
        // Usamos priceFull porque es el precio de lista sin descuento
        const pairPrice = Math.max(pizza1.priceFull, pizza2.priceFull); 
        
        processedItems.push({
          type: 'promo_pair',
          title: `2x1: ${pizza1.name} y ${pizza2.name}`,
          size: size,
          items: [pizza1, pizza2],
          price: pairPrice,
          uniqueId: `pair-${pizza1.uniqueId}`
        });
        total += pairPrice;
      } else {
        // --- PIZZA SOLA (Individual con Descuento) ---
        // Al quedar sola, le aplicamos el descuento del 40% automáticamente
        // Aunque el usuario haya marcado "Promo", si está sola, le cobramos barato.
        const individualPrice = Math.round(pizza1.priceFull * 0.6);
        
        processedItems.push({
          ...pizza1,
          displayPrice: individualPrice, 
          isWaitingPair: true, // Para mostrar aviso visual
          uniqueId: pizza1.uniqueId,
          price: individualPrice // Aseguramos que el total sume el precio con descuento
        });
        total += individualPrice;
      }
    }
  });

  // 4. Agregamos el resto de cosas
  otherItems.forEach(item => {
    processedItems.push(item);
    total += item.price;
  });

  return { items: processedItems, total };
});