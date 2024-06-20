import {
  ChangeEvent,
  FC,
  LegacyRef,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Link } from 'react-router-dom';
import DatePicker from './DatePicker';
import { SelectSingleEventHandler } from 'react-day-picker';
import { Checkbox } from '../ui/checkbox';

interface InputProps {
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  onChange?: ((e: ChangeEvent<HTMLInputElement>) => void) | undefined;
  defaultValue?: string | number;
  submit?: boolean;
  type?: string;
  value?: string | number;
  suffixIcon?: IconProp;
  prefixIcon?: IconProp;
  suffixIconHandler?: MouseEventHandler<HTMLAnchorElement> | undefined;
  name?: string;
  suffixIconPrimary?: boolean;
  prefixIconHandler?: MouseEventHandler<HTMLAnchorElement> | undefined;
  prefixIconPrimary?: boolean;
  prefixText?: string | ReactNode;
  checked?: boolean | undefined;
  accept?: string;
  min?: string | number;
  readOnly?: boolean;
  multiple?: boolean;
  labelClassName?: string;
  range?: boolean;
  fromDate?: Date;
}

const Input: FC<InputProps> = ({
  type = 'text',
  label = null,
  placeholder,
  className,
  required = false,
  value,
  onChange,
  defaultValue,
  suffixIcon = null,
  suffixIconHandler,
  suffixIconPrimary = false,
  prefixIcon = null,
  prefixIconHandler,
  prefixText = null,
  checked = undefined,
  name,
  accept = '*',
  min,
  readOnly = false,
  labelClassName = '',
  multiple = false,
  fromDate,
}) => {
  const hiddenFileInput = useRef<HTMLButtonElement>(null);

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!defaultValue && !value && ref?.current) {
      ref.current.value = '';
    }
  }, [defaultValue, value]);

  if (['checkbox', 'radio'].includes(type)) {
    if (type === 'checkbox') {
      return (
        <label className="flex w-fit items-center gap-2 text-[13px]">
          <Checkbox name={name} value={value} checked={checked} />
          <p className={`${label ? 'flex' : 'hidden'} text-[13px]`}>{label}</p>
        </label>
      );
    }
    return (
      <label className="flex items-center gap-2 text-[13px]">
        <input
          type={type}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className={`w-4 h-4 border-[1.5px] rounded-xl cursor-pointer border-secondary outline-none focus:outline-none accent-primary focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className}`}
        />
        <p className={`${label ? 'flex' : 'hidden'} text-[13px]`}>{label}</p>
      </label>
    );
  }

  if (type === 'file') {
    const handleClick = () => {
      hiddenFileInput.current?.click();
    };
    return (
      <menu className="text-[12px] w-fit">
        <button
          type="button"
          onClick={handleClick}
          className={`!bg-primary !text-white hover:!bg-primary hover:!text-white !shadow-sm py-[5px] w-full text-[12px] text-center max-[800px]:!text-[14px] px-8 rounded-md cursor-pointer ease-in-out duration-400 hover:scale-[1.005] ${className}`}
        >
          Choose file{multiple ? 's' : ''}
        </button>
        <input
          ref={hiddenFileInput as LegacyRef<HTMLInputElement> | undefined}
          type={type}
          multiple={multiple}
          accept={accept}
          onChange={onChange}
          className="hidden"
        />
      </menu>
    );
  }

  if (['date'].includes(type)) {
    return (
      <label className={`flex flex-col gap-[5px] w-full ${labelClassName}`}>
        <p
          className={`${
            label ? 'flex items-center gap-[5px] text-[14px]' : 'hidden'
          }`}
        >
          {label}{' '}
          <span className={required ? 'text-[14px] text-red-600' : 'hidden'}>
            *
          </span>
        </p>
        <DatePicker
        placeholder={placeholder}
        fromDate={fromDate}
          onChange={
            onChange as
              | SelectSingleEventHandler
              | ((e: Date | ChangeEvent<HTMLInputElement>) => void)
              | undefined
          }
          value={value as Date | undefined}
        />
      </label>
    );
  }

  return (
    <label className={`flex flex-col gap-[5px] w-full ${labelClassName}`}>
      <p
        className={`${
          label ? 'pl-1 flex items-center gap-[5px] text-[14px]' : 'hidden'
        }`}
      >
        {label}{' '}
        <span className={required ? 'text-[14px] text-red-600' : 'hidden'}>
          *
        </span>
      </p>
      {!prefixIcon && !prefixText && !suffixIcon && (
        <input
          defaultValue={defaultValue}
          min={min}
          value={value}
          type={type || 'text'}
          readOnly={readOnly}
          name={name}
          ref={ref}
          onChange={onChange}
          placeholder={readOnly ? '' : placeholder}
          className={`py-[7px] px-4 font-normal placeholder:!font-light  placeholder:text-[13px] text-[14px] flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className} ${
            readOnly &&
            '!border-[.1px] !border-background hover:cursor-default focus:!border-background'
          }`}
        />
      )}
      <section className="relative w-full">
        {(prefixIcon || prefixText) && (
          <menu className={`${labelClassName} relative w-full`}>
            <label className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <Link
                to={'#'}
                onClick={prefixIconHandler}
                className="text-secondary"
              >
                {prefixIcon && (
                  <FontAwesomeIcon className="text-current" icon={prefixIcon} />
                )}
                {prefixText && <p className="text-[14px]">{prefixText}</p>}
              </Link>
            </label>
            <input
              defaultValue={defaultValue}
              value={value}
              type={type || 'text'}
              readOnly={readOnly}
              name={name}
              onChange={onChange}
              placeholder={readOnly ? '' : placeholder}
              className={`py-[7px] px-6 font-normal placeholder:!font-light  placeholder:text-[13px] text-[14px] flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className}
                ${prefixIcon && 'ps-10'} ${prefixText ? 'ps-[3.6rem]' : ''} ${
                readOnly &&
                '!border-[.1px] !border-background hover:cursor-default focus:!border-background'
              }`}
            />
          </menu>
        )}
        {suffixIcon && (
          <menu className="flex items-center">
            <Link
              to={'#'}
              onClick={suffixIconHandler}
              className={`${
                !suffixIcon && 'hidden'
              } absolute top-0 end-0 p-2.5 px-3.5 text-sm font-medium h-full rounded-e-lg border focus:outline-none ${
                suffixIconPrimary
                  ? 'bg-primary text-white border-primary border-l-none'
                  : 'border-secondary border-opacity-50 bg-white text-primary border-l-none'
              }`}
            >
              <FontAwesomeIcon icon={suffixIcon || faSearch} />
            </Link>
            <input
              defaultValue={defaultValue}
              value={value}
              type={type || 'text'}
              onChange={onChange}
              readOnly={readOnly}
              name={name}
              placeholder={readOnly ? '' : placeholder}
              className={`${
                prefixText && '!ml-16 !w-[85%]'
              } py-[7px] px-4 font-normal placeholder:!font-light  placeholder:text-[13px] text-[14px] flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className} ${
                prefixIcon &&
                '!ml-[45px] !w-[90%] !border-l-none !rounded-l-none !ps-3.5'
              } ${
                readOnly &&
                '!border-[.1px] !border-background hover:cursor-default focus:!border-background'
              }`}
            />
          </menu>
        )}
      </section>
    </label>
  );
};

export default Input;
