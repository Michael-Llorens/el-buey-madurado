'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { getErrorMessage } from '@/lib/utils/errors';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        // Redirigir según rol: camarero → mesas, cocinero → cocina, admin → pedidos
        const rol = result.usuario?.rol;
        if (rol === 'cocinero') {
          router.push('/dashboard?modulo=cocina');
        } else if (rol === 'camarero') {
          router.push('/dashboard/mesas');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-themed min-h-screen bg-gray-900 flex items-center justify-center p-4 relative">
      {/* Toggle de tema en esquina superior derecha */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle variant="pill" />
      </div>

      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md border border-gray-700">
        <h1 className="text-2xl font-bold text-amber-400 mb-6 text-center">
          🔐 Acceso Admin
        </h1>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded transition"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}