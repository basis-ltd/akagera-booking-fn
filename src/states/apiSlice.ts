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
          endTime,
          numberOfAdults = 0,
          numberOfChildren = 0,
          numberOfSeats,
          defaultRate
        }) => ({
          url: `booking-activities`,
          method: 'POST',
          body: {
            bookingId,
            activityId,
            startTime,
            bookingActivityPeople,
            endTime,
            numberOfAdults,
            numberOfChildren,
            numberOfSeats,
            defaultRate
          },
        }),
      }),

      // FETCH BOOKING ACTIVITIES
      fetchBookingActivities: builder.query({
        query: ({ take = 10, skip = 0, bookingId, activityId }) => {
          let url = `booking-activities?take=${take}&skip=${skip}`;
          if (bookingId) {
            url += `&bookingId=${bookingId}`;
          }
          if (activityId) {
            url += `&activityId=${activityId}`;
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
        query: ({ id, status, totalAmountRwf, totalAmountUsd }) => ({
          url: `bookings/${id}/submit`,
          method: 'PATCH',
          body: {
            status,
            totalAmountRwf,
            totalAmountUsd,
          },
        }),
      }),

      // FETCH USERS
      fetchUsers: builder.query({
        query: ({ role, take, skip, nationality }) => {
          let url = `users?take=${take}&skip=${skip}`;
          if (role) {
            url += `&role=${role}`;
          }
          if (nationality) {
            url += `&nationality=${nationality}`;
          }
          return {
            url,
          };
        },
      }),

      // CREATE USER
      createUser: builder.mutation({
        query: ({ name, nationality = 'RW', email, role }) => {
          return {
            url: `users`,
            method: 'POST',
            body: {
              name,
              nationality,
              email,
              role,
            },
          };
        },
      }),

      // DELETE USER
      deleteUser: builder.mutation({
        query: ({ id }) => {
          return {
            url: `users/${id}`,
            method: 'DELETE',
          };
        },
      }),

      // GET ACTIVITY DETAILS
      getActivityDetails: builder.query({
        query: ({ id }) => `activities/${id}`,
      }),

      // UPDATE ACTIVITY
      updateActivity: builder.mutation({
        query: ({ id, name, description, disclaimer }) => {
          return {
            url: `activities/${id}`,
            method: 'PATCH',
            body: {
              name,
              description,
              disclaimer,
            },
          };
        },
      }),

      // DELETE ACTIVITY
      deleteActivity: builder.mutation({
        query: ({ id }) => {
          return {
            url: `activities/${id}`,
            method: 'DELETE',
          };
        },
      }),

      // FETCH TIME SERIES BOOKINGS
      fetchTimeSeriesBookings: builder.query({
        query: ({ granularity, month, year, type }) => {
          let url = `bookings/time-series?granularity=${granularity}`;
          if (month) {
            url += `&month=${month}`;
          }
          if (year) {
            url += `&year=${year}`;
          }
          if (type) {
            url += `&type=${type}`;
          }
          return {
            url,
          };
        }
      }),

      // FETCH POPULAR ACTIVITIES
      fetchPopularActivities: builder.query({
        query: ({ take = 10, skip = 0 }) =>
          `booking-activities/popular?take=${take}&skip=${skip}`,
      }),

      // FETCH POPULAR BOOKING PEOPLE
      fetchPopularBookingPeople: builder.query({
        query: ({ take = 10, skip = 0, criteria }) => {
          let url = `booking-people/popular?take=${take}&skip=${skip}`;
          if (criteria) {
            url += `&criteria=${criteria}`;
          }
          return {
            url,
          };
        }
      }),

      // FETCH BOOKING PEOPLE STATS
      fetchBookingPeopleStats: builder.query({
        query: ({ startDate, endDate, month, take = 5000, skip = 0 }) => {
          let url = `booking-people/stats?take=${take}&skip=${skip}`;
          if (startDate) {
            url += `&startDate=${startDate}`;
          }
          if (endDate) {
            url += `&endDate=${endDate}`;
          }
          if (month) {
            url += `&month=${month}`;
          }
          return {
            url,
          };
        },
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
  useLazyFetchUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useLazyGetActivityDetailsQuery,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  useLazyFetchTimeSeriesBookingsQuery,
  useLazyFetchPopularActivitiesQuery,
  useLazyFetchPopularBookingPeopleQuery,
  useLazyFetchBookingPeopleStatsQuery,
} = apiSlice;

export default apiSlice;
