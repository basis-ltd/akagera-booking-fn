import { BookingActivity } from '@/types/models/bookingActivity.types';
import { BookingActivityPerson } from '@/types/models/bookingActivityPerson.types';
import { BookingPerson } from '@/types/models/bookingPerson.types';
import { BookingVehicle } from '@/types/models/bookingVehicle.types';
import moment from 'moment';

export const calculateActivityPrice = (
  bookingActivity: BookingActivity,
  bookingActivityPeople: BookingActivityPerson[] | undefined
) => {
  if (bookingActivityPeople?.length === 0) {
    return bookingActivity?.activity?.activityRates?.find(
      (rate) => rate?.ageRange === 'adults'
    )?.amountUsd;
  }
  const prices = bookingActivityPeople?.map((person) => {
    if (
      calculateAge(person?.bookingPerson?.dateOfBirth) >= 13) {
      return Number(
        bookingActivity?.activity?.activityRates?.find(
          (rate) => rate?.ageRange === 'adults'
        )?.amountUsd
      );
    } else if (calculateAge(person?.bookingPerson?.dateOfBirth) >= 6) {
      return Number(
        bookingActivity?.activity?.activityRates?.find(
          (rate) => rate?.ageRange === 'children'
        )?.amountUsd
      );
    } else if (calculateAge(person?.bookingPerson?.dateOfBirth) < 6) {
      return 0
    }
  });
  return prices
    ?.filter((price) => price !== undefined)
    .reduce((acc, curr) => Number(acc) + Number(curr), 0);
};

export const calculateEntryPrice = (bookingPerson: BookingPerson) => {
    if (calculateAge(bookingPerson?.dateOfBirth) < 6) {
        return 0;
    }
  if (countryBelongsToEAC(bookingPerson?.nationality)) {
    if (calculateAge(bookingPerson?.dateOfBirth) >= 13) {
      return 32;
    } else if (calculateAge(bookingPerson?.dateOfBirth) >= 6) {
      return 16;
    }
  } else if (countryBelongsInAfrica(bookingPerson?.nationality)) {
    if (calculateAge(bookingPerson?.dateOfBirth) >= 13) {
      return 50;
    } else if (calculateAge(bookingPerson?.dateOfBirth) >= 6) {
      return 25;
    }
  }
  return 64;
};

export function countryBelongsToEAC(country: string | undefined) {
  const eacCountries = ['BI', 'RW', 'TZ', 'UG', 'KE', 'SS'];
  return eacCountries.includes(String(country));
}

export function countryBelongsInAfrica(country: string | undefined) {
    const africanCountries = [
        'AO',
        'BJ',
        'BW',
        'BF',
        'BI',
        'CM',
        'CV',
        'CF',
        'TD',
        'KM',
        'CD',
        'DJ',
        'EG',
        'GQ',
        'ER',
        'SZ',
        'ET',
        'GA',
        'GM',
        'GH',
        'GN',
        'GW',
        'CI',
        'KE',
        'LS',
        'LR',
        'LY',
        'MG',
        'MW',
        'ML',
        'MR',
        'MU',
        'MA',
        'MZ',
        'NA',
        'NE',
        'NG',
        'CG',
        'RE',
        'RW',
        'SH',
        'ST',
        'SN',
        'SC',
        'SL',
        'SO',
        'ZA',
        'SS',
        'SD',
        'SZ',
        'TZ',
        'TG',
        'TN',
        'UG',
        'CD',
        'ZM',
        'ZW'
    ];
    return africanCountries.includes(String(country));
}

export function calculateAge(dateOfBirth: Date) {
    console.log(moment().diff(dateOfBirth, 'years'));
    return moment().diff(dateOfBirth, 'years');
}

export const calculateVehiclePrice = (vehicle: BookingVehicle) => {
  if (countryBelongsToEAC(vehicle?.registrationCountry)) {
    if (vehicle?.vehicleType === 'omnibus/bus/overlander') {
      return 20
    } else {
      return 100
    }
  } else {
    if (vehicle?.vehicleType === 'vehicle/minibus') {
      return 10
    } else {
      return 40
    }
  }
}
