import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { backgrounds } from 'polished';

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

const activityMap: { [key: string]: { index: number; name: string } } = {
  'entry-fee-pad': { index: 7, name: 'Entry fee (PAD)' },
  'entry-fee-peb': { index: 8, name: 'Entry fee (PEB)' },
  'gorilla': { index: 9, name: 'Gorilla' },
  'camping': { index: 10, name: 'Camping' },
  'fishing': { index: 11, name: 'Fishing' },
  'boat-ride': { index: 12, name: 'Boat Ride' },
  'night-safari': { index: 13, name: 'Night safari' },
  'vehicle-fee': { index: 14, name: 'Vehicle fee' },
  'behind-the-scenes': { index: 15, name: 'Behind the Scenes' },
  'animal-park-pad': { index: 16, name: 'Animal park (PAD)' },
  'animal-park-usd': { index: 17, name: 'Animal Park (USD)' },
  'twin-lake': { index: 19, name: 'Twin lake' },
  'other': { index: 20, name: 'Other' }
};

export const generateMonthlyReport = (visitors: Visitor[]) => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a2'
  });
  pdf.setFontSize(18);
  pdf.text('Akagera National Park', 105, 15, { align: 'center' });
  pdf.setFontSize(14);
  pdf.text('Visitor Report', 105, 25, { align: 'center' });
  pdf.setFontSize(10);

  const headers = [
    'Group Nr', 'Date', 'Type of visitor', 'Nationality', 'Country (born)', 'Country (live)',
    'Group size', ...Object.values(activityMap).sort((a, b) => a.index - b.index).map(a => a.name),
    'Days', 'No. of Vehicles', 'Vehicle Type', 'No. of pax', 'Month'
  ];

  const data = visitors.map((visitor, index) => {
    const booking = visitor.booking;
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

    const activities = Object.keys(activityMap).map(() => '');
    booking.bookingActivities.forEach(activity => {
      const activityInfo = getActivityInfo(activity.activityId);
      if (activityInfo) {
        activities[activityInfo.index - 7] = (activity.numberOfAdults + activity.numberOfChildren).toString();
      }
    });

    return [
      index + 1,
      startDate.toISOString().split('T')[0],
      visitor.nationality === 'RW' ? 'RR' : 'FV',
      visitor.nationality,
      visitor.nationality,
      visitor.residence,
      booking.bookingActivities.reduce((sum, activity) => sum + activity.numberOfAdults + activity.numberOfChildren, 0),
      ...activities,
      days,
      booking.bookingVehicles[0]?.vehiclesCount || 0,
      booking.bookingVehicles[0]?.vehicleType.split('/')[1] || '',
      booking.bookingActivities.reduce((sum, activity) => sum + activity.numberOfAdults + activity.numberOfChildren, 0),
      startDate.toLocaleString('default', { month: 'long' })
    ];
  });

  pdf.autoTable({
    head: [headers],
    body: data,
    startY: 35,
    styles: { fontSize: 8, backgrounds: backgrounds() },
    columnStyles: { 0: { cellWidth: 10 } },
    didDrawPage: (data) => {
      pdf.setFontSize(8);
      pdf.text(`Page ${data.pageNumber} of ${pdf.internal.getNumberOfPages()}`, pdf.internal.pageSize.width - 20, pdf.internal.pageSize.height - 10);
    }
  });

  pdf.save('akagera_national_park_visitors.pdf');
};

const getActivityInfo = (activityId: string): { index: number; name: string } | undefined => {
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
    'm0123456-1234-5678-9abc-def012345678': 'other'
  };

  const activityType = activityIdToType[activityId];
  return activityType ? activityMap[activityType] : undefined;
};
