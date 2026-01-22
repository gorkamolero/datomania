/* eslint-disable react-hooks/incompatible-library */
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
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
import type { Parlamentario } from '@/projects/representantes/types/parlamentario';

// Labels for display
const ESTUDIOS_LABELS: Record<string, string> = {
  Universitario: 'Universitario',
  Universitario_inferido: 'Univ. (inferido)',
  FP_Tecnico: 'FP/Técnico',
  Secundario: 'Secundario',
  No_consta: 'No consta',
  Estudios_incompletos: 'Incompletos',
};

const PROFESION_LABELS: Record<string, string> = {
  Profesional_liberal: 'Prof. liberal',
  Funcionario: 'Funcionario',
  Empresario: 'Empresario',
  Politica: 'Política',
  Oficina: 'Oficina',
  Manual: 'Manual',
  No_consta: 'No consta',
};

interface ParlamentariosTableProps {
  parlamentarios: Parlamentario[];
  circunscripciones: string[];
  partidos: string[];
}

export function ParlamentariosTable({
  parlamentarios,
  circunscripciones,
  partidos,
}: ParlamentariosTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo<ColumnDef<Parlamentario>[]>(
    () => [
      {
        accessorKey: 'nombre_completo',
        header: 'Nombre',
        cell: ({ row }) => (
          <Link
            href={`/representantes/parlamentarios/${row.original.slug}`}
            className="font-medium text-foreground hover:text-brand hover:underline"
          >
            {row.getValue('nombre_completo')}
          </Link>
        ),
      },
      {
        accessorKey: 'partido',
        header: 'Partido',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: row.original.partido_color }}
            />
            <span>{row.getValue('partido')}</span>
          </div>
        ),
        filterFn: 'equals',
      },
      {
        accessorKey: 'camara',
        header: 'Cámara',
        cell: ({ row }) => (
          <Badge variant="outline">{row.getValue('camara')}</Badge>
        ),
        filterFn: 'equals',
      },
      {
        accessorKey: 'circunscripcion',
        header: 'Circunscripción',
        filterFn: 'equals',
      },
      {
        accessorKey: 'estudios_nivel',
        header: 'Educación',
        cell: ({ row }) => {
          const nivel = row.getValue('estudios_nivel') as string;
          return (
            <span className="text-sm">
              {ESTUDIOS_LABELS[nivel] || nivel}
            </span>
          );
        },
        filterFn: 'equals',
      },
      {
        accessorKey: 'profesion_categoria',
        header: 'Profesión',
        cell: ({ row }) => {
          const categoria = row.getValue('profesion_categoria') as string;
          return (
            <span className="text-sm">
              {PROFESION_LABELS[categoria] || categoria}
            </span>
          );
        },
        filterFn: 'equals',
      },
    ],
    []
  );

  const table = useReactTable({
    data: parlamentarios,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Buscar por nombre..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <select
          value={(table.getColumn('camara')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('camara')?.setFilterValue(e.target.value || undefined)
          }
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Todas las cámaras</option>
          <option value="Congreso">Congreso</option>
          <option value="Senado">Senado</option>
        </select>

        <select
          value={(table.getColumn('partido')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('partido')?.setFilterValue(e.target.value || undefined)
          }
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Todos los partidos</option>
          {partidos.map((partido) => (
            <option key={partido} value={partido}>
              {partido}
            </option>
          ))}
        </select>

        <select
          value={
            (table.getColumn('circunscripcion')?.getFilterValue() as string) ?? ''
          }
          onChange={(e) =>
            table
              .getColumn('circunscripcion')
              ?.setFilterValue(e.target.value || undefined)
          }
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Todas las circunscripciones</option>
          {circunscripciones.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={
            (table.getColumn('estudios_nivel')?.getFilterValue() as string) ?? ''
          }
          onChange={(e) =>
            table
              .getColumn('estudios_nivel')
              ?.setFilterValue(e.target.value || undefined)
          }
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Todos los niveles</option>
          {Object.entries(ESTUDIOS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Mostrando {table.getFilteredRowModel().rows.length} de{' '}
        {parlamentarios.length} parlamentarios
      </p>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {{
                      asc: ' ↑',
                      desc: ' ↓',
                    }[header.column.getIsSorted() as string] ?? null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount()}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
