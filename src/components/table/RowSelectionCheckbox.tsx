import { useEffect, useRef, FC } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface RowSelectionCheckboxProps {
  indeterminate?: boolean;
  table?: unknown;
  checked?: boolean;
  isHeader?: boolean;
  row?: unknown;
}

const RowSelectionCheckbox: FC<RowSelectionCheckboxProps> = ({
  indeterminate,
  table,
  row,
  isHeader = false,
  ...rest
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      if (ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }
  }, [indeterminate, rest.checked]);

  if (isHeader) {
    return (
      <figure className='px-2' onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}>
        <Checkbox
        defaultChecked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
      </figure>
    );
  } else {
    return (
      <figure className='px-2'>
        <Checkbox
        defaultChecked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
      </figure>
    );
  }
};

export default RowSelectionCheckbox;
