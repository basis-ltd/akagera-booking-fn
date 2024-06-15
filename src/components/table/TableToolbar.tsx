import { useState } from 'react';
import { Table, ColumnDef } from '@tanstack/react-table';
import { DataTableViewOptions } from './TableViewOptions';
import { DataTableFacetedFilter } from './FacetedFilter';
import Select from '../inputs/SingleSelect';
import { capitalizeString } from '@/helpers/strings';
import { Button } from '../ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

interface TableToolbarProps<T extends object> {
  table: Table<T>;
  columns: ColumnDef<T>[];
  showExport?: boolean;
}

export default function TableToolbar<T extends object>({
  table,
  columns,
}: TableToolbarProps<T>) {
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // NAVIGATE
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [searchColumn, setSearchColumn] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('');

  // HANDLE GLOBAL FILTER CHANGE
  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilterValue(value);
    table.setGlobalFilter(value);
  };

  // HANDLE COLUMN FILTER CHANGE
  const handleColumnFilterChange = (columnId: string, value: string) => {
    setSearchColumn(value);

    const column = table.getColumn(columnId);

    column?.setFilterValue(value);
  };

  return (
    <nav className="flex flex-col gap-4">
      <section className="flex items-start justify-between gap-4 w-full">
        <nav className="flex items-center flex-1 min-w-[50%] space-x-2">
          <menu className="flex items-center w-full gap-0">
            <Select
              value={searchType}
              onChange={(value) => {
                if (value === 'global') {
                  setSearchType('');
                  setGlobalFilterValue('');
                  return;
                }
                setSearchType(value);
                setGlobalFilterValue('');
              }}
              className="border border-r-[0px] border-[#E5E5E5] outline-none focus:outline-none rounded-l-md"
              placeholder="Search by column..."
              options={
                Array.from(columns)?.length <= 0
                  ? []
                  : [
                      { label: 'All', value: 'global' },
                      ...Array.from(columns)
                        .filter(
                          (column) => column.filterFn && column.id !== 'date'
                        )
                        .map((column) => {
                          return {
                            label:
                              String(
                                table.getColumn(column?.accessorKey)?.columnDef
                                  .header
                              ) || '',
                            value: String(column?.accessorKey) || '',
                          };
                        }),
                    ]
              }
            />
            <input
              placeholder={
                searchType === ''
                  ? 'Search all columns...'
                  : `Search by ${capitalizeString(searchType)}...`
              }
              className="placeholder:text-[13px] text-[14px] h-9 w-full max-w-[30%] border border-l-[0px] border-[#E5E5E5] outline-none focus:outline-none rounded-r-md"
              value={searchType === '' ? globalFilterValue : searchColumn}
              onChange={(event) => {
                if (searchType !== '') {
                  handleColumnFilterChange(searchType, event.target.value);
                } else {
                  handleGlobalFilterChange(event.target.value);
                }
              }}
            />
          </menu>
        </nav>
        <Button
          variant={'outline'}
          className="flex items-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            setShowFilters(!showFilters);
          }}
        >
          {' '}
          <FontAwesomeIcon className="text-primary" icon={faFilter} /> Filter
        </Button>
        <DataTableViewOptions table={table} />
      </section>
      <menu
        className={`${
          showFilters
            ? 'flex opacity-100 transform translate-y-0'
            : 'h-0 pointer-events-none invisible opacity-0 transform -translate-y-full duration-0'
        } transition-all ease-in-out duration-300 w-full flex items-center gap-2`}
      >
        {Array.from(columns)
          ?.filter((column) => column?.filterFn)
          ?.map((column) => {
            return (
              <DataTableFacetedFilter
                key={column?.accessorKey}
                column={table.getColumn(column?.accessorKey)}
                title={table.getColumn(column?.accessorKey)?.columnDef.header}
                options={Array.from(
                  table
                    .getColumn(column?.accessorKey)
                    ?.getFacetedUniqueValues() || []
                )?.map((column) => {
                  const splitColumn = String(column)?.split(',')[0];
                  return {
                    label: String(splitColumn),
                    value: String(splitColumn),
                  };
                })}
              />
            );
          })}
      </menu>
    </nav>
  );
}
