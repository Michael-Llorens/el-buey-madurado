'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import PersonalizarProductoModal from './PersonalizarProductoModal';
import { usePedidoForm } from './hooks/usePedidoForm';

interface Mesa {
  _id: string;
  nombre: string;
  numero: number;
  capacidad: number;
  estado: string;
}

type TipoPedido = 'local' | 'recoger' | 'domicilio';

type PedidoInicial = {
  _id: string;
  tipo: TipoPedido;
  mesa?: { _id: string; numero: number };
  cliente?: string;
  telefono?: string;
  notas?: string;
  descuento?: number;
  gastoEnvio?: number;
  direccionEntrega?: {
    calle: string;
    numero: string;
    piso?: string;
    ciudad: string;
    codigoPostal: string;
    telefono: string;
    notas?: string;
  };
  productos: Array<{
    producto: { _id: string; nombre: string; precio: number; imagen?: string } | string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    notas?: string;
    personalizaciones?: {
      ingredientesExtra?: string[];
      ingredientesRemovidos?: string[];
    };
  }>;
};

interface PedidoFormProps {
  onGuardar: () => void | Promise<void>;
  onCancelar: () => void;
  modo?: 'add' | 'edit';
  pedidoId?: string;
  pedidoInicial?: PedidoInicial | null;
  mesaIdPreseleccionada?: string;
}

