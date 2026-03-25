'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { usePedidos, authFetcher } from '@/lib/hooks/swr';
import { useConfirm } from './useConfirm';

type Modo = 'view' | 'add' | 'edit' | 'detail';

export function usePedidoPanel() {
    const searchParams = useSearchParams();
    const { confirmar, confirmProps } = useConfirm();

    const [modo, setModo] = useState<Modo>('view');
    const [pedidoEditando, setPedidoEditando] = useState<any | null>(null);

    const [pedidoDetalle, setPedidoDetalle] = useState<any | null>(null);
    const [loadingDetalle, setLoadingDetalle] = useState(false);

    const { pedidos, error: swrError, isLoading: loading, mutate } = usePedidos();
    const [mutationError, setMutationError] = useState<string | null>(null);
    const error = swrError?.message ?? mutationError;

    // Sonido al recibir pedidos nuevos
    const prevCountRef = useRef<number>(0);
    useEffect(() => {
        if (pedidos.length > prevCountRef.current && prevCountRef.current > 0) {
            try {
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 880;
                osc.type = 'sine';
                gain.gain.value = 0.3;
                osc.start();
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                osc.stop(ctx.currentTime + 0.3);
                setTimeout(() => ctx.close(), 500);
            } catch { /* audio no disponible */ }
            toast.info('Nuevo pedido recibido');
        }
        prevCountRef.current = pedidos.length;
    }, [pedidos.length]);

    const [filtroEstado, setFiltroEstado] = useState<string[]>([]);
    const [filtroTipo, setFiltroTipo] = useState<string[]>([]);
    const [busqueda, setBusqueda] = useState<string>('');
    const [filtroTiempo, setFiltroTiempo] = useState<string>('todos');
    const [ordenar, setOrdenar] = useState<'recientes' | 'urgencia'>('recientes');

    const cargarPedidoPorId = async (id: string) => {
        return authFetcher(`/api/pedidos/${id}`);
    };

    useEffect(() => {
        const modulo = searchParams.get('modulo');
        const modoFromUrl = searchParams.get('modo');
        const pedidoIdFromUrl = searchParams.get('pedidoId');

        // Si NO viene con modulo=pedidos, no hacer nada
        if (modulo !== 'pedidos') return;

        let cancelled = false;

        // CASO 1: Editar pedido existente (?modulo=pedidos&modo=edit&pedidoId=...)
        if (modoFromUrl === 'edit' && pedidoIdFromUrl) {
            (async () => {
                try {
                    setMutationError(null);
                    setLoadingDetalle(true);

                    const detalle = await cargarPedidoPorId(pedidoIdFromUrl);
                    if (cancelled) return;

                    setPedidoEditando(detalle);
                    setPedidoDetalle(null);
                    setModo('edit');

                    // Limpia la URL
                    window.history.replaceState(null, '', '/dashboard');
                } catch (e: any) {
                    if (cancelled) return;
                    setMutationError(e.message);
                    setModo('view');
                } finally {
                    if (cancelled) return;
                    setLoadingDetalle(false);
                }
            })();

            return () => {
                cancelled = true;
            };
        }

        // CASO 2: Crear nuevo pedido (?modulo=pedidos&modo=add)
        if (modoFromUrl === 'add') {
            setMutationError(null);
            setPedidoEditando(null);
            setPedidoDetalle(null);
            setModo('add');

            // Limpia la URL (PedidoForm ya leyó mesaId si existía)
            window.history.replaceState(null, '', '/dashboard');
        }

        // devolver undefined explícitamente para evitar warning
        return undefined;
    }, [searchParams]);


    useEffect(() => {
        const modulo = searchParams.get('modulo');
        const modoFromUrl = searchParams.get('modo');

        if (modulo === 'pedidos' && modoFromUrl === 'add') {
            setMutationError(null);
            setPedidoEditando(null);
            setPedidoDetalle(null);
            setModo('add');

            window.history.replaceState(null, '', '/dashboard');
        }
    }, [searchParams]);


    const pedidosFiltrados = useMemo(() => {
        let resultado = pedidos;

        // Filtro por estado (multi-selección)
        if (filtroEstado.length > 0) resultado = resultado.filter((p) => filtroEstado.includes(p.estado));

        // Filtro por tipo (multi-selección)
        if (filtroTipo.length > 0) resultado = resultado.filter((p) => filtroTipo.includes(p.tipo));

        // Filtro por tiempo
        if (filtroTiempo !== 'todos') {
            const ahora = Date.now();
            const limites: Record<string, number> = {
                '30min': 30 * 60_000,
                '1h': 60 * 60_000,
                '3h': 3 * 60 * 60_000,
                'hoy': 0, // caso especial
            };
            if (filtroTiempo === 'hoy') {
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                resultado = resultado.filter((p) => new Date(p.createdAt).getTime() >= hoy.getTime());
            } else if (limites[filtroTiempo]) {
                resultado = resultado.filter((p) => ahora - new Date(p.createdAt).getTime() <= limites[filtroTiempo]);
            }
        }

        // Búsqueda libre (mesa, cliente, teléfono, camarero, producto)
        if (busqueda.trim()) {
            const q = busqueda.toLowerCase().trim();
            resultado = resultado.filter((p) => {
                // Mesa
                const mesa = (p.mesa as any)?.nombre ?? (p.mesa as any)?.numero ?? '';
                if (String(mesa).toLowerCase().includes(q)) return true;
                // Cliente
                if (p.cliente?.toLowerCase().includes(q)) return true;
                // Teléfono
                if (p.telefono?.includes(q)) return true;
                // Camarero
                const camarero = p.creadoPor?.nombre ?? p.creadoPor?.email ?? '';
                if (camarero.toLowerCase().includes(q)) return true;
                // Productos
                if (p.productos?.some((item: any) => item.producto?.nombre?.toLowerCase().includes(q))) return true;
                // Dirección
                if (p.direccionEntrega?.calle?.toLowerCase().includes(q)) return true;
                return false;
            });
        }

        // Ordenar
        if (ordenar === 'urgencia') {
            const PRIORIDAD_ESTADO: Record<string, number> = {
                pendiente: 0, preparando: 1, listo: 2, en_camino: 3,
                servido: 4, entregado: 5, pagado: 6, cancelado: 7,
            };
            resultado.sort((a, b) => {
                const pa = PRIORIDAD_ESTADO[a.estado] ?? 99;
                const pb = PRIORIDAD_ESTADO[b.estado] ?? 99;
                if (pa !== pb) return pa - pb;
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
        } else {
            // Recientes primero (orden natural)
            resultado.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return resultado;
    }, [filtroEstado, filtroTipo, filtroTiempo, busqueda, ordenar, pedidos]);

    const handleCambiarEstado = async (id: string, nuevoEstado: string) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error('No hay sesión iniciada');
                return;
            }

            const res = await fetch(`/api/pedidos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ estado: nuevoEstado }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                await mutate();
                if (modo === 'detail' && pedidoDetalle?._id === id) setPedidoDetalle(data.data);
                if (nuevoEstado === 'pagado') toast.success('Pedido pagado y mesa liberada');
            } else {
                throw new Error(data.error || 'Error al cambiar estado');
            }
        } catch (e: any) {
            console.error('Error al cambiar estado:', e);
            toast.error(`Error: ${e.message}`);
        }
    };

    const handleEliminar = async (id: string) => {
        const ok = await confirmar('¿Seguro que quieres cancelar este pedido?', { titulo: 'Cancelar pedido', textoConfirmar: 'Cancelar pedido' });
        if (!ok) return;

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error('No hay sesión iniciada');
                return;
            }

            const res = await fetch(`/api/pedidos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok && data.success) {
                await mutate();
                if (modo === 'detail' && pedidoDetalle?._id === id) {
                    setPedidoDetalle(null);
                    setModo('view');
                }
                toast.success('Pedido cancelado exitosamente');
            } else {
                throw new Error(data.error || 'Error al cancelar');
            }
        } catch (e: any) {
            console.error('Error al cancelar:', e);
            toast.error(`Error: ${e.message}`);
        }
    };

    const handleGuardar = async () => {
        await mutate();
        setPedidoEditando(null);
        setModo('view');
    };

    const handleCancelar = () => {
        setPedidoEditando(null);
        setPedidoDetalle(null);
        setModo('view');
    };

    const handleEditar = (pedido: any) => {
        setPedidoEditando(pedido);
        setModo('edit');
    };

    const handleVerDetalle = async (pedido: any) => {
        try {
            setMutationError(null);
            setLoadingDetalle(true);
            setModo('detail');
            setPedidoDetalle(null);

            const detalle = await cargarPedidoPorId(pedido._id);
            setPedidoDetalle(detalle);
        } catch (e: any) {
            console.error('Error cargando detalle:', e);
            setPedidoDetalle(pedido); // fallback
            setMutationError(e.message);
        } finally {
            setLoadingDetalle(false);
        }
    };

    const cerrarDetalle = () => {
        setPedidoDetalle(null);
        setModo('view');
    };

    // Helpers para toggle multi-selección
    const toggleFiltroEstado = (valor: string) => {
        setFiltroEstado((prev) =>
            prev.includes(valor) ? prev.filter((v) => v !== valor) : [...prev, valor]
        );
    };

    const toggleFiltroTipo = (valor: string) => {
        setFiltroTipo((prev) =>
            prev.includes(valor) ? prev.filter((v) => v !== valor) : [...prev, valor]
        );
    };

    const stats = {
        total: pedidos.length,
        pendientes: pedidos.filter((p) => p.estado === 'pendiente').length,
        preparando: pedidos.filter((p) => p.estado === 'preparando').length,
        listos: pedidos.filter((p) => p.estado === 'listo').length,
        servidos: pedidos.filter((p) => p.estado === 'servido').length,
        pagados: pedidos.filter((p) => p.estado === 'pagado').length,
        totalRecaudado: pedidos.filter((p) => p.estado === 'pagado').reduce((sum, p) => sum + p.total, 0),
    };

    return {
        searchParams,
        modo,
        setModo,
        pedidoEditando,
        pedidoDetalle,
        loadingDetalle,
        pedidos,
        pedidosFiltrados,
        filtroEstado,
        setFiltroEstado,
        toggleFiltroEstado,
        filtroTipo,
        setFiltroTipo,
        toggleFiltroTipo,
        busqueda,
        setBusqueda,
        filtroTiempo,
        setFiltroTiempo,
        ordenar,
        setOrdenar,
        loading,
        error,
        stats,
        handleCambiarEstado,
        handleEliminar,
        handleGuardar,
        handleCancelar,
        handleEditar,
        handleVerDetalle,
        cerrarDetalle,
        confirmProps,
        mutate,
    };
}
