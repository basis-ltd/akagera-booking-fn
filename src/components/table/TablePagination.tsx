import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AppDispatch } from '@/states/store';
import { useDispatch } from 'react-redux';
import { UnknownAction } from '@reduxjs/toolkit';
import { useEffect } from 'react';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  page?: number;
  size?: number;
  totalCount?: number;
  totalPages?: number;
  setPage?: (page: number) => UnknownAction;
  setSize?: (size: number) => UnknownAction;
}

export function DataTablePagination<TData>({
  table,
  page = 0,
  size = 10,
  totalCount = 0,
  totalPages = 1,
  setPage,
  setSize,
}: DataTablePaginationProps<TData>) {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    table.setPageIndex(page);
    table.setPageSize(size);
  }, [page, size, table]);

  return (
    <footer className="flex items-center justify-between px-2">
      <article className="flex flex-col gap-1">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <p className="flex-1 text-[12px] text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </p>
        )}
        {totalCount > 0 && (
          <p className="text-[12px] mr-4">
            Showing {page * size + 1} to{' '}
            {Math.min((page + 1) * size, totalCount)} of {totalCount} entries
          </p>
        )}
      </article>
      <menu className="flex items-center space-x-6 lg:space-x-8">
        <section className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${size}`}
            onValueChange={(value) => {
              if (setSize) {
                dispatch(setSize(Number(value)));
              }
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={size} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 50, 100].map((pageSize) => (
                <SelectItem value={`${pageSize}`} key={pageSize}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>
        <section className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {page + 1} of {totalPages}
        </section>
        <section className="flex w-[100px] gap-2 items-center justify-center text-sm font-medium">
          <p className="text-[13px] text-secondary">Go to:</p>
          <input
            type="number"
            min={1}
            max={totalPages}
            className="placeholder:text-[13px] text-[13px] max-w-[50%] py-1 px-2 w-full border border-[#E5E5E5] outline-none focus:outline-none rounded-md"
            onChange={(e) => {
              const page = Number(e.target.value);
              if (page > 0 && page <= totalPages) {
                if (setPage) {
                  dispatch(setPage(page - 1));
                }
              }
            }}
          />
        </section>
        <section className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden w-8 h-8 p-0 lg:flex"
            onClick={() => {
              if (setPage) {
                dispatch(setPage(0));
              }
            }}
            disabled={page === 0}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => {
              if (setPage) {
                dispatch(setPage(page - 1));
              }
            }}
            disabled={page === 0}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => {
              if (setPage) {
                dispatch(setPage(page + 1));
              }
            }}
            disabled={page + 1 === totalPages || totalPages === 0}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden w-8 h-8 p-0 lg:flex"
            onClick={() => {
              if (setPage) {
                dispatch(setPage(totalPages - 1));
              }
            }}
            disabled={page + 1 === totalPages || totalPages === 0}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="w-4 h-4" />
          </Button>
        </section>
      </menu>
    </footer>
  );
}
