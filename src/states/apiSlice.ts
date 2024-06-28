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
        query: ({
          name,
          startDate,
          email,
          phone,
          accomodation,
          exitGate,
          endDate,
          entryGate,
          type,
        }) => ({
          url: `bookings`,
          method: 'POST',
          body: {
            name,
            startDate,
            email,
            phone,
            accomodation,
            exitGate,
            endDate,
            entryGate,
            type,
          },
        }),
      }),

      // FETCH BOOKINGS
      fetchBookings: builder.query({
        query: ({
          take = 10,
          skip = 0,
          referenceId,
          email,
          phone,
          approvedBy,
          approvedAt,
          startDate,
          endDate,
          status,
          type,
        }) => {
          let url = `bookings?take=${take}&skip=${skip}`;
          if (status) {
            url += `&status=${status}`;
          }
          if (referenceId) {
            url += `&referenceId=${referenceId}`;
          }
          if (email) {
            url += `&email=${email}`;
          }
          if (phone) {
            url += `&phone=${phone}`;
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
          if (type) {
            url += `&type=${type}`;
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
          endDate,
          accomodation,
          gender,
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
            accomodation,
            endDate,
            gender,
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
          registrationCountry,
          vehicleType,
          vehiclesCount,
        }) => ({
          url: `booking-vehicles`,
          method: 'POST',
          body: {
            bookingId,
            registrationCountry,
            vehicleType,
            vehiclesCount,
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
        query: ({
          bookingId,
          activityId,
          startTime,
          bookingActivityPeople,
        }) => ({
          url: `booking-activities`,
          method: 'POST',
          body: {
            bookingId,
            activityId,
            startTime,
            bookingActivityPeople,
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
        query: ({ id, status, name, notes, email, phone, startDate }) => ({
          url: `bookings/${id}`,
          method: 'PATCH',
          body: {
            status,
            name,
            notes,
            email,
            phone,
            startDate,
          },
        }),
      }),

      // LOGIN
      login: builder.mutation({
        query: ({ email, password }) => ({
          url: `auth/login`,
          method: 'POST',
          body: {
            email,
            password,
          },
        }),
      }),

      // FETCH BOOKING STATUSES
      fetchBookingStatuses: builder.query({
        query: ({ startDate, endDate }) => {
          let url = `booking-statuses?take=100&skip=0`;
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

      // DELETE BOOKING PERSON
      deleteBookingPerson: builder.mutation({
        query: ({ id }) => ({
          url: `booking-people/${id}`,
          method: 'DELETE',
        }),
      }),

      // DELETE BOOKING VEHICLE
      deleteBookingVehicle: builder.mutation({
        query: ({ id }) => ({
          url: `booking-vehicles/${id}`,
          method: 'DELETE',
        }),
      }),

      // DELETE BOOKING ACTIVITY
      deleteBookingActivity: builder.mutation({
        query: ({ id }) => ({
          url: `booking-activities/${id}`,
          method: 'DELETE',
        }),
      }),

      // SUBMIT BOOKING
      submitBooking: builder.mutation({
        query: ({ id }) => ({
          url: `bookings/${id}/submit`,
          method: 'PATCH',
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
  useLoginMutation,
  useLazyFetchBookingStatusesQuery,
  useDeleteBookingPersonMutation,
  useDeleteBookingVehicleMutation,
  useDeleteBookingActivityMutation,
  useSubmitBookingMutation,
} = apiSlice;

export default apiSlice;
