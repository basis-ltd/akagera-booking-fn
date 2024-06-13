import { FC, MouseEventHandler } from 'react';
import { Link, To } from 'react-router-dom';

interface ButtonProps {
  route?: To;
  children: string | JSX.Element;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  primary?: boolean;
  styled?: boolean;
  className?: string;
  submit?: boolean;
  danger?: boolean;
}

const Button: FC<ButtonProps> = ({
  route = '#',
  onClick,
  disabled = false,
  submit,
  primary,
  danger,
  styled = true,
  className,
  children
}) => {
  if (submit) {
    return (
      <button
        className={`border-[1.5px] flex items-center justify-center text-center text-[14px] border-primary rounded-md py-[6px] px-4 hover:bg-primary hover:text-white transition-all hover:scale-[1.02] ${
          primary && 'bg-primary text-white'
        } ${
          danger &&
          'bg-red-600 border-none text-white hover:bg-red-600 hover:text-white shadow-sm'
        } ${
          !styled &&
          '!bg-transparent hover:underline hover:bg-transparent border-none hover:!text-black hover:scale-[1.00] text-[13px] !px-0'
        } ${className}`}
        type="submit"
      >
        {children}
      </button>
    );
  }

  return (
    <Link
      to={route}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        onClick && onClick(e);
      }}
      className={`border-[1.5px] flex text-[14px] items-center justify-center text-center border-primary rounded-md py-[6px] px-4 hover:bg-primary hover:text-white transition-all hover:scale-[1.02] ${
        primary && 'bg-primary text-white'
      } ${
        danger &&
        'bg-red-600 border-none text-white hover:bg-red-600 hover:text-white shadow-sm'
      } ${
        !styled &&
        '!bg-transparent hover:bg-transparent border-none hover:!text-black hover:scale-[1.00] text-[13px] !px-0'
      } ${className}`}
    >
      {children}
    </Link>
  );
};

export default Button;
