'use client';

import { useState, useEffect, useMemo } from 'react';
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

    const [filtroEstado, setFiltroEstado] = useState<string>('todos');
    const [filtroTipo, setFiltroTipo] = useState<string>('todos');

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
        if (filtroEstado !== 'todos') resultado = resultado.filter((p) => p.estado === filtroEstado);
        if (filtroTipo !== 'todos') resultado = resultado.filter((p) => p.tipo === filtroTipo);
        return resultado;
    }, [filtroEstado, filtroTipo, pedidos]);

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
        filtroTipo,
        setFiltroTipo,
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
    };
}
