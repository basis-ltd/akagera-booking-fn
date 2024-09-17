import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ReactNode } from 'react';

type CustomPopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
};

const CustomPopover = ({
  trigger,
  children,
  className,
}: CustomPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className={`bg-white mt-4 w-full p-2 ${className}`}>
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default CustomPopover;
