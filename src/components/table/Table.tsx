import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  Table as TableType,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { DataTablePagination } from './TablePagination';
import TableToolbar from './TableToolbar';
import { UnknownAction } from '@reduxjs/toolkit';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowClickHandler?: undefined | ((row: TData) => void);
  showFilter?: boolean;
  showPagination?: boolean;
  showExport?: boolean;
  page?: number;
  size?: number;
  totalCount?: number;
  totalPages?: number;
  setPage?: (page: number) => UnknownAction;
  setSize?: (size: number) => UnknownAction;
}

export default function Table<TData, TValue>({
  columns = [],
  data = [],
  rowClickHandler = undefined,
  showFilter = true,
  showPagination = true,
  showExport = true,
  page = 0,
  size = 100,
  totalCount,
  totalPages,
  setPage,
  setSize,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: page,
        pageSize: size,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <section className="w-full flex flex-col gap-5" aria-label="Data Table">
      {showFilter && (
        <header>
          <TableToolbar
            table={table as unknown as TableType<object>}
            columns={columns as ColumnDef<object>[]}
            showExport={showExport}
          />
        </header>
      )}
      <main className="overflow-x-auto">
        <table className="min-w-full border-collapse table-auto">
          <caption className="sr-only">Data Table</caption>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900 border-b"
                    key={header.id}
                    scope="col"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={`hover:bg-gray-100 ${
                    rowClickHandler ? 'cursor-pointer' : ''
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    rowClickHandler &&
                      row?.id !== 'no' &&
                      rowClickHandler(row?.original as Row<TData>['original']);
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const preventAction = [
                      'no',
                      'action',
                      'checkbox',
                      'actions',
                    ].includes(
                      cell.column.id ||
                        (
                          cell as unknown as {
                            column: { accessorKey: string };
                          }
                        )?.column?.accessorKey
                    );
                    return (
                      <td
                        className={`${
                          preventAction ? '!cursor-auto' : ''
                        } whitespace-nowrap py-4 px-4 text-sm text-gray-900 border-b`}
                        key={cell.id}
                        onClick={(e) => {
                          if (preventAction) {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-4 text-center text-sm text-gray-500"
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
      {showPagination && (
        <footer>
          <DataTablePagination
            page={page}
            size={size}
            totalCount={totalCount}
            totalPages={totalPages}
            table={table}
            setPage={setPage}
            setSize={setSize}
          />
        </footer>
      )}
    </section>
  );
}
