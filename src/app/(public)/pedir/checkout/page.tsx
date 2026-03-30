'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart, tipoPedido, setTipoPedido } = useCart();
  const tipo = tipoPedido || 'recoger';
  const setTipo = setTipoPedido;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    cliente: '',
    telefono: '',
    notas: '',
    calle: '',
    numero: '',
    piso: '',
    ciudad: 'Xàtiva',
    codigoPostal: '46800',
    telefonoEntrega: '',
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#160a00] flex flex-col items-center justify-center pt-20 px-4">
        <p className="text-gray-400 text-lg mb-4">No tienes productos en el carrito</p>
        <Link href="/pedir" className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition">
          Ver carta
        </Link>
      </div>
    );
  }

  const gastoEnvio = tipo === 'domicilio' ? 3.5 : 0;
  const totalFinal = total + gastoEnvio;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const body: Record<string, unknown> = {
        tipo,
        cliente: form.cliente,
        telefono: form.telefono,
        notas: form.notas,
        productos: items.map((item) => ({
          producto: item.productoId,
          cantidad: item.cantidad,
          notas: item.notas || '',
          personalizaciones: {
            ingredientesExtra: item.personalizaciones?.ingredientesExtra ?? [],
            ingredientesRemovidos: item.personalizaciones?.ingredientesRemovidos ?? [],
          },
        })),
      };

      if (tipo === 'domicilio') {
        body.direccionEntrega = {
          calle: form.calle,
          numero: form.numero,
          piso: form.piso,
          ciudad: form.ciudad,
          codigoPostal: form.codigoPostal,
          telefono: form.telefonoEntrega || form.telefono,
        };
        body.gastoEnvio = gastoEnvio;
      }

      const res = await fetch('/api/public/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al crear el pedido');
      }

      clearCart();
      router.push(`/pedir/confirmacion/${data.data._id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#160a00] pt-20 pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link href="/pedir/carrito" className="text-sm text-gray-500 hover:text-amber-400 transition mb-4 inline-block">
          ← Volver al carrito
        </Link>
        <h1 className="text-2xl font-bold text-amber-500 mb-6">Finalizar pedido</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tipo de pedido */}
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Tipo de pedido</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTipo('recoger')}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition ${
                  tipo === 'recoger' ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}
              >
                🛍️ Recoger
              </button>
              <button
                type="button"
                onClick={() => setTipo('domicilio')}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition ${
                  tipo === 'domicilio' ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}
              >
                🛵 Domicilio
              </button>
            </div>
          </div>

          {/* Datos del cliente */}
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Tus datos</p>
            <input
              type="text"
              name="cliente"
              value={form.cliente}
              onChange={handleChange}
              required
              placeholder="Tu nombre *"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none"
            />
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              required
              placeholder="Tu teléfono *"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Dirección (solo domicilio) */}
          {tipo === 'domicilio' && (
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">📍 Dirección de entrega</p>
              <div className="grid grid-cols-3 gap-2">
                <input type="text" name="calle" value={form.calle} onChange={handleChange} required placeholder="Calle *" className="col-span-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none" />
                <input type="text" name="numero" value={form.numero} onChange={handleChange} required placeholder="Nº *" className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input type="text" name="piso" value={form.piso} onChange={handleChange} placeholder="Piso" className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none" />
                <input type="text" name="ciudad" value={form.ciudad} onChange={handleChange} required placeholder="Ciudad *" className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none" />
                <input type="text" name="codigoPostal" value={form.codigoPostal} onChange={handleChange} required placeholder="CP *" maxLength={5} className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none" />
              </div>
            </div>
          )}

          {/* Notas */}
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Notas (opcional)</p>
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleChange}
              placeholder="Indicaciones especiales..."
              rows={2}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none resize-none"
              maxLength={500}
            />
          </div>

          {/* Resumen */}
          <div className="bg-gray-800/80 border border-gray-600/50 rounded-xl p-5 space-y-3">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Resumen del pedido</p>
            {items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between text-sm text-gray-200">
                  <span className="truncate flex-1 font-medium">{item.cantidad}x {item.nombre}</span>
                  <span className="shrink-0 ml-2 text-amber-400">{((item.precio + (item.personalizaciones?.precioExtras ?? 0)) * item.cantidad).toFixed(2)}€</span>
                </div>
                {item.personalizaciones?.ingredientesExtra && item.personalizaciones.ingredientesExtra.length > 0 && (
                  <p className="text-xs text-gray-500 pl-4">+ {item.personalizaciones.ingredientesExtra.join(', ')}</p>
                )}
                {item.personalizaciones?.ingredientesRemovidos && item.personalizaciones.ingredientesRemovidos.length > 0 && (
                  <p className="text-xs text-red-400/60 pl-4">- {item.personalizaciones.ingredientesRemovidos.join(', ')}</p>
                )}
                {item.notas && (
                  <p className="text-xs text-gray-500 pl-4 italic">Nota: {item.notas}</p>
                )}
              </div>
            ))}
            {tipo === 'domicilio' && (
              <div className="flex justify-between text-sm text-gray-400 border-t border-gray-700 pt-2 mt-2">
                <span>Gastos de envío</span>
                <span>{gastoEnvio.toFixed(2)}€</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-white border-t border-gray-700 pt-2 mt-2">
              <span>Total</span>
              <span className="text-amber-400">{totalFinal.toFixed(2)}€</span>
            </div>
          </div>

          {/* Confirmar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white rounded-2xl font-bold text-lg transition active:scale-[0.98] shadow-lg shadow-green-600/20"
          >
            {loading ? 'Enviando pedido...' : `Confirmar pedido — ${totalFinal.toFixed(2)}€`}
          </button>
        </form>
      </div>
    </div>
  );
}
