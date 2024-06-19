import { localApiUrl, stagingApiUrl } from '@/constants/environments.constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: localApiUrl || stagingApiUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
      // FETCH SERVICES
      fetchServices: builder.query({
        query: ({ take = 10, skip = 0 }) =>
          `services?take=${take}&skip=${skip}`,
      }),

      // FETCH ACTIVITIES
      fetchActivities: builder.query({
        query: ({ serviceId, take = 10, skip = 0 }) => {
          let url = `activities?take=${take}&skip=${skip}`;
          if (serviceId) {
            url += `&serviceId=${serviceId}`;
          }
          return {
            url,
          };
        },
      }),

      // CREATE BOOKING
      createBooking: builder.mutation({
        query: ({ name, startDate, createdBy, phone }) => ({
          url: `bookings`,
          method: 'POST',
          body: {
            name,
            startDate,
            createdBy,
            phone,
          },
        }),
      }),

      // FETCH BOOKINGS
      fetchBookings: builder.query({
        query: ({
          take = 10,
          skip = 0,
          referenceId,
          createdBy,
          approvedBy,
          approvedAt,
          startDate,
          endDate,
          status,
        }) => {
          let url = `bookings?take=${take}&skip=${skip}`;
          if (status) {
            url += `&status=${status}`;
          }
          if (referenceId) {
            url += `&referenceId=${referenceId}`;
          }
          if (createdBy) {
            url += `&createdBy=${createdBy}`;
          }
          if (approvedBy) {
            url += `&approvedBy=${approvedBy}`;
          }
          if (approvedAt) {
            url += `&approvedAt=${approvedAt}`;
          }
          if (startDate) {
            url += `&startDate=${startDate}`;
          }
          if (endDate) {
            url += `&endDate=${endDate}`;
          }
          return {
            url,
          };
        },
      }),

      // GET BOOKING DETAILS
      getBookingDetails: builder.query({
        query: ({ id, referenceId }) =>
          `bookings/${id}${referenceId ? `?referenceId=${referenceId}` : ''}`,
      }),

      // CREATE BOOKING PERSON
      createBookingPerson: builder.mutation({
        query: ({
          name,
          email,
          phone,
          nationality,
          residence,
          dateOfBirth,
          bookingId,
        }) => ({
          url: `booking-people`,
          method: 'POST',
          body: {
            name,
            email,
            phone,
            nationality,
            residence,
            dateOfBirth,
            bookingId,
          },
        }),
      }),

      // FETCH BOOKING PEOPLE
      fetchBookingPeople: builder.query({
        query: ({ take = 10, skip = 0, bookingId }) => {
          let url = `booking-people?take=${take}&skip=${skip}`;
          if (bookingId) {
            url += `&bookingId=${bookingId}`;
          }
          return {
            url,
          };
        },
      }),

      // CREATE BOOKING VEHICLE
      createBookingVehicle: builder.mutation({
        query: ({
          bookingId,
          plateNumber,
          registrationCountry,
          vehicleType,
        }) => ({
          url: `booking-vehicles`,
          method: 'POST',
          body: {
            bookingId,
            plateNumber,
            registrationCountry,
            vehicleType,
          },
        }),
      }),

      // FETCH BOOKING VEHICLES
      fetchBookingVehicles: builder.query({
        query: ({ take = 10, skip = 0, bookingId }) => {
          let url = `booking-vehicles?take=${take}&skip=${skip}`;
          if (bookingId) {
            url += `&bookingId=${bookingId}`;
          }
          return {
            url,
          };
        },
      }),

      // CREATE BOOKING ACTIVITY
      createBookingActivity: builder.mutation({
        query: ({ bookingId, activityId, startTime }) => ({
          url: `booking-activities`,
          method: 'POST',
          body: {
            bookingId,
            activityId,
            startTime,
          },
        }),
      }),

      // FETCH BOOKING ACTIVITIES
      fetchBookingActivities: builder.query({
        query: ({ take = 10, skip = 0, bookingId }) => {
          let url = `booking-activities?take=${take}&skip=${skip}`;
          if (bookingId) {
            url += `&bookingId=${bookingId}`;
          }
          return {
            url,
          };
        },
      }),

      // UPDATE BOOKING
      updateBooking: builder.mutation({
        query: ({ id, status, name, notes, createdBy, startDate }) => ({
          url: `bookings/${id}`,
          method: 'PATCH',
          body: {
            status,
            name,
            notes,
            createdBy,
            startDate,
          },
        }),
      }),
    };
  },
});

export const {
  useLazyFetchServicesQuery,
  useLazyFetchActivitiesQuery,
  useCreateBookingMutation,
  useLazyFetchBookingsQuery,
  useLazyGetBookingDetailsQuery,
  useCreateBookingPersonMutation,
  useLazyFetchBookingPeopleQuery,
  useCreateBookingVehicleMutation,
  useLazyFetchBookingVehiclesQuery,
  useCreateBookingActivityMutation,
  useLazyFetchBookingActivitiesQuery,
  useUpdateBookingMutation,
} = apiSlice;

export default apiSlice;
