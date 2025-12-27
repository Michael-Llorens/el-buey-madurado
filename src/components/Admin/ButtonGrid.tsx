'use client';

interface ButtonGridProps {
  setModo: (modo: 'add-product' | 'add-ingredient' | 'list-products' | 'list-ingredients') => void;
  onListarIngredientes?: () => void; // ← NUEVA: para navegar a página de ingredientes
}

export default function ButtonGrid({ setModo, onListarIngredientes }: ButtonGridProps) {
  const buttons = [
    {
      id: 'add-product',
      icon: '➕',
      title: 'Agregar Producto',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      action: () => setModo('add-product'),
    },
    {
      id: 'list-products',
      icon: '📦',
      title: 'Listar Productos',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      action: () => setModo('list-products'),
    },
    {
      id: 'add-ingredient',
      icon: '➕',
      title: 'Agregar Ingrediente',
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
      action: () => setModo('add-ingredient'),
    },
    {
      id: 'list-ingredients',
      icon: '🥘',
      title: 'Listar Ingredientes',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      action: () => {
        if (onListarIngredientes) {
          onListarIngredientes(); // ← Llama a la función de navegación
        } else {
          setModo('list-ingredients'); // ← Fallback si no existe
        }
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={button.action}
          className={`
            bg-gradient-to-r ${button.color} ${button.hoverColor}
            text-white font-bold py-12 rounded-lg shadow-lg 
            transform hover:scale-105 transition duration-300
            flex flex-col items-center justify-center gap-3
          `}
        >
          <div className="text-5xl">{button.icon}</div>
          <div className="text-lg text-center">{button.title}</div>
        </button>
      ))}
    </div>
  );
}
