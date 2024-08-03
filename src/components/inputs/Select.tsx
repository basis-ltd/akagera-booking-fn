import {
  Select as SelectComponent,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FC, ReactNode } from 'react';

interface SelectProps {
  label?: string | undefined;
  options?: Array<{
    label: string | ReactNode;
    value: string;
    disabled?: boolean;
  }>;
  defaultValue?: string | undefined;
  placeholder?: string;
  className?: string;
  onChange?: ((value: string) => void) | undefined;
  value?: string | undefined;
  required?: boolean;
  labelClassName?: string | undefined;
  name?: string | undefined;
  readOnly?: boolean;
}

const Select: FC<SelectProps> = ({
  options = [],
  defaultValue = undefined,
  placeholder = 'Select here...',
  className = undefined,
  value = '',
  onChange,
  label = undefined,
  required = false,
  labelClassName = undefined,
  name = undefined,
  readOnly = false,
}) => {
  return (
    <label className={`flex flex-col gap-[5px] w-full ${labelClassName}`}>
      <p className={label ? 'flex items-center gap-1 text-[14px]' : 'hidden'}>
        {label} <span className={required ? `text-red-600` : 'hidden'}>*</span>
      </p>
      <SelectComponent
        onValueChange={
          (!readOnly && onChange) as ((value: string) => void) | undefined
        }
        defaultValue={defaultValue}
        value={value}
        name={name}
      >
        <SelectTrigger
          className={`w-full focus:ring-transparent ring-0 h-[35px] ${className}`}
        >
          <SelectValue
            className="!text-[10px]"
            placeholder={
              <p className="text-[14px] text-gray-500">
                {placeholder || 'Select option'}
              </p>
            }
          />
        </SelectTrigger>
        <SelectContent className="z-[1000] w-full">
          <SelectGroup>
            {options.map((option, index: number) => {
              return (
                <SelectItem
                  key={index}
                  value={option.value}
                  disabled={option?.disabled}
                  className="cursor-pointer text-[13px] py-1 w-full"
                >
                  <p className="text-[13px] py-[3px] w-full">{option.label}</p>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </SelectComponent>
    </label>
  );
};

export default Select;
