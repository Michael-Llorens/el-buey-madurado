'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ButtonGrid from '@/components/Admin/ButtonGrid';
import ProductoForm from '@/components/Admin/ProductoForm';
import IngredienteForm from '@/components/Admin/IngredienteForm';
import ProductCardGrid from '@/components/Admin/ProductCardGrid';
import IngredientCardGrid from '@/components/Admin/IngredientCardGrid';

type Modo =
  | 'home'
  | 'add-product'
  | 'add-ingredient'
  | 'list-products'
  | 'list-ingredients';

export default function StockPanel() {
  const router = useRouter(); // ← NUEVO
  const [modo, setModo] = useState<Modo>('home');
  const [productos, setProductos] = useState<any[]>([]);
  const [ingredientes, setIngredientes] = useState<any[]>([]);
  const [productoEditar, setProductoEditar] = useState<any>(null);
  const [ingredienteEditar, setIngredienteEditar] = useState<any>(null);

  const handleGuardarProducto = (producto: any) => {
    if (productoEditar) {
      setProductos(productos.map(p => p.id === producto.id ? producto : p));
      setProductoEditar(null);
    } else {
      setProductos([...productos, { ...producto, id: Date.now().toString() }]);
    }
    setModo('list-products');
  };

  const handleGuardarIngrediente = (ingrediente: any) => {
    if (ingredienteEditar) {
      setIngredientes(ingredientes.map(i => i.id === ingrediente.id ? ingrediente : i));
      setIngredienteEditar(null);
    } else {
      setIngredientes([...ingredientes, { ...ingrediente, id: Date.now().toString() }]);
    }

    router.push('/admin/productos');

    // router.refresh();
  };

  const handleEditarProducto = (producto: any) => {
    setProductoEditar(producto);
    setModo('add-product');
  };

  const handleEditarIngrediente = (ingrediente: any) => {
    setIngredienteEditar(ingrediente);
    setModo('add-ingredient');
  };

  const handleEliminarProducto = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProductos(productos.filter(p => p.id !== id));
    }
  };

  const handleEliminarIngrediente = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este ingrediente?')) {
      setIngredientes(ingredientes.filter(i => i.id !== id));
    }
  };

  const handleCancelar = () => {
    setProductoEditar(null);
    setIngredienteEditar(null);
    setModo('home');
  };

  return (
    <div className="space-y-8">
      {modo === 'home' && (
        <ButtonGrid setModo={setModo} />
      )}

      {(modo === 'add-product' || modo === 'add-ingredient') && (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          {modo === 'add-product' && (
            <ProductoForm
              producto={productoEditar}
              onGuardar={handleGuardarProducto}
              onCancelar={handleCancelar}
            />
          )}
          {modo === 'add-ingredient' && (
            <IngredienteForm
              ingrediente={ingredienteEditar}
              onGuardar={handleGuardarIngrediente}
              onCancelar={handleCancelar}
            />
          )}
        </div>
      )}

      {modo === 'list-products' && (
        <div>
          <h2 className="text-2xl font-bold text-amber-400 mb-6">📦 Productos</h2>
          <ProductCardGrid
            productos={productos}
            onEditar={handleEditarProducto}
            onEliminar={handleEliminarProducto}
          />
          <button
            onClick={() => setModo('home')}
            className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Volver
          </button>
        </div>
      )}

      {modo === 'list-ingredients' && (
        <div>
          <h2 className="text-2xl font-bold text-amber-400 mb-6">🥘 Ingredientes</h2>
          <IngredientCardGrid
            onEditar={handleEditarIngrediente}
            onEliminar={handleEliminarIngrediente}
          />
          <button
            onClick={() => setModo('home')}
            className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Volver
          </button>
        </div>
      )}
    </div>
  );
}