'use client';

import { useState } from 'react';

export default function LoginForm() {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('🔄 Intentando login...');

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, password })
            });

            console.log('📡 Response status:', response.status);

            const data = await response.json();
            console.log('📦 Response data:', data);

            if (!response.ok) {
                setError(data.error || 'Error en el login');
                console.error('❌ Error:', data.error);
                setLoading(false);
                return;
            }

            console.log('✅ Login exitoso');

            // GUARDAR TOKEN
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('usuario', data.usuario);
            localStorage.setItem('rol', data.rol);

            console.log('💾 Token guardado en localStorage');
            console.log('🔑 Token:', data.token.substring(0, 20) + '...');

            // LIMPIAR FORMULARIO
            setUsuario('');
            setPassword('');

            // REDIRIGIR
            console.log('🚀 Redirigiendo a /admin/productos...');

            // Redirige de forma más confiable
            window.location.href = '/admin/productos';

        } catch (err) {
            console.error('🔥 Error de conexión:', err);
            setError('Error de conexión');
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
            <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md border border-amber-400/20">

                <h1 className="text-3xl font-bold text-amber-400 text-center mb-2">
                    🐂 El Buey Madurado
                </h1>
                <h2 className="text-lg text-gray-300 text-center mb-6">
                    Panel de Administración
                </h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="usuario" className="block text-sm font-medium text-gray-300 mb-2">
                            Usuario
                        </label>
                        <input
                            id="usuario"
                            type="text"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            placeholder="admin o editor"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-amber-400"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-amber-400"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-2 rounded hover:from-amber-600 hover:to-amber-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className="text-xs text-gray-500 text-center mt-4">
                    <p className="font-semibold mb-2">Usuarios de prueba:</p>
                    <p>👤 admin / admin123</p>
                    <p>✏️ editor / editor123</p>
                </div>
            </div>
        </div>
    );
}
