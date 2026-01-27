'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type RowSelectionState,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { InferenceItem } from '@/app/api/representantes/inferences/route';

interface InferenceStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  high_confidence: number;
}

interface InferencesResponse {
  inferences: InferenceItem[];
  stats: InferenceStats;
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
}

const CONFIDENCE_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  high: { label: '>=95%', variant: 'default' },
  medium: { label: '80-94%', variant: 'secondary' },
  low: { label: '<80%', variant: 'outline' },
};

function getConfidenceLevel(confidence: number): 'high' | 'medium' | 'low' {
  if (confidence >= 0.95) return 'high';
  if (confidence >= 0.8) return 'medium';
  return 'low';
}

function getStatusBadge(approved: boolean | null) {
  if (approved === null) {
    return <Badge variant="outline">Pendiente</Badge>;
  }
  if (approved) {
    return <Badge variant="default">Aprobado</Badge>;
  }
  return <Badge variant="destructive">Rechazado</Badge>;
}

export function InferencesTable() {
  const [data, setData] = useState<InferenceItem[]>([]);
  const [stats, setStats] = useState<InferenceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [minConfidence, setMinConfidence] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (minConfidence) params.set('min_confidence', minConfidence);
    if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
    params.set('pagina', page.toString());
    params.set('por_pagina', '25');

    const res = await fetch(`/api/representantes/inferences?${params.toString()}`);
    const json: InferencesResponse = await res.json();

    setData(json.inferences);
    setStats(json.stats);
    setTotalPages(json.total_paginas);
    setLoading(false);
    setRowSelection({});
  }, [minConfidence, statusFilter, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'modify', modifiedEducation?: string) => {
    setUpdating(id);
    const body: Record<string, unknown> = {
      action,
      reviewed_by: 'admin', // For internal use
    };
    if (action === 'modify' && modifiedEducation) {
      body.modified_education = modifiedEducation;
    }

    try {
      const res = await fetch(`/api/representantes/inferences/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        // Refresh data
        await fetchData();
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (err) {
      alert(`Error: ${err}`);
    } finally {
      setUpdating(null);
      setEditingId(null);
      setEditValue('');
    }
  };

  const handleBulkApprove = async () => {
    const selectedIds = Object.keys(rowSelection).filter((key) => rowSelection[key]);
    if (selectedIds.length === 0) return;

    const selectedItems = selectedIds.map((idx) => data[parseInt(idx)]).filter(Boolean);
    const highConfidenceItems = selectedItems.filter(
      (item) => item.education_inference.confidence >= 0.95 && item.education_inference.approved === null
    );

    if (highConfidenceItems.length === 0) {
      alert('No hay inferencias de alta confianza (>=95%) pendientes seleccionadas');
      return;
    }

    if (!confirm(`Aprobar ${highConfidenceItems.length} inferencias con confianza >=95%?`)) {
      return;
    }

    for (const item of highConfidenceItems) {
      await handleAction(item.id, 'approve');
    }
  };

  const columns: ColumnDef<InferenceItem>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          className="h-4 w-4"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          className="h-4 w-4"
        />
      ),
    },
    {
      accessorKey: 'nombre_completo',
      header: 'Nombre',
      cell: ({ row }) => (
        <Link
          href={`/representantes/parlamentarios/${row.original.slug}`}
          className="font-medium text-foreground hover:text-brand hover:underline"
          target="_blank"
        >
          {row.getValue('nombre_completo')}
        </Link>
      ),
    },
    {
      accessorKey: 'profession_raw',
      header: 'Profesion',
      cell: ({ row }) => (
        <span className="text-sm max-w-[200px] truncate block" title={row.getValue('profession_raw')}>
          {row.getValue('profession_raw')}
        </span>
      ),
    },
    {
      id: 'inferred_education',
      header: 'Educacion Inferida',
      cell: ({ row }) => {
        const item = row.original;
        if (editingId === item.id) {
          return (
            <div className="flex gap-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-8 text-sm"
              />
              <Button
                size="sm"
                onClick={() => handleAction(item.id, 'modify', editValue)}
                disabled={updating === item.id}
              >
                OK
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setEditValue('');
                }}
              >
                X
              </Button>
            </div>
          );
        }
        return (
          <span className="text-sm font-medium">{item.education_inference.inferred_education}</span>
        );
      },
    },
    {
      id: 'confidence',
      header: 'Confianza',
      cell: ({ row }) => {
        const confidence = row.original.education_inference.confidence;
        const level = getConfidenceLevel(confidence);
        const { variant } = CONFIDENCE_LABELS[level];
        return (
          <Badge variant={variant}>{Math.round(confidence * 100)}%</Badge>
        );
      },
    },
    {
      id: 'status',
      header: 'Estado',
      cell: ({ row }) => getStatusBadge(row.original.education_inference.approved),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const item = row.original;
        const isUpdating = updating === item.id;
        const isPending = item.education_inference.approved === null;

        if (!isPending) {
          return (
            <span className="text-sm text-muted-foreground">
              {item.education_inference.reviewed_by} - {item.education_inference.reviewed_at?.split('T')[0]}
            </span>
          );
        }

        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleAction(item.id, 'approve')}
              disabled={isUpdating}
            >
              {isUpdating ? '...' : 'Aprobar'}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleAction(item.id, 'reject')}
              disabled={isUpdating}
            >
              Rechazar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditingId(item.id);
                setEditValue(item.education_inference.inferred_education);
              }}
              disabled={isUpdating}
            >
              Modificar
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-5 gap-4">
          <div className="p-4 border-2 border-border bg-card">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Inferencias</div>
          </div>
          <div className="p-4 border-2 border-border bg-card">
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </div>
          <div className="p-4 border-2 border-border bg-card">
            <div className="text-2xl font-bold">{stats.approved}</div>
            <div className="text-sm text-muted-foreground">Aprobadas</div>
          </div>
          <div className="p-4 border-2 border-border bg-card">
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <div className="text-sm text-muted-foreground">Rechazadas</div>
          </div>
          <div className="p-4 border-2 border-border bg-card">
            <div className="text-2xl font-bold">{stats.high_confidence}</div>
            <div className="text-sm text-muted-foreground">Alta Confianza (&ge;95%)</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-10 rounded-md border-2 border-border bg-background px-3 text-sm font-medium"
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobados</option>
          <option value="rejected">Rechazados</option>
        </select>

        <select
          value={minConfidence}
          onChange={(e) => {
            setMinConfidence(e.target.value);
            setPage(1);
          }}
          className="h-10 rounded-md border-2 border-border bg-background px-3 text-sm font-medium"
        >
          <option value="">Todas las confianzas</option>
          <option value="0.95">&ge;95%</option>
          <option value="0.90">&ge;90%</option>
          <option value="0.80">&ge;80%</option>
          <option value="0.70">&ge;70%</option>
        </select>

        <Button
          onClick={handleBulkApprove}
          disabled={Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0}
        >
          Aprobar Seleccionados (&ge;95%)
        </Button>

        <Button variant="outline" onClick={fetchData}>
          Refrescar
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Cargando...</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No hay inferencias que mostrar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Pagina {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
