import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface BookingActivity {
  startTime: string;
  endTime: string;
  numberOfAdults: number;
  numberOfChildren: number;
  activityId: string;
}

interface BookingVehicle {
  vehicleType: string;
  vehiclesCount: number;
}

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  bookingActivities: BookingActivity[];
  bookingVehicles: BookingVehicle[];
}

interface Visitor {
  id: string;
  gender: string;
  nationality: string;
  residence: string;
  dateOfBirth: string;
  name: string;
  booking: Booking;
}

// Comprehensive list of activities and their corresponding column indices
const activityMap: { [key: string]: { index: number; name: string } } = {
  'entry-fee-pad': { index: 7, name: 'Entry fee (PAD)' },
  'entry-fee-peb': { index: 8, name: 'Entry fee (PEB)' },
  gorilla: { index: 9, name: 'Gorilla' },
  camping: { index: 10, name: 'Camping' },
  fishing: { index: 11, name: 'Fishing' },
  'boat-ride': { index: 12, name: 'Boat Ride' },
  'night-safari': { index: 13, name: 'Night safari' },
  'vehicle-fee': { index: 14, name: 'Vehicle fee' },
  'behind-the-scenes': { index: 15, name: 'Behind the Scenes' },
  'animal-park-pad': { index: 16, name: 'Animal park (PAD)' },
  'animal-park-usd': { index: 17, name: 'Animal Park (USD)' },
  'twin-lake': { index: 19, name: 'Twin lake' },
  other: { index: 20, name: 'Other' },
};

const getActivityInfo = (
  activityId: string
): { index: number; name: string } | undefined => {
  const activityIdToType: { [key: string]: string } = {
    'c37883c4-bdcd-44f1-940a-39b8c3b0e13c': 'entry-fee-pad',
    '6a2ff6d4-73cc-433e-8564-4f0eeea32969': 'entry-fee-peb',
    'a9c4e687-f5be-4ed4-bb25-64606c951848': 'gorilla',
    'd1234567-89ab-cdef-0123-456789abcdef': 'camping',
    'e2345678-9abc-def0-1234-56789abcdef0': 'fishing',
    'f3456789-abcd-ef01-2345-6789abcdef01': 'boat-ride',
    'g4567890-bcde-f012-3456-789abcdef012': 'night-safari',
    'h5678901-cdef-0123-4567-89abcdef0123': 'vehicle-fee',
    'i6789012-def0-1234-5678-9abcdef01234': 'behind-the-scenes',
    'j7890123-ef01-2345-6789-abcdef012345': 'animal-park-pad',
    'k8901234-f012-3456-789a-bcdef0123456': 'animal-park-usd',
    'l9012345-0123-4567-89ab-cdef01234567': 'twin-lake',
    'm0123456-1234-5678-9abc-def012345678': 'other',
  };

  const activityType = activityIdToType[activityId];
  return activityType ? activityMap[activityType] : undefined;
};

export const generateMonthlyReport = ({
  bookingPeople,
}: {
  bookingPeople: Visitor[];
}) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([
    [
      'Group Nr',
      'Date',
      'Type of visitor',
      'Nationality',
      'Group',
      'No. of activities',
      'Days',
      'Vehicles',
      'Personalia',
      'Month',
    ],
    [
      '',
      '',
      '',
      '',
      'Country where they were born/passport',
      'Country where they live',
      'Number of people in group',
      ...Object.values(activityMap)
        .sort((a, b) => a.index - b.index)
        .map((activity) => activity.name),
      '',
      'No. of Vehicles',
      'Car, Minibus, Coaster, 4WD, Other',
      'No. of pax',
      '',
    ],
  ]);

  bookingPeople.forEach((visitor, index) => {
    const booking = visitor.booking;
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
    );

    const row = [
      index + 1, // Group Nr
      startDate.toISOString().split('T')[0], // Date
      visitor.nationality === 'RW' ? 'RR' : 'FV', // Type of visitor
      visitor.nationality, // Nationality
      visitor.nationality, // Country where they were born/passport
      visitor.residence, // Country where they live
      booking.bookingActivities.reduce(
        (sum, activity) =>
          sum + activity.numberOfAdults + activity.numberOfChildren,
        0
      ), // Number of people in group
      ...Array(Object.keys(activityMap).length).fill(''), // Placeholder for activities
      days, // Days
      booking.bookingVehicles[0]?.vehiclesCount || 0, // No. of Vehicles
      booking.bookingVehicles[0]?.vehicleType.split('/')[1] || '', // Car, Minibus, Coaster, 4WD, Other
      booking.bookingActivities.reduce(
        (sum, activity) =>
          sum + activity.numberOfAdults + activity.numberOfChildren,
        0
      ), // No. of pax
      startDate.toLocaleString('default', { month: 'long' }), // Month
    ];

    // Fill in activities
    booking.bookingActivities.forEach((activity) => {
      const activityInfo = getActivityInfo(activity.activityId);
      if (activityInfo) {
        row[activityInfo.index] =
          activity.numberOfAdults + activity.numberOfChildren;
      }
    });

    XLSX.utils.sheet_add_aoa(worksheet, [row], { origin: -1 });
  });

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitors');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveAs(data, 'akagera_national_park_visitors.xlsx');
};
