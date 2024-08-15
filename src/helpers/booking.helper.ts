import { ActivityRate } from '@/types/models/activityRate.types';
import { BookingActivity } from '@/types/models/bookingActivity.types';
import { BookingPerson } from '@/types/models/bookingPerson.types';
import { BookingVehicle } from '@/types/models/bookingVehicle.types';
import moment from 'moment';

type PriceType = 'adults' | 'children';

interface PricingStructure {
  [key: string]: { adults: number[]; children: number[] };
}

// ENTRY FEES PRICING STRUCTURE
const pricingStructure: PricingStructure = {
  'Rwandan/EAC Citizen': {
    adults: [16, 24, 32],
    children: [11, 16, 21],
  },
  'Rwandan/EAC Resident': {
    adults: [50, 75, 100],
    children: [30, 45, 60],
  },
  'International Visitor': {
    adults: [100, 150, 200],
    children: [50, 75, 100],
  },
  'Pan-African (out of EAC)': {
    adults: [50, 75, 100],
    children: [30, 45, 60],
  },
  'Pan-African/EAC Resident': {
    adults: [25, 38, 50],
    children: [15, 23, 30],
  },
};

export const calculateActivityPrice = (bookingActivity: BookingActivity) => {
  if (
    bookingActivity?.numberOfAdults === 0 &&
    bookingActivity?.numberOfChildren === 0 &&
    !Number(bookingActivity?.defaultRate) &&
    bookingActivity?.numberOfSeats === 0
  )
    return 0;
  let prices = [];
  if (Number(bookingActivity?.defaultRate)) {
    prices = [Number(bookingActivity?.defaultRate)];
  } else {
    prices = [
      Number(bookingActivity?.numberOfAdults) *
        Number(
          bookingActivity?.activity?.activityRates?.find(
            (rate: ActivityRate) => rate?.ageRange === 'adults'
          )?.amountUsd
        ),
      Number(bookingActivity?.numberOfChildren) *
        Number(
          bookingActivity?.activity?.activityRates?.find(
            (rate: ActivityRate) => rate?.ageRange === 'children'
          )?.amountUsd
        ),
    ];
  }

  return prices?.reduce((acc, curr) => acc + Number(curr), 0);
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
    'ZW',
  ];
  return africanCountries.includes(String(country));
}

export function calculateAge(dateOfBirth: Date) {
  return moment().diff(dateOfBirth, 'years');
}

export const calculateVehiclePrice = (vehicle: BookingVehicle) => {
  if (countryBelongsToEAC(vehicle?.registrationCountry)) {
    if (vehicle?.vehicleType === 'omnibus/bus/overlander') {
      return 20 * vehicle.vehiclesCount;
    } else {
      return 10 * vehicle.vehiclesCount;
    }
  } else {
    if (vehicle?.vehicleType === 'vehicle/minibus') {
      return 40 * vehicle.vehiclesCount;
    } else {
      return 100 * vehicle.vehiclesCount;
    }
  }
};

export const calculateBookingPersonPrice = (person: BookingPerson) => {
  const age = calculateAge(person.dateOfBirth);
  const nights = calculateNights(person.startDate, person.endDate);
  const category = getPriceCategory(
    String(person?.nationality),
    String(person?.residence)
  );

  let priceType: PriceType = 'adults';
  if (age < 6) {
    return 0;
  } else if (age >= 6 && age <= 12) {
    priceType = 'children';
  }

  const prices = pricingStructure[category][priceType];
  if (nights === 1) {
    return prices[0];
  } else if (nights === 2) {
    return prices[1];
  } else {
    return prices[2];
  }
};

export function getPriceCategory(nationality: string, residence: string) {
  if (countryBelongsToEAC(nationality)) {
    return 'Rwandan/EAC Citizen';
  } else if (countryBelongsToEAC(residence)) {
    return 'Rwandan/EAC Resident';
  } else if (countryBelongsInAfrica(nationality)) {
    return 'Pan-African (out of EAC)';
  } else {
    return 'International Visitor';
  }
}

export function calculateNights(startDate: Date, endDate: Date) {
  return moment(endDate).diff(moment(startDate), 'days');
}

export const getBookingStatusColor = (status: string) => {
  return ['pending', 'pending_contact', 'in_progress'].includes(status)
    ? 'bg-yellow-600 text-white'
    : status === 'confirmed'
    ? 'bg-green-600 text-white'
    : 'bg-red-700 text-white';
};
