'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';
import { toast } from 'sonner';

interface FormErrors {
  cliente?: string;
  telefono?: string;
  calle?: string;
  numero?: string;
  ciudad?: string;
  codigoPostal?: string;
  telefonoEntrega?: string;
}

const PHONE_REGEX = /^(\+34\s?)?[6-9]\d{8}$/;
const CP_REGEX = /^\d{5}$/;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart, tipoPedido, setTipoPedido } = useCart();
  const tipo = tipoPedido || 'recoger';
  const setTipo = setTipoPedido;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
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

  const validateField = useCallback((name: string, value: string, currentTipo?: string): string | undefined => {
    const t = currentTipo ?? tipo;
    switch (name) {
      case 'cliente':
        if (!value.trim()) return 'El nombre es obligatorio';
        if (value.trim().length < 2) return 'Mínimo 2 caracteres';
        if (value.trim().length > 60) return 'Máximo 60 caracteres';
        return undefined;
      case 'telefono':
        if (!value.trim()) return 'El teléfono es obligatorio';
        if (!PHONE_REGEX.test(value.replace(/\s/g, ''))) return 'Formato inválido (ej: 612345678)';
        return undefined;
      case 'calle':
        if (t === 'domicilio' && !value.trim()) return 'La calle es obligatoria';
        if (value.length > 100) return 'Máximo 100 caracteres';
        return undefined;
      case 'numero':
        if (t === 'domicilio' && !value.trim()) return 'El número es obligatorio';
        return undefined;
      case 'ciudad':
        if (t === 'domicilio' && !value.trim()) return 'La ciudad es obligatoria';
        return undefined;
      case 'codigoPostal':
        if (t === 'domicilio' && !value.trim()) return 'El código postal es obligatorio';
        if (t === 'domicilio' && !CP_REGEX.test(value)) return 'Debe tener 5 dígitos';
        return undefined;
      case 'telefonoEntrega':
        if (value.trim() && !PHONE_REGEX.test(value.replace(/\s/g, ''))) return 'Formato inválido';
        return undefined;
      default:
        return undefined;
    }
  }, [tipo]);

  const validateAll = useCallback((): boolean => {
    const fields = ['cliente', 'telefono'];
    if (tipo === 'domicilio') fields.push('calle', 'numero', 'ciudad', 'codigoPostal', 'telefonoEntrega');
    const newErrors: FormErrors = {};
    let valid = true;
    for (const field of fields) {
      const err = validateField(field, form[field as keyof typeof form]);
      if (err) {
        newErrors[field as keyof FormErrors] = err;
        valid = false;
      }
    }
    setErrors(newErrors);
    setTouched(new Set(fields));
    return valid;
  }, [form, tipo, validateField]);

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
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched.has(name)) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => new Set(prev).add(name));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const inputClass = (name: string) =>
    `w-full px-4 py-3 bg-gray-800 border rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none transition ${
      touched.has(name) && errors[name as keyof FormErrors]
        ? 'border-red-500 focus:border-red-400'
        : 'border-gray-700 focus:border-amber-500'
    }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) {
      toast.error('Revisa los campos marcados en rojo');
      return;
    }
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
            <div>
              <input
                type="text"
                name="cliente"
                value={form.cliente}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="Tu nombre *"
                aria-invalid={!!errors.cliente}
                className={inputClass('cliente')}
              />
              {touched.has('cliente') && errors.cliente && (
                <p className="text-red-400 text-xs mt-1 ml-1">{errors.cliente}</p>
              )}
            </div>
            <div>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="Tu teléfono * (ej: 612345678)"
                aria-invalid={!!errors.telefono}
                className={inputClass('telefono')}
              />
              {touched.has('telefono') && errors.telefono && (
                <p className="text-red-400 text-xs mt-1 ml-1">{errors.telefono}</p>
              )}
            </div>
          </div>

          {/* Dirección (solo domicilio) */}
          {tipo === 'domicilio' && (
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">📍 Dirección de entrega</p>
              <div className="bg-amber-600/10 border border-amber-600/30 rounded-xl px-4 py-2.5 text-xs text-amber-300">
                🛵 Zona de reparto: Xàtiva y alrededores (máx. 5 km). Envío +3.50€
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input type="text" name="calle" value={form.calle} onChange={handleChange} onBlur={handleBlur} required placeholder="Calle *" aria-invalid={!!errors.calle} className={inputClass('calle').replace('w-full ', '')} />
                  {touched.has('calle') && errors.calle && <p className="text-red-400 text-xs mt-1 ml-1">{errors.calle}</p>}
                </div>
                <div>
                  <input type="text" name="numero" value={form.numero} onChange={handleChange} onBlur={handleBlur} required placeholder="Nº *" aria-invalid={!!errors.numero} className={inputClass('numero').replace('w-full ', '')} />
                  {touched.has('numero') && errors.numero && <p className="text-red-400 text-xs mt-1 ml-1">{errors.numero}</p>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input type="text" name="piso" value={form.piso} onChange={handleChange} placeholder="Piso / Puerta" className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none" />
                <div>
                  <input type="text" name="ciudad" value={form.ciudad} onChange={handleChange} onBlur={handleBlur} required placeholder="Ciudad *" aria-invalid={!!errors.ciudad} className={inputClass('ciudad').replace('w-full ', '')} />
                  {touched.has('ciudad') && errors.ciudad && <p className="text-red-400 text-xs mt-1 ml-1">{errors.ciudad}</p>}
                </div>
                <div>
                  <input type="text" name="codigoPostal" value={form.codigoPostal} onChange={handleChange} onBlur={handleBlur} required placeholder="CP *" maxLength={5} aria-invalid={!!errors.codigoPostal} className={inputClass('codigoPostal').replace('w-full ', '')} />
                  {touched.has('codigoPostal') && errors.codigoPostal && <p className="text-red-400 text-xs mt-1 ml-1">{errors.codigoPostal}</p>}
                </div>
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
                <div className="flex items-center gap-3 text-sm text-gray-200">
                  {item.imagen && (
                    <img src={item.imagen} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  )}
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

          {/* Tiempo estimado */}
          <div className="bg-gray-800/50 border border-gray-700/30 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-xl">⏱️</span>
            <div>
              <p className="text-sm font-semibold text-white">
                Tiempo estimado: {tipo === 'domicilio' ? '35–50 min' : '20–30 min'}
              </p>
              <p className="text-xs text-gray-500">
                {tipo === 'recoger' ? 'Te avisaremos cuando esté listo para recoger' : 'Desde la confirmación del pedido'}
              </p>
            </div>
          </div>

          {/* Confirmar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg transition active:scale-[0.98] shadow-lg shadow-green-600/20 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando pedido...
              </>
            ) : (
              `Confirmar pedido — ${totalFinal.toFixed(2)}€`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
