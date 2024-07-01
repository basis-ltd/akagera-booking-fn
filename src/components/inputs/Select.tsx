import {
  Select as SelectComponent,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FC } from 'react';

interface SelectProps {
  label?: string | undefined;
  options?: Array<{ label: string; value: string; disabled?: boolean }>;
  defaultValue?: string | undefined;
  placeholder?: string;
  className?: string;
  onChange?: ((value: string) => void) | undefined;
  value?: string | undefined;
  required?: boolean;
  labelClassName?: string | undefined;
  name?: string | undefined;
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
}) => {
  return (
    <label className={`flex flex-col gap-1 w-full ${labelClassName}`}>
      <p className={label ? 'flex items-center gap-1 text-[14px]' : 'hidden'}>
        {label} <span className={required ? `text-red-600` : 'hidden'}>*</span>
      </p>
      <SelectComponent
        onValueChange={onChange}
        defaultValue={defaultValue}
        value={value}
        name={name}
      >
        <SelectTrigger
          className={`w-full focus:ring-transparent ring-0 h-[40px] ${className}`}
        >
          <SelectValue
            className="!text-[10px]"
            placeholder={
              <p className="text-[14px] text-gray-500">{placeholder || 'Select option'}</p>
            }
          />
        </SelectTrigger>
        <SelectContent className="z-[1000]">
          <SelectGroup>
            {options.map((option, index: number) => {
              return (
                <SelectItem
                  key={index}
                  value={option.value}
                  disabled={option?.disabled}
                  className="cursor-pointer text-[13px] py-1"
                >
                  <p className="text-[13px] py-[3px]">{option.label}</p>
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
