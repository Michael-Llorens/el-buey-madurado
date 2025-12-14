'use client';

import { useState } from 'react';
import ProductoForm from './ProductoForm';
import ProductoList from './ProductoList';
import IngredienteForm from './IngredienteForm';
import IngredienteList from './IngredienteList';

type Modo = 
  | 'home' 
  | 'add-product' 
  | 'list-products' 
  | 'add-ingredient' 
  | 'list-ingredients';

export default function AdminPanel() {
  const [modo, setModo] = useState<Modo>('home');
  const [productos, setProductos] = useState<any[]>([]);
  const [ingredientes, setIngredientes] = useState<any[]>([]);

  const handleVolver = () => setModo('home');

  return (
    <div>
      {/* PANTALLA PRINCIPAL: 4 BOTONES */}
      {modo === 'home' && (
        <div>
          <h1 className="text-3xl font-bold mb-8 text-amber-400">
            🐂 Administración de Stock
          </h1>

          <div className="grid grid-cols-2 gap-6">
            {/* Botón 1: Agregar Producto */}
            <button
              onClick={() => setModo('add-product')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-12 rounded-lg shadow-lg transform hover:scale-105 transition"
            >
              <div className="text-5xl mb-2">➕</div>
              <div className="text-xl">Agregar Producto</div>
            </button>

            {/* Botón 2: Listar Productos */}
            <button
              onClick={() => setModo('list-products')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-12 rounded-lg shadow-lg transform hover:scale-105 transition"
            >
              <div className="text-5xl mb-2">📦</div>
              <div className="text-xl">Listar Productos</div>
            </button>

            {/* Botón 3: Agregar Ingrediente */}
            <button
              onClick={() => setModo('add-ingredient')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-12 rounded-lg shadow-lg transform hover:scale-105 transition"
            >
              <div className="text-5xl mb-2">➕</div>
              <div className="text-xl">Agregar Ingrediente</div>
            </button>

            {/* Botón 4: Listar Ingredientes */}
            <button
              onClick={() => setModo('list-ingredients')}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-12 rounded-lg shadow-lg transform hover:scale-105 transition"
            >
              <div className="text-5xl mb-2">🥘</div>
              <div className="text-xl">Listar Ingredientes</div>
            </button>
          </div>
        </div>
      )}

      {/* AGREGAR PRODUCTO */}
      {modo === 'add-product' && (
        <div>
          <button
            onClick={handleVolver}
            className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Volver
          </button>
          <ProductoForm 
            onGuardar={(producto) => {
              setProductos([...productos, producto]);
              setModo('home');
            }}
            onCancelar={handleVolver}
          />
        </div>
      )}

      {/* LISTAR PRODUCTOS */}
      {modo === 'list-products' && (
        <div>
          <button
            onClick={handleVolver}
            className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Volver
          </button>
          <ProductoList 
            productos={productos}
            onEliminar={(id) => {
              setProductos(productos.filter(p => p.id !== id));
            }}
          />
        </div>
      )}

      {/* AGREGAR INGREDIENTE */}
      {modo === 'add-ingredient' && (
        <div>
          <button
            onClick={handleVolver}
            className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Volver
          </button>
          <IngredienteForm 
            onGuardar={(ingrediente) => {
              setIngredientes([...ingredientes, ingrediente]);
              setModo('home');
            }}
            onCancelar={handleVolver}
          />
        </div>
      )}

      {/* LISTAR INGREDIENTES */}
      {modo === 'list-ingredients' && (
        <div>
          <button
            onClick={handleVolver}
            className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Volver
          </button>
          <IngredienteList/>
        </div>
      )}
    </div>
  );
}