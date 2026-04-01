'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '@/components/public/StripePaymentForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

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
  const [step, setStep] = useState<'datos' | 'pago'>('datos');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
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
        if (value.trim() && !PHONE_REGEX.test(value.replace(/\s/g, ''))) return 'Formato inválido (ej: 612345678)';
        return undefined;
      default:
        return undefined;
    }
  }, [tipo]);

  const validateAll = useCallback((): boolean => {
    const fields = ['cliente', 'telefono'];
    if (tipo === 'domicilio') fields.push('calle', 'numero', 'ciudad', 'codigoPostal');
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

  if (items.length === 0 && step === 'datos') {
    return (
      <div className="min-h-screen bg-[#160a00] flex flex-col items-center justify-center pt-20 px-4">
        <span className="text-5xl mb-4 opacity-30">🛒</span>
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

  // Paso 1: Crear pedido + Payment Intent
  const handleContinuarAlPago = async () => {
    if (!validateAll()) {
      toast.error('Revisa los campos marcados en rojo');
      return;
    }
    setLoading(true);

    try {
      // Validar que todos los productoId son ObjectIds válidos de MongoDB (24 hex chars)
      const idValido = /^[a-f0-9]{24}$/;
      const productosInvalidos = items.filter((i) => !idValido.test(i.productoId));
      if (productosInvalidos.length > 0) {
        clearCart();
        toast.error('Tu carrito tenía productos desactualizados. Se ha vaciado. Vuelve a añadir los productos.');
        return;
      }

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

      const res = await fetch('/api/public/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al crear el pedido');
      }

      setClientSecret(data.data.clientSecret);
      setPaymentIntentId(data.data.paymentIntentId);
      setStep('pago');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (newPedidoId: string) => {
    clearCart();
    router.push(`/pedir/confirmacion/${newPedidoId}`);
  };

  const handlePaymentError = (message: string) => {
    toast.error(message);
  };

  return (
    <div className="min-h-screen bg-[#160a00] pt-20 pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {step === 'datos' ? (
          <Link href="/pedir" className="text-sm text-gray-500 hover:text-amber-400 transition mb-4 inline-block">
            ← Volver a la carta
          </Link>
        ) : (
          <button onClick={() => setStep('datos')} className="text-sm text-gray-500 hover:text-amber-400 transition mb-4 inline-block">
            ← Volver a datos del pedido
          </button>
        )}

        {/* Progress steps */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`flex items-center gap-2 ${step === 'datos' ? 'text-amber-500' : 'text-green-500'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'datos' ? 'bg-amber-600 text-white' : 'bg-green-600 text-white'
            }`}>{step === 'datos' ? '1' : '✓'}</span>
            <span className="text-sm font-semibold">Datos</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-700 rounded">
            <div className={`h-full rounded transition-all ${step === 'pago' ? 'bg-amber-500 w-full' : 'w-0'}`} />
          </div>
          <div className={`flex items-center gap-2 ${step === 'pago' ? 'text-amber-500' : 'text-gray-600'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'pago' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-500'
            }`}>2</span>
            <span className="text-sm font-semibold">Pago</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-amber-500 mb-6">
          {step === 'datos' ? 'Datos del pedido' : 'Método de pago'}
        </h1>

        {step === 'datos' ? (
          /* ═══ PASO 1: DATOS ═══ */
          <div className="space-y-8">
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
                  🛵 Domicilio (+3.50€)
                </button>
              </div>
            </div>

            {/* Datos del cliente */}
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Tus datos</p>
              <div>
                <input type="text" name="cliente" value={form.cliente} onChange={handleChange} onBlur={handleBlur}
                  placeholder="Nombre *" className={inputClass('cliente')} />
                {touched.has('cliente') && errors.cliente && <p className="text-red-400 text-xs mt-1">{errors.cliente}</p>}
              </div>
              <div>
                <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} onBlur={handleBlur}
                  placeholder="Teléfono * (ej: 612345678)" className={inputClass('telefono')} />
                {touched.has('telefono') && errors.telefono && <p className="text-red-400 text-xs mt-1">{errors.telefono}</p>}
              </div>
            </div>

            {/* Dirección (solo domicilio) */}
            {tipo === 'domicilio' && (
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">📍 Dirección de entrega</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input type="text" name="calle" value={form.calle} onChange={handleChange} onBlur={handleBlur}
                      placeholder="Calle *" className={inputClass('calle')} />
                    {touched.has('calle') && errors.calle && <p className="text-red-400 text-xs mt-1">{errors.calle}</p>}
                  </div>
                  <div>
                    <input type="text" name="numero" value={form.numero} onChange={handleChange} onBlur={handleBlur}
                      placeholder="Nº *" className={inputClass('numero')} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" name="piso" value={form.piso} onChange={handleChange}
                    placeholder="Piso (opc.)" className={inputClass('piso')} />
                  <div>
                    <input type="text" name="ciudad" value={form.ciudad} onChange={handleChange} onBlur={handleBlur}
                      placeholder="Ciudad *" className={inputClass('ciudad')} />
                  </div>
                  <div>
                    <input type="text" name="codigoPostal" value={form.codigoPostal} onChange={handleChange} onBlur={handleBlur}
                      placeholder="CP *" maxLength={5} className={inputClass('codigoPostal')} />
                  </div>
                </div>
                <input type="tel" name="telefonoEntrega" value={form.telefonoEntrega} onChange={handleChange}
                  placeholder="Teléfono de entrega (si es diferente)" className={inputClass('telefonoEntrega')} />
              </div>
            )}

            {/* Notas */}
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Notas del pedido (opcional)</p>
              <textarea name="notas" value={form.notas} onChange={handleChange}
                placeholder="Ej: tocar el timbre, dejar en portería..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none resize-none"
                rows={2} maxLength={500} />
            </div>

            {/* Resumen del pedido */}
            <div className="bg-gray-800/80 rounded-xl border border-gray-600/50 p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Resumen del pedido</p>
              <div className="space-y-2 mb-4">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div className="min-w-0 flex-1">
                      <span className="text-amber-400 font-semibold">{item.cantidad}x</span>
                      <span className="text-gray-300 ml-1">{item.nombre}</span>
                      {item.personalizaciones?.ingredientesExtra && item.personalizaciones.ingredientesExtra.length > 0 && (
                        <p className="text-[10px] text-green-400 ml-4">+ {item.personalizaciones.ingredientesExtra.join(', ')}</p>
                      )}
                      {item.personalizaciones?.ingredientesRemovidos && item.personalizaciones.ingredientesRemovidos.length > 0 && (
                        <p className="text-[10px] text-red-400 ml-4">- {item.personalizaciones.ingredientesRemovidos.join(', ')}</p>
                      )}
                    </div>
                    <span className="text-amber-400 font-semibold shrink-0 ml-2">
                      {((item.precio + (item.personalizaciones?.precioExtras ?? 0)) * item.cantidad).toFixed(2)}€
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-700 pt-3 space-y-1">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span><span>{total.toFixed(2)}€</span>
                </div>
                {gastoEnvio > 0 && (
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Envío</span><span>{gastoEnvio.toFixed(2)}€</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-white pt-1">
                  <span>Total</span><span className="text-amber-400">{totalFinal.toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {/* Botón continuar al pago */}
            <button
              onClick={handleContinuarAlPago}
              disabled={loading}
              className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white rounded-xl font-bold text-lg transition active:scale-[0.98] shadow-lg shadow-green-600/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Preparando pago...
                </span>
              ) : (
                `Continuar al pago — ${totalFinal.toFixed(2)}€`
              )}
            </button>
          </div>
        ) : (
          /* ═══ PASO 2: PAGO CON STRIPE ═══ */
          <div className="space-y-6">
            {/* Resumen compacto */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">{tipo === 'recoger' ? '🛍️ Para recoger' : '🛵 A domicilio'}</p>
                  <p className="text-white font-semibold">{form.cliente} · {form.telefono}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{items.length} producto{items.length !== 1 ? 's' : ''}</p>
                  <p className="text-xl font-bold text-amber-400">{totalFinal.toFixed(2)}€</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('datos')}
              className="text-sm text-gray-500 hover:text-amber-400 transition"
            >
              ← Volver a modificar datos
            </button>

            {/* Formulario de pago Stripe */}
            {clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'night',
                    variables: {
                      colorPrimary: '#d97706',
                      colorBackground: '#1f2937',
                      colorText: '#ffffff',
                      colorDanger: '#ef4444',
                      borderRadius: '12px',
                      fontFamily: 'system-ui, sans-serif',
                    },
                  },
                }}
              >
                <StripePaymentForm
                  total={totalFinal}
                  paymentIntentId={paymentIntentId!}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            )}

            {/* Tarjetas de prueba — solo en desarrollo */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
                <p className="text-blue-400 text-xs font-semibold mb-2">🧪 Modo test — Tarjetas de prueba:</p>
                <div className="space-y-1 text-xs text-blue-300/80">
                  <p><span className="font-mono bg-blue-900/50 px-1.5 py-0.5 rounded">4242 4242 4242 4242</span> — Pago exitoso</p>
                  <p><span className="font-mono bg-blue-900/50 px-1.5 py-0.5 rounded">4000 0000 0000 0002</span> — Tarjeta rechazada</p>
                  <p className="text-blue-300/60">Fecha: cualquier futura · CVC: cualquiera de 3 dígitos</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
