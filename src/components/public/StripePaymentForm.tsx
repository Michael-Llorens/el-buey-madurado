'use client';

import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripePaymentFormProps {
  total: number;
  paymentIntentId: string;
  onSuccess: (pedidoId: string) => void;
  onError: (message: string) => void;
}

export default function StripePaymentForm({ total, paymentIntentId, onSuccess, onError }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pedir/checkout`,
      },
      redirect: 'if_required',
    });

    if (error) {
      onError(error.message || 'Error al procesar el pago');
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      // Pago exitoso → ahora crear el pedido
      try {
        const res = await fetch('/api/public/checkout/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Error al confirmar el pedido');
        }

        onSuccess(data.data._id);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al confirmar el pedido';
        onError(message);
        setProcessing(false);
      }
    } else {
      onError('El pago no se completó. Inténtalo de nuevo.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition active:scale-[0.98] shadow-lg shadow-green-600/20"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Procesando pago...
          </span>
        ) : (
          `Pagar ${total.toFixed(2)}€`
        )}
      </button>

      <p className="text-center text-[10px] text-gray-600">
        🔒 Pago seguro procesado por Stripe. Tus datos están protegidos.
      </p>
    </form>
  );
}
