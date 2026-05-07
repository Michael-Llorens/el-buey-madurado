'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useUsuarios } from '@/lib/hooks/swr';
import ConfirmModal from '@/components/dashboard/ConfirmModal';
import { useConfirm } from '@/components/dashboard/hooks/useConfirm';
import { getErrorMessage } from '@/lib/utils/errors';

type Modo = 'view' | 'add' | 'edit';

export default function UsuariosPanel() {
  const { usuarios, error: swrError, isLoading: loading, mutate } = useUsuarios();
  const { confirmar, confirmProps } = useConfirm();
  const error = swrError?.message ?? null;

  const [modo, setModo] = useState<Modo>('view');
  const [usuarioEditar, setUsuarioEditar] = useState<any>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  // ✏️ Editar usuario
  const handleEditar = (usuario: any) => {
    setUsuarioEditar(usuario);
    setModo('edit');
  };

  // 🗑️ Eliminar usuario
  const handleEliminar = async (id: string) => {
    const ok = await confirmar('¿Seguro que quieres eliminar este usuario?', { titulo: 'Eliminar usuario', textoConfirmar: 'Eliminar' });
    if (!ok) return;

    try {
      setEliminandoId(id);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await mutate();
        toast.success('Usuario eliminado');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setEliminandoId(null);
    }
  };

  // 📊 VISTA
  return (
    <div className="space-y-6">
      {/* HEADER */}
      {modo === 'view' && (
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-amber-300">Gestión de Usuarios</h3>
          <button
            onClick={() => {
              setUsuarioEditar(null);
              setModo('add');
            }}
            className="px-4 sm:px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition text-sm sm:text-base min-h-[44px]"
          >
            ➕ Nuevo Usuario
          </button>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="bg-red-600 text-white p-4 rounded">
          ❌ {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-center text-gray-400 py-8">⏳ Cargando...</div>
      )}

      {/* VISTA: LISTA — tabla en desktop, cards en mobile */}
      {modo === 'view' && !loading && usuarios.length > 0 && (
        <>
          {/* Desktop: tabla */}
          <div className="hidden md:block bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-300">Email</th>
                  <th className="px-6 py-3 text-left text-gray-300">Rol</th>
                  <th className="px-6 py-3 text-left text-gray-300">Estado</th>
                  <th className="px-6 py-3 text-left text-gray-300">Ultimo Login</th>
                  <th className="px-6 py-3 text-center text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario._id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="px-6 py-3 text-gray-200">{usuario.email}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${
                        usuario.rol === 'admin' ? 'bg-red-600 text-white' :
                        usuario.rol === 'cocinero' ? 'bg-blue-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${
                        usuario.activo ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                      }`}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-sm">
                      {usuario.ultimoLogin ? new Date(usuario.ultimoLogin).toLocaleDateString() : 'Nunca'}
                    </td>
                    <td className="px-6 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleEditar(usuario)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(usuario._id)}
                        disabled={eliminandoId === usuario._id}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition disabled:opacity-50 text-sm"
                      >
                        {eliminandoId === usuario._id ? '...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="md:hidden space-y-3">
            {usuarios.map((usuario) => (
              <div key={usuario._id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-sm truncate max-w-[200px]">{usuario.email}</p>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    usuario.rol === 'admin' ? 'bg-red-600 text-white' :
                    usuario.rol === 'cocinero' ? 'bg-blue-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {usuario.rol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <span>{usuario.activo ? 'Activo' : 'Inactivo'}</span>
                  <span>{usuario.ultimoLogin ? new Date(usuario.ultimoLogin).toLocaleDateString() : 'Sin login'}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditar(usuario)}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(usuario._id)}
                    disabled={eliminandoId === usuario._id}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition disabled:opacity-50 text-sm"
                  >
                    {eliminandoId === usuario._id ? '...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* VISTA: VACÍO */}
      {modo === 'view' && !loading && usuarios.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">No hay usuarios aún</p>
        </div>
      )}

      {/* VISTA: FORM */}
      {(modo === 'add' || modo === 'edit') && (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <h3 className="text-xl font-bold mb-6 text-amber-400">
            {modo === 'add' ? '➕ Nuevo Usuario' : '✏️ Editar Usuario'}
          </h3>
          <UsuarioForm
            usuario={usuarioEditar}
            onGuardar={async () => {
              await mutate();
              setModo('view');
            }}
            onCancelar={() => setModo('view')}
          />
        </div>
      )}

      <ConfirmModal {...confirmProps} />
    </div>
  );
}

// FORMULARIO
function UsuarioForm({ usuario, onGuardar, onCancelar }: any) {
  const [form, setForm] = useState(usuario || { email: '', password: '', rol: 'camarero', activo: true });
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const method = usuario ? 'PUT' : 'POST';
      const url = usuario ? `/api/usuarios/${usuario._id}` : '/api/usuarios';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      
      toast.success(usuario ? 'Actualizado' : 'Creado');
      onGuardar();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-300 mb-2">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded text-white min-h-[44px]"
          disabled={!!usuario}
        />
      </div>

      {!usuario && (
        <div>
          <label className="block text-gray-300 mb-2">Contraseña</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded text-white min-h-[44px]"
          />
        </div>
      )}

      <div>
        <label className="block text-gray-300 mb-2">Rol</label>
        <select
          value={form.rol}
          onChange={(e) => setForm({ ...form, rol: e.target.value })}
          className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded text-white min-h-[44px]"
        >
          <option value="camarero">Camarero</option>
          <option value="cocinero">Cocinero</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-gray-300">
          <input
            type="checkbox"
            checked={form.activo}
            onChange={(e) => setForm({ ...form, activo: e.target.checked })}
          />
          Activo
        </label>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={handleGuardar}
          disabled={loading}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold disabled:opacity-50"
        >
          {loading ? '⏳...' : '✅ Guardar'}
        </button>
        <button
          onClick={onCancelar}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold"
        >
          ❌ Cancelar
        </button>
      </div>
    </div>
  );
}