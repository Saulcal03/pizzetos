import { useStore } from '@nanostores/react';
// 1. IMPORTAMOS clearCart AQUÍ ABAJO 👇
import { isCheckoutOpen, toggleCheckout, groupedCart, clearCart } from '../../stores/cartStore';
import { useState } from 'react';

export default function CheckoutModal() {
  const isOpen = useStore(isCheckoutOpen);
  const { items, total } = useStore(groupedCart);

  // --- ☁️ TU NUBE PRIVADA (CONTADOR) ---
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

  // --- FUNCIÓN: GUARDAR EL CONTADOR ---
  const updateCounter = async (sucursalElegida) => {
    try {
      let currentData = { "Miraflores": 0, "Chalco": 0 };
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
            currentData = await response.json();
        }
      } catch (e) { }

      const currentCount = currentData[sucursalElegida] || 0;
      const newData = {
        ...currentData,
        [sucursalElegida]: currentCount + 1,
        "_ultima_actualizacion": new Date().toLocaleString()
      };

      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      
      console.log("Contador actualizado:", newData);

    } catch (error) {
      console.error("Error actualizando contador:", error);
    }
  };

  const handleSendOrder = async () => {
    const sucursalData = SUCURSALES[formData.sucursal];
    if (!sucursalData) return;
    
    setIsSending(true);

    // >> ACTIVAMOS EL CONTADOR <<
    updateCounter(formData.sucursal);

    // --- PREPARAR WHATSAPP ---
    let message = `⭐ *NUEVO PEDIDO - ${sucursalData.nombre.toUpperCase()}* ⭐%0A%0A`;
    message += `👤 *DATOS DEL CLIENTE*%0A*Nombre:* ${formData.nombre}%0A*Teléfono:* ${formData.telefono}%0A📍 *Dirección:* ${formData.direccion}%0A`;
    if (formData.notas) message += `📝 *Ref:* ${formData.notas}%0A`;
    
    message += `%0A🍕 *DETALLES*%0A`;
    items.forEach(item => {
      if (item.type === 'promo_pair') {
        message += `- *PROMO 2x1* ($${item.price}):%0A   • ${item.items[0].name} (${item.size})%0A   • ${item.items[1].name} (${item.size})%0A`;
      } else {
        message += `- *${item.name}* ($${item.price})%0A`;
        if (item.size && item.category !== 'paquetes') message += `   Tam: ${item.size}%0A`;
        if (item.customDescription) message += `   Det: ${item.customDescription}%0A`;
      }
    });
    
    message += `%0A💰 *PAGO:* ${formData.metodoPago}%0A`;
    if (formData.metodoPago === 'Efectivo' && formData.pagoCon) {
        // const cambio = parseFloat(formData.pagoCon) - total; // (Opcional si quieres mostrar cambio)
        message += `_Paga con: $${formData.pagoCon} _`;
    }
    message += `%0A*TOTAL: $${total}*`;

    // Abrir WhatsApp
    window.open(`https://wa.me/${sucursalData.telefono}?text=${message}`, '_blank');
    
    setIsSending(false);
    
    // 2. ¡AQUÍ ESTÁ LA MAGIA! 👇
    // Limpiamos el carrito y luego cerramos el modal
    clearCart(); 
    toggleCheckout(false); 
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => toggleCheckout(false)}></div>
      
      {/* VENTANA MODAL */}
      <div className="relative w-full max-w-2xl bg-[#FFFBF2] rounded-2xl shadow-2xl border border-orange-100 overflow-hidden flex flex-col md:flex-row animate-fade-in-up max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
        
        {/* IZQUIERDA: RESUMEN */}
        <div className="bg-white p-6 md:w-2/5 border-r border-orange-50 flex flex-col justify-between shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-10">
          <div>
            <h3 className="text-amber-600 font-bold text-xs uppercase tracking-widest mb-4">Tu Pedido</h3>
            <div className="space-y-4 max-h-[200px] md:max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
              {items.map(item => (
                <div key={item.uniqueId} className="flex flex-col border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-gray-800 text-sm leading-tight pr-2">{item.title || item.name}</span>
                    <span className="text-amber-600 font-bold text-sm">${item.price}</span>
                  </div>
                  {item.size && item.category !== 'paquetes' && <span className="text-[11px] text-gray-500 font-medium">{item.size}</span>}
                  {item.customDescription && item.customDescription !== item.size && (
                      <p className="text-[11px] text-gray-600 mt-1 pl-2 border-l-2 border-amber-300 italic">{item.customDescription}</p>
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

        {/* DERECHA: FORMULARIO */}
        <div className="p-6 md:w-3/5 bg-[#FFFBF2]">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-serif text-gray-800">Datos de Entrega</h2>
            <button onClick={() => toggleCheckout(false)} className="text-gray-400 hover:text-red-500 transition p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="group">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Sucursal</label>
              <select name="sucursal" value={formData.sucursal} onChange={handleChange} className="w-full bg-white border border-orange-200 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-sm cursor-pointer">
                <option value="" disabled>Selecciona una opción...</option>
                <option value="Miraflores">📍 Pizzetos Miraflores</option>
                <option value="Chalco">📍 Pizzetos Chalco</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="group">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full bg-white border border-orange-200 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-sm" placeholder="Tu nombre" />
                </div>
                <div className="group">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Teléfono</label>
                    <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full bg-white border border-orange-200 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-sm" placeholder="10 dígitos" />
                </div>
            </div>
              
            <div className="grid grid-cols-2 gap-4">
                <div className="group">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Pago</label>
                    <select name="metodoPago" value={formData.metodoPago} onChange={handleChange} className="w-full bg-white border border-orange-200 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-sm cursor-pointer">
                    <option value="Efectivo">💵 Efectivo</option>
                    <option value="Transferencia">📱 Transferencia</option>
                    <option value="Tarjeta">💳 Tarjeta</option>
                    </select>
                </div>
                {formData.metodoPago === 'Efectivo' && (
                    <div className="group animate-fadeIn">
                        <label className="block text-xs text-amber-600 mb-1 font-bold">¿Pagas con?</label>
                        <input type="number" name="pagoCon" value={formData.pagoCon} onChange={handleChange} className="w-full bg-white border border-amber-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-sm" placeholder={`Ej: ${Math.ceil(total / 50) * 50}`} />
                    </div>
                )}
            </div>

            <div className="group">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Dirección</label>
              <textarea name="direccion" rows="2" value={formData.direccion} onChange={handleChange} className="w-full bg-white border border-orange-200 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-sm resize-none" placeholder="Calle, Número, Colonia..."></textarea>
            </div>

            <div className="group">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Referencias</label>
              <input type="text" name="notas" value={formData.notas} onChange={handleChange} className="w-full bg-white border border-orange-200 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-sm" placeholder="Fachada color..." />
            </div>

            <button 
              onClick={handleSendOrder}
              disabled={!formData.nombre || !formData.direccion || !formData.telefono || !formData.sucursal || isSending}
              className={`
                w-full mt-2 py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1
                ${(!formData.nombre || !formData.direccion || !formData.telefono || !formData.sucursal || isSending) 
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500 shadow-none' 
                  : 'bg-[#25D366] hover:bg-[#20bd5a] hover:shadow-green-500/30'}
              `}
            >
              <span>{isSending ? 'Procesando...' : 'Enviar Pedido por WhatsApp'}</span>
              {!isSending && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>}
            </button>
            <p className="text-[10px] text-gray-500 text-center font-medium">Al confirmar, se abrirá WhatsApp con el número de la sucursal seleccionada.</p>
          </div>
        </div>
      </div>
    </div>
  );
}