import { FieldError, FieldErrorsImpl, FieldValues, Merge } from 'react-hook-form';

export const InputErrorMessage = ({
  message,
}: {
  message: string | FieldError | Merge<FieldError, FieldErrorsImpl<FieldValues>> | undefined;
}) => {
  return <p className="text-red-600 text-[13px]">{String(message)}</p>;
};
