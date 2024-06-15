import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import { COUNTRIES } from '@/constants/countries';
import { genderOptions } from '@/constants/inputs';
import { vehicleRegistration, vehicleTypes } from '@/constants/vehicles';
import { setSelectedService } from '@/states/features/serviceSlice';
import { AppDispatch, RootState } from '@/states/store';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const CreateBookingEntryActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { servicesList, selectedService } = useSelector(
    (state: RootState) => state.service
  );

  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

  // BOOKING PEOPLE COLUMNS
  const bookingPeopleColumns = [
    {
      header: 'Full Names',
      accessorKey: 'name',
    },
    {
      header: 'Nationality',
      accessorKey: 'nationality',
    },
    {
      header: 'Residence',
      accessorKey: 'residence',
    },
    {
      header: 'Gender',
      accessorKey: 'gender',
    },
    {
      header: 'Date of birth',
      accessorKey: 'dateOfBirth',
    },
  ];

  // BOOKING VEHICLES COLUMNS
  const bookingVehiclesColumns = [
    {
      header: 'Vehicle Type',
      accessorKey: 'vehicleType',
    },
    {
      header: 'Vehicle Registration',
      accessorKey: 'vehicleRegistration',
    },
    {
      header: 'Plate Number',
      accessorKey: 'plateNumber',
    },
  ];

  return (
    <section className="w-full flex flex-col gap-3">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <menu className="grid grid-cols-2 gap-5">
          <Controller
            name="numberOfPeople"
            rules={{ required: 'Number of people is required' }}
            control={control}
            defaultValue={1}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      trigger(field.name);
                    }}
                    label="Total number of people in group"
                    placeholder="Enter the total number of people in your group"
                  />
                  {errors?.numberOfPeople && (
                    <InputErrorMessage
                      message={errors.numberOfPeople.message}
                    />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="numberOfVehicles"
            control={control}
            defaultValue={1}
            rules={{ required: 'Number of vehicles is required' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      trigger(field.name);
                    }}
                    label="Total number of vehicles in group"
                    placeholder="Enter the total number of vehicles in your group"
                  />
                  {errors?.numberOfVehicles && (
                    <InputErrorMessage
                      message={errors.numberOfVehicles.message}
                    />
                  )}
                </label>
              );
            }}
          />
        </menu>
        <section className="flex flex-col gap-6">
          {/**
           * BOOKING PEOPLE DETAILS
           */}
          <menu className="w-full flex flex-col gap-3">
            <h3 className="text-primary uppercase text-lg font-bold">
              Booking people details
            </h3>
            <table className="w-full flex flex-col gap-3">
              <thead className="w-full">
                <tr className="w-full grid grid-cols-5 gap-4">
                  {bookingPeopleColumns.map((person) => (
                    <th className="w-full text-start" key={person?.accessorKey}>
                      {person?.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="w-full flex flex-col gap-3">
                {Array.from({ length: watch('numberOfPeople') }).map(
                  (_, index) => {
                    return (
                      <tr key={index} className="w-full grid grid-cols-5 gap-4">
                        {bookingPeopleColumns.map((person) => {
                          switch (person.accessorKey) {
                            case 'dateOfBirth':
                              return (
                                <td
                                  className="w-full flex flex-col gap-1"
                                  key={person.accessorKey}
                                >
                                  <Controller
                                    name={`people[${index}].${person.accessorKey}`}
                                    control={control}
                                    rules={{
                                      required: `${person.header} is required`,
                                    }}
                                    render={({ field }) => {
                                      return (
                                        <Input
                                          {...field}
                                          onChange={(e) => {
                                            field.onChange(e);
                                            trigger(field.name);
                                          }}
                                          type="date"
                                          placeholder={`Enter ${person.header}`}
                                        />
                                      );
                                    }}
                                  />
                                  {errors?.people?.[index]?.[
                                    person.accessorKey
                                  ] && (
                                    <InputErrorMessage
                                      message={
                                        errors.people[index][person.accessorKey]
                                          ?.message
                                      }
                                    />
                                  )}
                                </td>
                              );
                            case 'name':
                              return (
                                <td
                                  className="w-full flex flex-col gap-1"
                                  key={person.accessorKey}
                                >
                                  <Controller
                                    name={`people[${index}].${person.accessorKey}`}
                                    control={control}
                                    rules={{
                                      required: `${person.header} is required`,
                                    }}
                                    render={({ field }) => {
                                      return (
                                        <Input
                                          {...field}
                                          onChange={(e) => {
                                            field.onChange(e.target.value);
                                            trigger(field.name);
                                          }}
                                          placeholder={`Enter ${person.header}`}
                                        />
                                      );
                                    }}
                                  />
                                  {errors?.people?.[index]?.[
                                    person.accessorKey
                                  ] && (
                                    <InputErrorMessage
                                      message={
                                        errors.people[index][person.accessorKey]
                                          ?.message
                                      }
                                    />
                                  )}
                                </td>
                              );
                            case 'gender':
                              return (
                                <td
                                  className="w-full flex flex-col gap-1"
                                  key={person.accessorKey}
                                >
                                  <Controller
                                    name={`people[${index}].${person.accessorKey}`}
                                    control={control}
                                    rules={{
                                      required: `${person.header} is required`,
                                    }}
                                    render={({ field }) => {
                                      return (
                                        <Select
                                          options={genderOptions}
                                          {...field}
                                          onChange={(e) => {
                                            field.onChange(e);
                                            trigger(field.name);
                                          }}
                                          placeholder={`Select ${person.header}`}
                                        />
                                      );
                                    }}
                                  />
                                  {errors?.people?.[index]?.[
                                    person.accessorKey
                                  ] && (
                                    <InputErrorMessage
                                      message={
                                        errors.people[index][person.accessorKey]
                                          ?.message
                                      }
                                    />
                                  )}
                                </td>
                              );
                            case 'nationality':
                              return (
                                <td
                                  className="w-full flex flex-col gap-1"
                                  key={person.accessorKey}
                                >
                                  <Controller
                                    name={`people[${index}].${person.accessorKey}`}
                                    control={control}
                                    rules={{
                                      required: `${person.header} is required`,
                                    }}
                                    defaultValue={'RW'}
                                    render={({ field }) => {
                                      return (
                                        <Select
                                          options={COUNTRIES.map((country) => {
                                            return {
                                              label: country.name,
                                              value: country.code,
                                            };
                                          })}
                                          {...field}
                                          onChange={(e) => {
                                            field.onChange(e);
                                            trigger(field.name);
                                          }}
                                          placeholder={`Enter ${person.header}`}
                                        />
                                      );
                                    }}
                                  />
                                  {errors?.people?.[index]?.[
                                    person.accessorKey
                                  ] && (
                                    <InputErrorMessage
                                      message={
                                        errors.people[index][person.accessorKey]
                                          ?.message
                                      }
                                    />
                                  )}
                                </td>
                              );
                            case 'residence':
                              return (
                                <td
                                  className="w-full flex flex-col gap-1"
                                  key={person.accessorKey}
                                >
                                  <Controller
                                    name={`people[${index}].${person.accessorKey}`}
                                    control={control}
                                    rules={{
                                      required: `${person.header} is required`,
                                    }}
                                    defaultValue={'RW'}
                                    render={({ field }) => {
                                      return (
                                        <Select
                                          options={COUNTRIES.map((country) => {
                                            return {
                                              label: country.name,
                                              value: country.code,
                                            };
                                          })}
                                          {...field}
                                          onChange={(e) => {
                                            field.onChange(e);
                                            trigger(field.name);
                                          }}
                                          placeholder={`Enter ${person.header}`}
                                        />
                                      );
                                    }}
                                  />
                                  {errors?.people?.[index]?.[
                                    person.accessorKey
                                  ] && (
                                    <InputErrorMessage
                                      message={
                                        errors.people[index][person.accessorKey]
                                          ?.message
                                      }
                                    />
                                  )}
                                </td>
                              );
                            default:
                              return (
                                <td
                                  className="w-full flex flex-col gap-1"
                                  key={person.accessorKey}
                                >
                                  <Controller
                                    name={`people[${index}].${person.accessorKey}`}
                                    control={control}
                                    rules={{
                                      required: `${person.header} is required`,
                                    }}
                                    render={({ field }) => {
                                      return (
                                        <Input
                                          {...field}
                                          onChange={(e) => {
                                            field.onChange(e.target.value);
                                            trigger(field.name);
                                          }}
                                          placeholder={`Enter ${person.header}`}
                                        />
                                      );
                                    }}
                                  />
                                  {errors?.people?.[index]?.[
                                    person.accessorKey
                                  ] && (
                                    <InputErrorMessage
                                      message={
                                        errors.people[index][person.accessorKey]
                                          ?.message
                                      }
                                    />
                                  )}
                                </td>
                              );
                          }
                        })}
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </menu>
          {/**
           * BOOKING VEHICLES DETAILS
           */}
          <menu className="w-full flex flex-col gap-3">
            <h3 className="text-primary uppercase text-lg font-bold">
              Booking vehicle details
            </h3>
            <table className="w-full flex flex-col gap-3">
              <thead className="w-full">
                <tr className="w-full grid grid-cols-3 gap-4">
                  {bookingVehiclesColumns.map((vehicle) => (
                    <th
                      className="w-full text-start"
                      key={vehicle?.accessorKey}
                    >
                      {vehicle?.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="w-full flex flex-col gap-3">
                {Array.from({ length: watch('numberOfVehicles') }).map(
                  (_, index) => {
                    return (
                      <tr key={index} className="w-full grid grid-cols-3 gap-4">
                        {bookingVehiclesColumns.map((vehicle) => {
                          switch (vehicle.accessorKey) {
                            case 'vehicleType':
                              return (
                                <td
                                  className="w-full"
                                  key={vehicle.accessorKey}
                                >
                                  <Controller
                                    name={`vehicles[${index}].${vehicle.accessorKey}`}
                                    control={control}
                                    rules={{
                                      required: `${vehicle.header} is required`,
                                    }}
                                    render={({ field }) => {
                                      return (
                                        <Select
                                          {...field}
                                          onChange={(e) => {
                                            field.onChange(e);
                                            trigger(field.name);
                                          }}
                                          options={vehicleTypes}
                                          placeholder={`Enter ${vehicle.header}`}
                                        />
                                      );
                                    }}
                                  />
                                  {errors?.vehicles?.[index]?.[
                                    vehicle.accessorKey
                                  ] && (
                                    <InputErrorMessage
                                      message={
                                        errors.vehicles[index][
                                          vehicle.accessorKey
                                        ]?.message
                                      }
                                    />
                                  )}
                                </td>
                              );
                            case 'plateNumber':
                              return (
                                <td
                                  className="w-full"
                                  key={vehicle.accessorKey}
                                >
                                  <Controller
                                    name={`vehicles[${index}].${vehicle.accessorKey}`}
                                    control={control}
                                    rules={{
                                      required: `${vehicle.header} is required`,
                                    }}
                                    render={({ field }) => {
                                      return (
                                        <Input
                                          {...field}
                                          onChange={(e) => {
                                            field.onChange(e.target.value);
                                            trigger(field.name);
                                          }}
                                          placeholder={`Enter ${vehicle.header}`}
                                        />
                                      );
                                    }}
                                  />
                                  {errors?.vehicles?.[index]?.[
                                    vehicle.accessorKey
                                  ] && (
                                    <InputErrorMessage
                                      message={
                                        errors.vehicles[index][
                                          vehicle.accessorKey
                                        ]?.message
                                      }
                                    />
                                  )}
                                </td>
                              );
                            case 'vehicleRegistration':
                              return (
                                <td
                                  className="w-full"
                                  key={vehicle.accessorKey}
                                >
                                  <Controller
                                    name={`vehicles[${index}].${vehicle.accessorKey}`}
                                    control={control}
                                    rules={{
                                      required: `${vehicle.header} is required`,
                                    }}
                                    render={({ field }) => {
                                      return (
                                        <Select
                                          {...field}
                                          onChange={(e) => {
                                            field.onChange(e);
                                            trigger(field.name);
                                          }}
                                          options={vehicleRegistration}
                                          placeholder={`Enter ${vehicle.header}`}
                                        />
                                      );
                                    }}
                                  />
                                  {errors?.vehicles?.[index]?.[
                                    vehicle.accessorKey
                                  ] && (
                                    <InputErrorMessage
                                      message={
                                        errors.vehicles[index][
                                          vehicle.accessorKey
                                        ]?.message
                                      }
                                    />
                                  )}
                                </td>
                              );
                            default:
                              return (
                                <td
                                  className="w-full"
                                  key={vehicle.accessorKey}
                                >
                                  <Controller
                                    name={`vehicles[${index}].${vehicle.accessorKey}`}
                                    control={control}
                                    rules={{
                                      required: `${vehicle.header} is required`,
                                    }}
                                    render={({ field }) => {
                                      return (
                                        <Input
                                          {...field}
                                          onChange={(e) => {
                                            field.onChange(e.target.value);
                                            trigger(field.name);
                                          }}
                                          placeholder={`Enter ${vehicle.header}`}
                                        />
                                      );
                                    }}
                                  />
                                  {errors?.vehicles?.[index]?.[
                                    vehicle.accessorKey
                                  ] && (
                                    <InputErrorMessage
                                      message={
                                        errors.vehicles[index][
                                          vehicle.accessorKey
                                        ]?.message
                                      }
                                    />
                                  )}
                                </td>
                              );
                          }
                        })}
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </menu>
        </section>
        <menu className="flex items-center gap-3 justify-between w-full">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                setSelectedService(
                  servicesList.indexOf(selectedService) - 1 >= 0 &&
                    servicesList[servicesList.indexOf(selectedService) - 1]
                )
              );
            }}
            disabled={servicesList.indexOf(selectedService) - 1 < 0}
          >
            Back
          </Button>
          <Button
            primary
            disabled={
              servicesList.indexOf(selectedService) + 1 >= servicesList.length
            }
            onClick={async (e) => {
              e.preventDefault();
              dispatch(
                setSelectedService(
                  servicesList.indexOf(selectedService) + 1 <
                    servicesList.length &&
                    servicesList[servicesList.indexOf(selectedService) + 1]
                )
              );
            }}
          >
            Next
          </Button>
        </menu>
      </form>
    </section>
  );
};

export default CreateBookingEntryActivity;
