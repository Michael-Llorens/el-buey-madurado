'use client';

interface ProductoPublico {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen?: string;
  disponible: boolean;
  permitirExtras: boolean;
  permitirRemover: boolean;
  ingredientes?: Array<{ ingrediente?: { _id: string; nombre: string; precioExtra?: number; alergenos?: string[] }; cantidad: number; unidad: string }>;
  ingredientesExtra?: Array<{ nombre: string; precio: number }>;
}

interface ProductoCardProps {
  producto: ProductoPublico;
  onAnadir: (producto: ProductoPublico) => void;
  onIncrementar?: (productoId: string) => void;
  onDecrementar?: (productoId: string) => void;
  enCarrito?: number;
}

export type { ProductoPublico };

export default function ProductoCard({ producto, onAnadir, onIncrementar, onDecrementar, enCarrito }: ProductoCardProps) {
  const tienePersonalizacion = producto.permitirExtras || producto.permitirRemover;

  const CATEGORIA_ICON: Record<string, string> = {
    Entrantes: '🍽️',
    Hamburguesas: '🍔',
    Carnes: '🥩',
    Postres: '🍰',
    Bebidas: '🥤',
  };

  return (
    <div className={`group relative bg-gray-800/90 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-200 ${
      !producto.disponible
        ? 'opacity-40 pointer-events-none border-gray-700/30'
        : enCarrito && enCarrito > 0
          ? 'border-amber-500 shadow-amber-500/10 shadow-lg'
          : 'border-gray-600/50 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5'
    }`}>
      {!producto.disponible && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-2xl">
          <span className="text-sm font-semibold text-gray-300 bg-gray-800/90 px-4 py-1.5 rounded-full">Agotado</span>
        </div>
      )}

      {/* Category badge */}
      <div className="absolute top-2.5 right-2.5 z-[5]">
        <span className="text-[10px] font-semibold text-gray-400 bg-gray-900/80 px-2 py-0.5 rounded-full">
          {CATEGORIA_ICON[producto.categoria] || '📦'} {producto.categoria}
        </span>
      </div>

      <div className="p-4">
        {/* Nombre + descripción */}
        <div className="mb-3 pr-20">
          <h3 className="text-base font-bold text-white leading-tight group-hover:text-amber-300 transition-colors">
            {producto.nombre}
          </h3>
          {producto.descripcion && (
            <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{producto.descripcion}</p>
          )}
        </div>

        {/* Precio + acciones */}
        <div className="flex items-center justify-between">
          <span className="text-amber-400 font-bold text-lg">{producto.precio.toFixed(2)}€</span>

          {enCarrito && enCarrito > 0 ? (
            // Producto ya en carrito: mostrar +/-
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDecrementar?.(producto._id)}
                className="w-8 h-8 bg-gray-700 hover:bg-red-600/80 text-white rounded-full font-bold text-sm transition flex items-center justify-center active:scale-90"
              >
                −
              </button>
              <span className="text-white font-bold text-sm w-5 text-center">{enCarrito}</span>
              <button
                onClick={() => {
                  if (tienePersonalizacion) {
                    onAnadir(producto);
                  } else {
                    onIncrementar?.(producto._id);
                  }
                }}
                className="w-8 h-8 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-bold text-sm transition flex items-center justify-center active:scale-90"
              >
                +
              </button>
            </div>
          ) : (
            // No está en carrito: botón añadir
            <button
              onClick={() => onAnadir(producto)}
              disabled={!producto.disponible}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 text-white text-sm font-bold rounded-full transition active:scale-95 flex items-center gap-1.5 shadow-lg shadow-amber-600/20"
            >
              <span className="text-base leading-none">+</span>
              Añadir
            </button>
          )}
        </div>

        {/* Badge personalizable */}
        {tienePersonalizacion && producto.disponible && (
          <p className="text-xs text-amber-500/70 mt-2.5 flex items-center gap-1 font-medium">
            <span>✨</span> Personalizable
          </p>
        )}
      </div>
    </div>
  );
}
