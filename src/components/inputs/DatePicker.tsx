import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChangeEvent, FC, useState } from 'react';
import { SelectSingleEventHandler } from 'react-day-picker';
import moment from 'moment';
import Select from './Select';

interface DatePickerProps {
  value: Date | undefined;
  onChange:
    | SelectSingleEventHandler
    | ((e: ChangeEvent<HTMLInputElement>) => void)
    | undefined;
  selectionType?: 'date' | 'month' | 'year' | 'recurringDate';
  fromDate?: Date;
  placeholder?: string;
}

const DatePicker: FC<DatePickerProps> = ({
  onChange,
  value = undefined,
  selectionType,
  fromDate = undefined,
  placeholder = 'Select date',
}) => {
  // SET MONTH AND YEAR
  const [year, setYear] = useState<string | undefined>(moment().format('YYYY'));
  const [defaultMonth, setDefaultMonth] = useState<Date | undefined>(
    moment().toDate()
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal py-2 h-[38px]',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            selectionType === 'recurringDate' ? (
              moment(value).format('MMMM DD')
            ) : (
              format(value, 'PPP')
            )
          ) : (
            <p className="text-[13px]">{placeholder}</p>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <menu className="flex flex-col gap-2 p-2 w-full">
          <ul
            className={`w-full grid gap-3 ${
              selectionType === 'recurringDate' ? 'grid-cols-1' : 'grid-cols-2'
            }`}
          >
            {selectionType !== 'recurringDate' && (
              <Select
                className="!h-8"
                placeholder="Year"
                onChange={(e) => {
                  setYear(e);
                  setDefaultMonth(moment(e, 'YYYY-MM-DD').toDate());
                }}
                value={year}
                options={Array.from({ length: 200 }, (_, i) => ({
                  value: String(2099 - i),
                  label: String(2099 - i),
                }))}
              />
            )}
            <Select
              className="!h-8"
              placeholder="Month"
              onChange={(e) => {
                setDefaultMonth(moment(`${year}-${e}`, 'YYYY-MM-DD').toDate());
              }}
              value={moment(defaultMonth).format('MM')}
              options={Array.from({ length: 12 }, (_, i) => ({
                value: String(i + 1).padStart(2, '0'),
                label: moment().month(i).format('MMM'),
              }))}
            />
          </ul>
          <Calendar
          fromDate={fromDate}
            mode="single"
            month={defaultMonth}
            onMonthChange={(e) => {
              if (selectionType !== 'recurringDate') {
                setDefaultMonth(e);
              }
            }}
            selected={value}
            onSelect={(e) => {
              e && onChange(moment(e).format());
            }}
            initialFocus
          />
        </menu>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;