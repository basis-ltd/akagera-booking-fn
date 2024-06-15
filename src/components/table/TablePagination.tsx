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
  
  interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    page?: number;
    size?: number;
    totalElements?: number;
    totalPages?: number;
    setPage?: (page: number) => UnknownAction;
    setSize?: (size: number) => UnknownAction;
  }
  
  export function DataTablePagination<TData>({
    table,
    page = 1,
    size = 10,
    totalElements = 0,
    totalPages = 1,
    setPage,
    setSize,
  }: DataTablePaginationProps<TData>) {
    // STATE VARIABLES
    const dispatch: AppDispatch = useDispatch();
  
    return (
      <footer className="flex items-center justify-between px-2">
        <article className="flex flex-col gap-1">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <p className="flex-1 text-[12px] text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </p>
          )}
          {totalElements > 0 && (
            <p className="text-[12px]">Total records: {totalElements}</p>
          )}
        </article>
        <menu className="flex items-center space-x-6 lg:space-x-8">
          <section className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${size}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
                if (setSize) {
                  dispatch(setSize(Number(value)));
                }
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={size} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem
                    key={pageSize}
                    value={`${pageSize}`}
                    className="cursor-pointer"
                  >
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>
          <section className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {page} of {table.getPageCount() || totalPages}
          </section>
          <section className="flex w-[100px] gap-2 items-center justify-center text-sm font-medium">
            <p className="text-[13px] text-secondary">Go to:</p>
            <input
              type="number"
              min={1}
              className="placeholder:text-[13px] text-[13px] max-w-[50%] py-1 px-2 w-full border border-[#E5E5E5] outline-none focus:outline-none rounded-md"
              onChange={(e) => {
                e.preventDefault();
                if (
                  Number(e.target.value) <= 0 ||
                  Number(e.target.value) > Number(totalPages)
                ) {
                  return;
                } else {
                  table.setPageIndex(Number(e.target.value) - 1);
                  if (setPage) {
                    dispatch(setPage(Number(e.target.value)));
                  }
                }
              }}
            />
          </section>
          <section className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden w-8 h-8 p-0 lg:flex"
              onClick={(e) => {
                e.preventDefault();
                table.setPageIndex(0);
                if (setPage) {
                  dispatch(setPage(1));
                }
              }}
              disabled={!table.getCanPreviousPage() && page === 1}
            >
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-8 h-8 p-0"
              onClick={(e) => {
                e.preventDefault();
                table.previousPage();
                if (setPage) {
                  dispatch(setPage(page - 1));
                }
              }}
              disabled={!table.getCanPreviousPage() && page === 1}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-8 h-8 p-0"
              onClick={(e) => {
                e.preventDefault();
                table.nextPage();
                if (setPage) {
                  dispatch(setPage(page + 1));
                }
              }}
              disabled={!table.getCanNextPage() && page === totalPages}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden w-8 h-8 p-0 lg:flex"
              onClick={(e) => {
                e.preventDefault();
                table.setPageIndex(table.getPageCount() - 1);
                if (setPage) {
                  dispatch(setPage(totalPages));
                }
              }}
              disabled={!table.getCanNextPage() && page === totalPages}
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="w-4 h-4" />
            </Button>
          </section>
        </menu>
      </footer>
    );
  }
  