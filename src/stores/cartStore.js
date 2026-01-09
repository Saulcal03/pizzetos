// src/stores/cartStore.js
import { atom, computed } from 'nanostores';

// --- ESTADO BASE ---
export const cartItems = atom([]);
export const isCartOpen = atom(false);
export const isModalOpen = atom(false);
export const modalProduct = atom(null); 
export const selectedGlobalSize = atom(null); 

// --- NUEVO: Estado para el Checkout ---
export const isCheckoutOpen = atom(false);

// --- HELPERS ---
export const cartCount = computed(cartItems, items => items.length);

// --- ACCIONES MODAL ---
export function openProductModal(product) {
  modalProduct.set(product);
  isModalOpen.set(true);
}

export function closeProductModal() {
  isModalOpen.set(false);
  modalProduct.set(null);
}

// --- ACCIONES CARRITO ---
export function addCartItem(item) {
  const currentItems = cartItems.get();
  const uniqueId = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  
  // Aseguramos que item tenga priceFull, si no lo tiene, usamos price
  const priceFull = item.priceFull || item.price;
  
  // Guardamos el item con priceFull explícito
  cartItems.set([...currentItems, { ...item, priceFull, uniqueId, addedAt: Date.now() }]);
  
  isCartOpen.set(true); 
}

export function removeCartItem(uniqueId) {
  cartItems.set(cartItems.get().filter(i => i.uniqueId !== uniqueId));
}

export function toggleCart(isOpen) {
  isCartOpen.set(isOpen !== undefined ? isOpen : !isCartOpen.get());
}

// --- NUEVO: Función para abrir/cerrar Checkout ---
export function toggleCheckout(isOpen) {
  isCheckoutOpen.set(isOpen !== undefined ? isOpen : !isCheckoutOpen.get());
}

// --- LÓGICA MAESTRA 2x1 (CORREGIDA Y BLINDADA) ---
export const groupedCart = computed(cartItems, (items) => {
  let processedItems = [];
  let total = 0;
  
  const allPizzas = items.filter(i => i.category === 'Pizzas' || i.category === 'Especialidades del Mar');
  const otherItems = items.filter(i => i.category !== 'Pizzas' && i.category !== 'Especialidades del Mar');

  const pizzasBySize = {};
  allPizzas.forEach(p => {
    const size = p.size || 'General';
    if (!pizzasBySize[size]) pizzasBySize[size] = [];
    pizzasBySize[size].push(p);
  });

  Object.keys(pizzasBySize).forEach(size => {
    const list = [...pizzasBySize[size]];
    
    // Función auxiliar para obtener el precio REAL correcto
    const getRealPrice = (pizza) => {
        // 1. Intentamos leer el precio que viene en el objeto
        let finalPrice = pizza.priceFull || pizza.price || 0;

        // 2. AUTOCORRECCIÓN: Si tenemos la tabla de precios y el tamaño, forzamos el precio correcto.
        // Esto arregla el bug si el botón agregó la pizza con precio de "Chica" ($180) pero es "Familiar" ($375)
        if (pizza.prices && pizza.size && pizza.prices[pizza.size]) {
            finalPrice = Number(pizza.prices[pizza.size]);
        }
        return finalPrice;
    };

    // Ordenamos usando el precio corregido (REAL) para emparejar bien
    list.sort((a, b) => getRealPrice(b) - getRealPrice(a));

    while (list.length > 0) {
      const pizza1 = list.shift();
      const p1Price = getRealPrice(pizza1); // Usamos precio corregido

      if (list.length > 0) {
        // --- TENEMOS PAREJA (2x1) ---
        const pizza2 = list.shift();
        const p2Price = getRealPrice(pizza2); // Usamos precio corregido
        
        // La más cara define el precio del par
        const pairPrice = Math.max(p1Price, p2Price); 
        
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
        // Aplicamos 40% de descuento al precio REAL
        const individualPrice = Math.round(p1Price * 0.6);
        
        processedItems.push({
          ...pizza1,
          displayPrice: individualPrice, 
          isWaitingPair: true, 
          uniqueId: pizza1.uniqueId,
          price: individualPrice 
        });
        total += individualPrice;
      }
    }
  });

  otherItems.forEach(item => {
    processedItems.push(item);
    total += item.price || 0;
  });

  return { items: processedItems, total };
});