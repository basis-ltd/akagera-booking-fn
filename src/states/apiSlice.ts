import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api',
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
    };
  },
});

export const {
  useLazyFetchServicesQuery,
  useLazyFetchActivitiesQuery,
  useCreateBookingMutation,
} = apiSlice;

export default apiSlice;