export default function PedidoForm({
  onGuardar,
  onCancelar,
  modo = 'add',
  pedidoId,
  pedidoInicial = null,
  mesaIdPreseleccionada,
}: PedidoFormProps) {
  const {
    formData,
    productosSeleccionados,
    mesasDisponibles,
    productosDisponibles,
    productosFiltrados,
    busquedaProducto,
    setBusquedaProducto,
    categorias,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    mostrarNotas,
    setMostrarNotas,
    mostrarDescuento,
    setMostrarDescuento,
    mostrarEnvio,
    setMostrarEnvio,
    modalAbierto,
    productoAPersonalizar,
    cantidadTemp,
    loading,
    error,
    totales,
    setProductoSeleccionado,
    setCantidadProducto,
    setNotasProducto,
    setModalAbierto,
    setProductoAPersonalizar,
    handleChange,
    handleDireccionChange,
    handleConfirmarPersonalizacion,
    handleRemoveProducto,
    handleAddProductoRapido,
    handleIncrementarCantidad,
    handleDecrementarCantidad,
    setTipo,
    necesitaPuntoCarne,
    getPuntoCarne,
    handleSetPuntoCarne,
    getNotaSinPunto,
    handleSetNotaRapida,
    PUNTOS_CARNE,
    handleSubmit,
    getNombreProducto,
    getPrecioProducto,
  } = usePedidoForm({
    modo,
    pedidoId,
    pedidoInicial,
    mesaIdPreseleccionada,
    onGuardar,
    onCancelar,
  });

  const tipoTabs: { key: TipoPedido; label: string; icon: string }[] = [
    { key: 'local', label: 'Local', icon: '🍽️' },
    { key: 'recoger', label: 'Recoger', icon: '🛍️' },
    { key: 'domicilio', label: 'Domicilio', icon: '🛵' },
  ];

  // Control de nota rápida inline abierta (-1 = ninguna)
  const [notaAbiertaIdx, setNotaAbiertaIdx] = useState(-1);

  // Abrir personalización para un producto concreto del carrito
  const abrirPersonalizacionProducto = (index: number) => {
    const item = productosSeleccionados[index];
    const prod = productosDisponibles.find((p: any) => p._id === item.producto);
    if (!prod) {
      toast.warning('Producto no encontrado');
      return;
    }
    setProductoSeleccionado(prod._id);
    setCantidadProducto(String(item.cantidad));
    setNotasProducto(item.notas || '');
    setProductoAPersonalizar(prod);
    setModalAbierto(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {error && (
        <div className="bg-red-600/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {/* ═══ TIPO DE PEDIDO ═══ */}
      <div className="mb-4">
        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2 block">Tipo de pedido</label>
        <div className="flex gap-1 bg-gray-900 rounded-xl p-1">
          {tipoTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setTipo(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition ${
                formData.tipo === tab.key
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ DATOS DEL PEDIDO ═══ */}
      <div className="mb-4 space-y-3">
        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">
          {formData.tipo === 'local' ? 'Mesa y cliente' : formData.tipo === 'recoger' ? 'Datos del cliente' : 'Cliente y dirección'}
        </label>

        {/* Mesa (solo local) */}
        {formData.tipo === 'local' && (
          <select
            name="mesa"
            value={formData.mesa}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-amber-500 focus:outline-none"
          >
            <option value="">Seleccionar mesa...</option>
            {mesasDisponibles.map((mesa: Mesa) => (
              <option key={mesa._id} value={mesa._id}>
                {mesa.nombre} · {mesa.capacidad} pers · {mesa.estado === 'libre' ? '🟢' : mesa.estado === 'ocupada' ? '🔴' : '🟡'}
              </option>
            ))}
          </select>
        )}

        {/* Cliente + Teléfono */}
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            required={formData.tipo !== 'local'}
            placeholder={`Nombre${formData.tipo !== 'local' ? ' *' : ' (opcional)'}`}
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none"
          />
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required={formData.tipo !== 'local'}
            placeholder={`Teléfono${formData.tipo !== 'local' ? ' *' : ' (opcional)'}`}
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Dirección (solo domicilio) */}
        {formData.tipo === 'domicilio' && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-amber-400 mb-1">📍 Dirección de entrega</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <input type="text" name="calle" value={formData.direccionEntrega.calle} onChange={handleDireccionChange} required placeholder="Calle *" className="col-span-2 sm:col-span-3 px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none" />
              <input type="text" name="numero" value={formData.direccionEntrega.numero} onChange={handleDireccionChange} required placeholder="Nº *" className="px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input type="text" name="piso" value={formData.direccionEntrega.piso} onChange={handleDireccionChange} placeholder="Piso" className="px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none" />
              <input type="text" name="ciudad" value={formData.direccionEntrega.ciudad} onChange={handleDireccionChange} required placeholder="Ciudad *" className="px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none" />
              <input type="text" name="codigoPostal" value={formData.direccionEntrega.codigoPostal} onChange={handleDireccionChange} required placeholder="CP *" maxLength={5} className="px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none" />
            </div>
            <input type="tel" name="telefono" value={formData.direccionEntrega.telefono} onChange={handleDireccionChange} required placeholder="Teléfono de contacto *" className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:outline-none" />
          </div>
        )}
      </div>

      {/* ═══ CATÁLOGO DE PRODUCTOS (2 pasos) ═══ */}
      <div className="mb-4">
        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2 block">Añadir productos</label>

        {/* Búsqueda — siempre visible, al escribir muestra todos los productos */}
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            value={busquedaProducto}
            onChange={(e) => {
              setBusquedaProducto(e.target.value);
              // Si el usuario busca, saltar a vista de todos los productos
              if (e.target.value.trim()) setCategoriaSeleccionada('_busqueda');
              else setCategoriaSeleccionada('todas');
            }}
            placeholder="Buscar producto..."
            className="w-full pl-9 pr-9 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
          />
          {busquedaProducto && (
            <button type="button" onClick={() => { setBusquedaProducto(''); setCategoriaSeleccionada('todas'); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">✕</button>
          )}
        </div>

        {/* PASO 1: Grid de categorías (solo si no hay búsqueda y estamos en "todas") */}
        {categoriaSeleccionada === 'todas' && !busquedaProducto && categorias.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categorias.map((cat) => {
              const numProductos = productosDisponibles.filter((p: any) => p.categoria === cat).length;
              const productosEnCarrito = productosSeleccionados.filter((p) => {
                const prod = productosDisponibles.find((pd: any) => pd._id === p.producto);
                return prod && (prod as any).categoria === cat;
              }).reduce((s, p) => s + p.cantidad, 0);

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoriaSeleccionada(cat)}
                  className="relative flex flex-col items-center justify-center p-4 sm:p-5 bg-gray-800 border border-gray-700 rounded-xl hover:border-amber-500/50 hover:bg-gray-750 transition active:scale-95 text-center"
                >
                  {productosEnCarrito > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {productosEnCarrito}
                    </span>
                  )}
                  <span className="text-white text-sm sm:text-base font-semibold capitalize">{cat}</span>
                  <span className="text-gray-500 text-xs mt-1">{numProductos} producto{numProductos !== 1 ? 's' : ''}</span>
                </button>
              );
            })}
          </div>
        ) : (
          /* PASO 2: Productos de la categoría seleccionada (o resultados de búsqueda) */
          <div>
            {/* Cabecera con botón volver */}
            {categoriaSeleccionada !== '_busqueda' && (
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => { setCategoriaSeleccionada('todas'); setBusquedaProducto(''); }}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition"
                >
                  ← Categorías
                </button>
                <span className="text-white text-sm font-semibold capitalize">{categoriaSeleccionada}</span>
                <span className="text-gray-500 text-xs">({productosFiltrados.length})</span>
              </div>
            )}

            {/* Grid de productos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[35vh] sm:max-h-[260px] overflow-y-auto pr-1">
              {productosFiltrados.length === 0 ? (
                <p className="col-span-full text-center text-gray-500 text-sm py-6">
                  {busquedaProducto ? `Sin resultados para "${busquedaProducto}"` : 'No hay productos en esta categoría'}
                </p>
              ) : (
                productosFiltrados.map((prod) => {
                  const enCarrito = productosSeleccionados.find((p) => p.producto === prod._id);
                  return (
                    <button
                      key={prod._id}
                      type="button"
                      onClick={() => handleAddProductoRapido(prod._id)}
                      className={`relative flex flex-col items-start p-3 rounded-lg text-left transition active:scale-95 ${
                        enCarrito
                          ? 'bg-amber-600/20 border-2 border-amber-500'
                          : 'bg-gray-800 border border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      {enCarrito && (
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                          {enCarrito.cantidad}
                        </span>
                      )}
                      <span className="text-white text-sm font-medium leading-tight line-clamp-2">{prod.nombre}</span>
                      <span className="text-amber-400 text-sm font-bold mt-1.5">{prod.precio.toFixed(2)}€</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* ═══ CARRITO ═══ */}
      {productosSeleccionados.length > 0 && (
        <div className="mb-4">
          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2 block">
            Pedido ({productosSeleccionados.reduce((s, p) => s + p.cantidad, 0)} uds)
          </label>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg divide-y divide-gray-700/30 max-h-[300px] overflow-y-auto">
            {productosSeleccionados.map((item, idx) => {
              const precioFinal =
                typeof item.precioPersonalizado === 'number'
                  ? item.precioPersonalizado
                  : getPrecioProducto(item.producto) * item.cantidad;
              const tienePersonalizacion = !!(item.personalizaciones?.ingredientesExtra?.length || item.personalizaciones?.ingredientesRemovidos?.length);
              const esCarne = necesitaPuntoCarne(item.producto);
              const puntoActual = getPuntoCarne(item.notas);
              const notaSinPunto = getNotaSinPunto(item.notas);

              return (
                <div key={idx} className="px-3 py-2.5">
                  {/* Fila principal: +/- | Nombre + detalles | Precio | Acciones */}
                  <div className="flex items-center gap-2">
                    {/* +/- */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => handleDecrementarCantidad(idx)} className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-red-600/80 text-white rounded-lg text-base font-bold transition active:scale-90" style={{ minWidth: '40px', minHeight: '40px' }}>−</button>
                      <span className="w-7 text-center text-white text-sm font-bold">{item.cantidad}</span>
                      <button type="button" onClick={() => handleIncrementarCantidad(idx)} className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-green-600/80 text-white rounded-lg text-base font-bold transition active:scale-90" style={{ minWidth: '40px', minHeight: '40px' }}>+</button>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-sm font-medium truncate">{getNombreProducto(item.producto)}</span>
                        {puntoActual && (
                          <span className="text-[10px] bg-orange-600/20 text-orange-300 px-1.5 py-0.5 rounded font-medium shrink-0">🥩 {puntoActual}</span>
                        )}
                      </div>
                      {item.personalizaciones?.ingredientesExtra?.length ? (
                        <p className="text-[10px] text-emerald-400 truncate">+ {item.personalizaciones.ingredientesExtra.join(', ')}</p>
                      ) : null}
                      {item.personalizaciones?.ingredientesRemovidos?.length ? (
                        <p className="text-[10px] text-red-400 truncate">- {item.personalizaciones.ingredientesRemovidos.join(', ')}</p>
                      ) : null}
                      {notaSinPunto ? <p className="text-[10px] text-gray-500 truncate">📝 {notaSinPunto}</p> : null}
                    </div>

                    {/* Precio */}
                    <span className="text-amber-400 text-sm font-semibold shrink-0">{precioFinal.toFixed(2)}€</span>

                    {/* Acciones: nota, personalizar, quitar */}
                    <button
                      type="button"
                      onClick={() => setNotaAbiertaIdx(notaAbiertaIdx === idx ? -1 : idx)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-base transition shrink-0 ${
                        notaSinPunto
                          ? 'bg-gray-600/40 text-yellow-400 hover:bg-gray-600/60'
                          : 'bg-gray-700/40 text-gray-500 hover:text-gray-300 hover:bg-gray-700'
                      }`}
                      title="Nota rápida"
                    >
                      📝
                    </button>
                    <button
                      type="button"
                      onClick={() => abrirPersonalizacionProducto(idx)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-base transition shrink-0 ${
                        tienePersonalizacion
                          ? 'bg-amber-600/30 text-amber-400 hover:bg-amber-600/50'
                          : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                      }`}
                      title="Personalizar (extras, quitar)"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveProducto(idx)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-base bg-red-600/15 text-red-400 hover:bg-red-600/30 transition shrink-0"
                      title="Quitar"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Punto de carne — solo si aplica */}
                  {esCarne && (
                    <div className="flex items-center gap-1.5 mt-2 ml-[76px]">
                      <span className="text-[10px] text-gray-500 mr-1">🥩 Punto:</span>
                      {PUNTOS_CARNE.map((punto) => (
                        <button
                          key={punto}
                          type="button"
                          onClick={() => handleSetPuntoCarne(idx, puntoActual === punto ? null : punto)}
                          className={`px-2 py-1 rounded-md text-[10px] font-medium transition ${
                            puntoActual === punto
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600'
                          }`}
                        >
                          {punto}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Nota rápida inline — se abre al pulsar 📝 */}
                  {notaAbiertaIdx === idx && (
                    <div className="flex items-center gap-2 mt-2 ml-[76px]">
                      <input
                        type="text"
                        value={notaSinPunto}
                        onChange={(e) => handleSetNotaRapida(idx, e.target.value)}
                        placeholder="Sin sal, sin cebolla, al punto..."
                        className="flex-1 px-2.5 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setNotaAbiertaIdx(-1)}
                        className="text-xs text-gray-500 hover:text-white transition"
                      >
                        OK
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ FOOTER: Total + Extras + Acción ═══ */}
      <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 -mx-4 sm:-mx-8 px-4 sm:px-8 py-4 mt-auto">
        {productosSeleccionados.length > 0 && (
          <>
            {/* Opciones inline: nota, descuento, envío */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
              {/* Nota */}
              {!mostrarNotas ? (
                <button type="button" onClick={() => setMostrarNotas(true)} className="text-xs text-gray-500 hover:text-amber-400 transition">
                  + Añadir nota
                </button>
              ) : (
                <div className="w-full mb-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="notas"
                      value={formData.notas}
                      onChange={handleChange}
                      placeholder="Nota del pedido..."
                      className="flex-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                    />
                    <button type="button" onClick={() => { setMostrarNotas(false); handleChange({ target: { name: 'notas', value: '' } } as any); }} className="text-gray-600 hover:text-red-400 text-xs">✕</button>
                  </div>
                </div>
              )}

              {/* Descuento */}
              {!mostrarDescuento ? (
                <button type="button" onClick={() => setMostrarDescuento(true)} className="text-xs text-gray-500 hover:text-amber-400 transition">
                  + Descuento
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">Dto:</span>
                  <input
                    type="number"
                    name="descuento"
                    value={formData.descuento}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-xs text-gray-500">€</span>
                  <button type="button" onClick={() => { setMostrarDescuento(false); handleChange({ target: { name: 'descuento', value: '0' } } as any); }} className="text-gray-600 hover:text-red-400 text-xs">✕</button>
                </div>
              )}

              {/* Gasto envío (solo domicilio) */}
              {formData.tipo === 'domicilio' && (
                <>
                  {!mostrarEnvio ? (
                    <button type="button" onClick={() => setMostrarEnvio(true)} className="text-xs text-gray-500 hover:text-amber-400 transition">
                      + Gasto envío
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500">Envío:</span>
                      <input
                        type="number"
                        name="gastoEnvio"
                        value={formData.gastoEnvio}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:border-amber-500 focus:outline-none"
                      />
                      <span className="text-xs text-gray-500">€</span>
                      <button type="button" onClick={() => { setMostrarEnvio(false); handleChange({ target: { name: 'gastoEnvio', value: '0' } } as any); }} className="text-gray-600 hover:text-red-400 text-xs">✕</button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Desglose */}
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500 mb-2">
              <span>Subtotal: {totales.subtotal}€</span>
              <span>IVA: {totales.impuestos}€</span>
              {formData.tipo === 'domicilio' && parseFloat(totales.gastoEnvio) > 0 && (
                <span className="text-blue-400">Envío: {totales.gastoEnvio}€</span>
              )}
              {formData.descuento > 0 && (
                <span className="text-red-400">Dto: -{Number(formData.descuento).toFixed(2)}€</span>
              )}
            </div>
          </>
        )}

        {/* Total + Botones */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-2xl font-bold text-white">
              {productosSeleccionados.length > 0 ? (
                <><span className="text-gray-400 text-sm font-normal">TOTAL </span><span className="text-amber-400">{totales.total}€</span></>
              ) : (
                <span className="text-gray-600 text-base">Añade productos al pedido</span>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancelar}
            className="px-4 sm:px-5 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition text-sm"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading || productosSeleccionados.length === 0}
            className="px-5 sm:px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl font-bold transition text-sm whitespace-nowrap"
          >
            {loading
              ? (modo === 'edit' ? 'Guardando...' : 'Creando...')
              : modo === 'edit'
                ? 'Guardar cambios'
                : 'Crear Pedido'
            }
          </button>
        </div>
      </div>

      {/* ═══ MODAL PERSONALIZACIÓN ═══ */}
      {modalAbierto && productoAPersonalizar && (
        <PersonalizarProductoModal
          producto={productoAPersonalizar}
          cantidad={cantidadTemp}
          onConfirmar={handleConfirmarPersonalizacion}
          onCancelar={() => {
            setModalAbierto(false);
            setProductoAPersonalizar(null);
          }}
        />
      )}
    </form>
  );
}
