// src/components/Cart/CheckoutModal.jsx
import { useStore } from '@nanostores/react';
import { isCheckoutOpen, toggleCheckout, groupedCart, clearCart } from '../../stores/cartStore';
import { useState } from 'react';

export default function CheckoutModal() {
  const isOpen = useStore(isCheckoutOpen);
  const { items, total } = useStore(groupedCart);

  // --- CONFIGURACIÓN DE PANTRY (CONTADOR) ---
  const PANTRY_ID = "262852f3-c7f9-4503-aaea-2ad6f03cbdab";
  const BASKET_NAME = "contador_pedidos"; 
  const API_URL = `https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}/basket/${BASKET_NAME}`;

  const SUCURSALES = {
    "Miraflores": { nombre: "Pizzetos Miraflores", telefono: "5215584457355" },
    "Chalco": { nombre: "Pizzetos Chalco", telefono: "5215573959109" }
  };

  const [formData, setFormData] = useState({
    nombre: '', telefono: '', direccion: '', sucursal: '',
    metodoPago: 'Efectivo', pagoCon: '', notas: ''
  });

  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  const updateCounter = async (sucursalElegida) => {
    try {
      let currentData = { "Miraflores": 0, "Chalco": 0 };
      try {
        const response = await fetch(API_URL);
        if (response.ok) currentData = await response.json();
      } catch (e) { }

      const newData = {
        ...currentData,
        [sucursalElegida]: (currentData[sucursalElegida] || 0) + 1,
        "_ultima_actualizacion": new Date().toLocaleString()
      };

      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
    } catch (error) {
      console.error("Error en contador:", error);
    }
  };

  const handleSendOrder = async () => {
    const sucursalData = SUCURSALES[formData.sucursal];
    if (!sucursalData) return;
    
    setIsSending(true);

    // --- CONSTRUCCIÓN DEL MENSAJE ---
    let message = `*NUEVO PEDIDO - ${sucursalData.nombre.toUpperCase()}*%0A%0A`;
    message += `*DATOS DEL CLIENTE*%0A`;
    message += `Nombre: ${formData.nombre}%0A`;
    message += `Teléfono: ${formData.telefono}%0A`;
    message += `Dirección: ${formData.direccion}%0A`;
    if (formData.notas) message += `Ref: ${formData.notas}%0A`;
    
    message += `%0A*DETALLES DEL PEDIDO*%0A`;
    
    items.forEach(item => {
      if (item.type === 'promo_pair') {
        message += `%0A- PROMO 2x1 (${item.size}) - $${item.price}%0A`;
        item.items.forEach((pizza, idx) => {
          message += `     ${idx + 1}. ${pizza.name}${pizza.orillaQueso ? ' (+Orilla Queso)' : ''}%0A`;
        });
      } else {
        message += `%0A- ${item.name.toUpperCase()}%0A`;
        
        // --- DESCRIPCIÓN "INVISIBLE" PARA PAQUETE 1 EN WHATSAPP ---
        if (item.name.toUpperCase() === 'PAQUETE 1') {
          message += `  _Pizza Hawaiana y Pepperoni (2x1) + 1 Refresco Jarrito_%0A`;
        }

        if (item.size && item.size !== 'General') message += `  Tamaño: ${item.size}%0A`;

        const selections = item.selections || {};
        const refrescoElegido = selections.drink || (item.category === 'Bebidas' ? selections.flavor : null);
        const especialidades = Object.entries(selections)
          .filter(([key, value]) => key !== 'drink' && key !== 'size' && value !== refrescoElegido && value)
          .map(([_, value]) => value)
          .join(', ');

        if (especialidades) message += `  Especialidades: ${especialidades}%0A`;
        if (refrescoElegido) message += `  Refresco: ${refrescoElegido}%0A`;
        
        if (item.orillaQueso) message += `  + Orilla de Queso%0A`;
        message += `  *Subtotal: $${item.price}*%0A`;
      }
    });
    
    message += `%0A----------------------------%0A`;
    message += `METODO DE PAGO: ${formData.metodoPago}%0A`;
    if (formData.metodoPago === 'Efectivo' && formData.pagoCon) {
      const pago = parseFloat(formData.pagoCon);
      message += `Paga con: $${pago}%0A`;
      if (pago > total) message += `Cambio: $${pago - total}%0A`;
    }
    
    message += `%0A*TOTAL A PAGAR: $${total}*%0A`;
    message += `%0A_Pedido enviado desde la web Pizzetos_`;

    // --- MEJORA: ABRIR WHATSAPP ANTES DEL AWAIT PARA EVITAR BLOQUEOS ---
    window.open(`https://wa.me/${sucursalData.telefono}?text=${message}`, '_blank');

    // Ejecutar el contador después de abrir la ventana
    await updateCounter(formData.sucursal);
    
    setIsSending(false);
    clearCart(); 
    toggleCheckout(false); 
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => toggleCheckout(false)}></div>
      
      <div className="relative w-full max-w-2xl bg-[#FFFBF2] rounded-2xl shadow-2xl border border-orange-100 overflow-hidden flex flex-col md:flex-row animate-fade-in-up max-h-[90vh] md:max-h-none overflow-y-auto">
        
        {/* RESUMEN IZQUIERDA */}
        <div className="bg-white p-6 md:w-2/5 border-r border-orange-50 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-amber-600 font-bold text-xs uppercase tracking-widest mb-4">Resumen</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {items.map(item => (
                <div key={item.uniqueId} className="flex flex-col border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-gray-800 text-sm pr-2 leading-tight">
                      {item.type === 'promo_pair' ? `PROMO 2X1 (${item.size})` : item.name}
                    </span>
                    <span className="text-amber-600 font-bold text-sm">${item.price}</span>
                  </div>

                  {item.type === 'promo_pair' ? (
                    <div className="ml-2 space-y-2 mt-1">
                      {item.items.map((pizza, idx) => (
                        <div key={pizza.uniqueId} className="text-[11px] text-gray-600 bg-orange-50/50 p-1.5 rounded border border-orange-100">
                          <span className="font-bold text-orange-700">{idx + 1}. {pizza.name}</span>
                          {pizza.orillaQueso && (
                            <span className="block text-orange-600 font-medium">+ Orilla de Queso</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {item.size && item.size !== "General" && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full w-fit font-bold uppercase mb-1">
                          {item.size}
                        </span>
                      )}
                      {item.orillaQueso && (
                        <span className="text-[10px] text-orange-600 font-bold flex items-center gap-1 mb-1">
                          + Orilla de Queso
                        </span>
                      )}
                      {item.customDescription && (
                        <p className="text-[10px] text-gray-500 italic pl-2 border-l-2 border-amber-300">
                          {item.customDescription}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-orange-100 flex justify-between items-end">
            <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total</span>
            <span className="text-3xl font-serif italic text-amber-600 font-medium">${total}</span>
          </div>
        </div>

        {/* FORMULARIO DERECHA */}
        <div className="p-6 md:w-3/5 bg-[#FFFBF2]">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-serif text-gray-800">Finalizar Pedido</h2>
            <button onClick={() => toggleCheckout(false)} className="text-gray-400 hover:text-red-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">¿A qué sucursal pides?</label>
              <select name="sucursal" value={formData.sucursal} onChange={handleChange} className="w-full bg-white border border-orange-200 rounded-lg p-3 text-gray-800 outline-none focus:border-amber-500 shadow-sm">
                <option value="" disabled>Selecciona sucursal...</option>
                <option value="Miraflores">Pizzetos Miraflores</option>
                <option value="Chalco">Pizzetos Chalco</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full bg-white border border-orange-200 rounded-lg p-3 text-sm text-gray-800 outline-none focus:border-amber-500" placeholder="¿A nombre de quién?" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Teléfono</label>
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full bg-white border border-orange-200 rounded-lg p-3 text-sm text-gray-800 outline-none focus:border-amber-500" placeholder="10 dígitos" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Método de Pago</label>
                <select name="metodoPago" value={formData.metodoPago} onChange={handleChange} className="w-full bg-white border border-orange-200 rounded-lg p-3 text-sm text-gray-800 outline-none focus:border-amber-500">
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>
              {formData.metodoPago === 'Efectivo' && (
                <div className="animate-fadeIn">
                  <label className="block text-xs text-amber-600 mb-1 font-bold">¿Con cuánto pagas?</label>
                  <input type="number" name="pagoCon" value={formData.pagoCon} onChange={handleChange} className="w-full bg-white border border-amber-300 rounded-lg p-3 text-sm text-gray-800 outline-none focus:border-amber-500" placeholder="Ej: 500" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Dirección Completa</label>
              <textarea name="direccion" rows="2" value={formData.direccion} onChange={handleChange} className="w-full bg-white border border-orange-200 rounded-lg p-3 text-sm text-gray-800 outline-none focus:border-amber-500 resize-none" placeholder="Calle, número, colonia..."></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Referencias / Notas</label>
              <input type="text" name="notas" value={formData.notas} onChange={handleChange} className="w-full bg-white border border-orange-200 rounded-lg p-3 text-sm text-gray-800 outline-none focus:border-amber-500" placeholder="Fachada color, entre calles, etc." />
            </div>

            <button 
              onClick={handleSendOrder}
              disabled={!formData.nombre || !formData.direccion || !formData.telefono || !formData.sucursal || isSending}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${(!formData.nombre || !formData.direccion || !formData.telefono || !formData.sucursal || isSending) ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-[#25D366] hover:bg-[#20bd5a] hover:shadow-green-500/30'}`}
            >
              <span>{isSending ? 'Procesando...' : 'Confirmar Pedido'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}