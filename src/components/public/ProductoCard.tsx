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
  ingredientes?: Array<{ ingrediente?: { _id: string; nombre: string }; cantidad: number; unidad: string }>;
  ingredientesExtra?: Array<{ nombre: string; precio: number }>;
}

interface ProductoCardProps {
  producto: ProductoPublico;
  onAnadir: (producto: ProductoPublico) => void;
  enCarrito?: number;
}

export type { ProductoPublico };

export default function ProductoCard({ producto, onAnadir, enCarrito }: ProductoCardProps) {
  return (
    <div className={`relative bg-gray-800/60 border rounded-xl p-4 transition hover:border-amber-500/50 ${
      !producto.disponible ? 'opacity-50 pointer-events-none' : 'border-gray-700/50'
    }`}>
      {enCarrito && enCarrito > 0 ? (
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg z-10">
          {enCarrito}
        </span>
      ) : null}

      {!producto.disponible && (
        <span className="absolute top-2 right-2 text-[10px] bg-red-600/80 text-white px-2 py-0.5 rounded-full font-semibold">
          Agotado
        </span>
      )}

      <div className="mb-2">
        <h3 className="text-sm sm:text-base font-bold text-white leading-tight">{producto.nombre}</h3>
        {producto.descripcion && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{producto.descripcion}</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-amber-400 font-bold text-lg">{producto.precio.toFixed(2)}€</span>
        <button
          onClick={() => onAnadir(producto)}
          disabled={!producto.disponible}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-700 text-white text-sm font-semibold rounded-lg transition active:scale-95"
        >
          Añadir
        </button>
      </div>
    </div>
  );
}
