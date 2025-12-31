// src/components/Producto/ProductoList.tsx
'use client';

import { MenuItem } from '@/lib/menu';

interface ProductoListProps {
  productos: MenuItem[];
  categoria: string;
}

export default function ProductoList({ productos, categoria }: ProductoListProps) {
  const getCategoriaColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'carnes':
        return 'from-red-900/40 to-red-800/40 border-red-700 hover:from-red-900/60 hover:to-red-800/60';
      case 'sándwich y hamburguesas':
        return 'from-yellow-900/40 to-yellow-800/40 border-yellow-700 hover:from-yellow-900/60 hover:to-yellow-800/60';
      case 'entrantes':
        return 'from-green-900/40 to-green-800/40 border-green-700 hover:from-green-900/60 hover:to-green-800/60';
      case 'postres':
        return 'from-pink-900/40 to-pink-800/40 border-pink-700 hover:from-pink-900/60 hover:to-pink-800/60';
      default:
        return 'from-gray-900/40 to-gray-800/40 border-gray-700 hover:from-gray-900/60 hover:to-gray-800/60';
    }
  };

  if (productos.length === 0) {
    return (
      <p className="text-center text-gray-400 mt-10">
        No hay productos disponibles en esta categoría.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {productos.map((producto) => (
        <div
          key={producto.id}
          className={`bg-gradient-to-br ${getCategoriaColor(
            categoria
          )} border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group`}
        >
          {/* Título */}
          <h2 className="text-xl font-bold text-amber-300 mb-3 group-hover:text-amber-200 transition">
            {producto.nombre}
          </h2>

          {/* Descripción */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">
            {producto.descripcion}
          </p>

          {/* Detalles */}
          <div className="flex flex-col gap-2 mb-4">
            {producto.detalle && (
              <span className="text-xs text-amber-400 font-semibold">
                📏 {producto.detalle}
              </span>
            )}
            {producto.unidad && (
              <span className="text-xs text-green-400 font-semibold">
                💰 Precio por unidad
              </span>
            )}
          </div>

          {/* Precio y botón */}
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-amber-500/30">
            <span className="text-2xl font-bold text-amber-500">
              {producto.precio.toFixed(2)} €
            </span>
            <button className="bg-amber-500 hover:bg-amber-600 text-[#1a1410] font-bold px-4 py-2 rounded-full transition-all transform hover:scale-105">
              Añadir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}