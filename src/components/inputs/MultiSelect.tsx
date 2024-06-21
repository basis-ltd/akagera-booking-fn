import { useEffect, useRef } from 'react';
import ReactSelect, {
  SingleValue,
  MultiValue,
  OptionsOrGroups,
  GroupBase,
  PropsValue,
} from 'react-select';

type Option = {
  label?: string | number | undefined;
  text?: string | number;
  value: string | number;
  disabled?: boolean;
  id?: string | number;
  name?: string | number;
  title?: string | number;
};

type MultiSelectProps = {
  options?: Option[] | undefined;
  onChange: (e: SingleValue<Option> | MultiValue<Option>) => void;
  className?: string;
  disabled?: boolean;
  defaultLabel?: string;
  isSearchable?: boolean;
  multiple?: boolean;
  autoFocus?: boolean;
  onBlur?: () => void | undefined;
  defaultValue?: PropsValue<Option | MultiValue<Option>> | undefined | string;
  styled?: boolean;
  label?: string | JSX.Element;
  required?: boolean;
  labelClassName?: string;
  placeholder?: string;
  value?: string[];
};

const MultiSelect = ({
  options = [],
  onChange,
  className = '',
  defaultValue = undefined,
  disabled = false,
  isSearchable = true,
  multiple = false,
  autoFocus = false,
  onBlur,
  styled = true,
  label = undefined,
  required = false,
  labelClassName = undefined,
  placeholder = undefined,
  value,
}: MultiSelectProps) => {
  const mappedOptions: OptionsOrGroups<
    Option,
    GroupBase<Option>
  > = options?.map((option: Option) => ({
    ...option,
    label: option.text || option.name || option.title || option.label,
    value: option.value || option.id || '',
    isDisabled: option.disabled,
  }));

  const ref = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if ((!value || value?.length <= 0) && ref?.current) {
      ref.current.value = '';
    }
  }, [value]);

  return (
    <label
      className={`flex flex-col gap-[5px] items-start w-full ${labelClassName}`}
    >
      <p
        className={`${
          label ? 'flex items-center gap-1 text-[14px]' : 'hidden'
        }`}
      >
        {label}{' '}
        <span className={`${required ? 'text-red-500' : 'hidden'}`}>*</span>
      </p>
      <ReactSelect
        onChange={(e: SingleValue<Option> | MultiValue<Option>) => {
          if (multiple) {
            onChange(Array.isArray(e) ? e.map((item) => item?.value) : []);
          } else {
            onChange(e?.value);
          }
        }}
        isSearchable={isSearchable}
        isMulti={multiple}
        isDisabled={disabled}
        autoFocus={autoFocus}
        placeholder={placeholder || 'Select option...'}
        onBlur={onBlur}
        unstyled={!styled}
        ref={ref}
        options={mappedOptions}
        defaultValue={options?.find(
          (option) => option.value === String(defaultValue)
        )}
        className={`${className}`}
      />
    </label>
  );
};

export default MultiSelect;
