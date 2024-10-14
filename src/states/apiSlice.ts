import store from 'store';
import { localApiUrl, stagingApiUrl } from '@/constants/environments.constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UUID } from 'crypto';

export const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: ['BookingActivities'],
  baseQuery: fetchBaseQuery({
    baseUrl: stagingApiUrl || localApiUrl,
    prepareHeaders: (headers) => {
      const token = store.get('token');
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
        query: ({ size = 10, page = 0 }) =>
          `services?size=${size}&page=${page}`,
      }),

      // FETCH ACTIVITIES
      fetchActivities: builder.query({
        query: ({ serviceId, size = 10, page = 0 }) => {
          let url = `activities?size=${size}&page=${page}`;
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
          size = 10,
          page = 0,
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
          let url = `bookings?size=${size}&page=${page}`;
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
        query: ({ size = 10, page = 0, bookingId }) => {
          let url = `booking-people?size=${size}&page=${page}`;
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
          plateNumber,
        }) => ({
          url: `booking-vehicles`,
          method: 'POST',
          body: {
            bookingId,
            registrationCountry,
            vehicleType,
            vehiclesCount,
            plateNumber,
          },
        }),
      }),

      // FETCH BOOKING VEHICLES
      fetchBookingVehicles: builder.query({
        query: ({ size = 10, page = 0, bookingId }) => {
          let url = `booking-vehicles?size=${size}&page=${page}`;
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
          defaultRate,
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
            defaultRate,
          },
        }),
      }),

      // FETCH BOOKING ACTIVITIES
      fetchBookingActivities: builder.query({
        query: ({
          size = 10,
          page = 0,
          bookingId,
          activityId,
          startTime,
          status,
        }) => {
          let url = `booking-activities?size=${size}&page=${page}`;
          if (bookingId) {
            url += `&bookingId=${bookingId}`;
          }
          if (activityId) {
            url += `&activityId=${activityId}`;
          }
          if (startTime) {
            url += `&startTime=${startTime}`;
          }
          if (status) {
            url += `&status=${status}`;
          }
          return { url };
        },
        providesTags: (result) =>
          result
            ? [
                ...result.data.rows.map(({ id }: { id: UUID }) => ({
                  type: 'BookingActivities' as const,
                  id,
                })),
                { type: 'BookingActivities', id: 'LIST' },
              ]
            : [{ type: 'BookingActivities', id: 'LIST' }],
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
          let url = `booking-statuses?size=100&page=0`;
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
        query: ({ id, status }) => ({
          url: `bookings/${id}/submit`,
          method: 'PATCH',
          body: {
            status,
          },
        }),
      }),

      // FETCH USERS
      fetchUsers: builder.query({
        query: ({ role, size, page, nationality }) => {
          let url = `users?size=${size}&page=${page}`;
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
        query: ({ startDate, endDate, type }) => {
          let url = `bookings/time-series?startDate=${startDate}&endDate=${endDate}`;
          if (type) {
            url += `&type=${type}`;
          }
          return {
            url,
          };
        },
      }),

      // FETCH POPULAR ACTIVITIES
      fetchPopularActivities: builder.query({
        query: ({ size = 10, page = 0, startDate, endDate, type }) => {
          let url = `booking-activities/popular?size=${size}&page=${page}`;
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

      // FETCH POPULAR BOOKING PEOPLE
      fetchPopularBookingPeople: builder.query({
        query: ({ size = 10, page = 0, criteria, startDate, endDate, type }) => {
          let url = `booking-people/popular?size=${size}&page=${page}`;
          if (criteria) {
            url += `&criteria=${criteria}`;
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

      // FETCH BOOKING PEOPLE STATS
      fetchBookingPeopleStats: builder.query({
        query: ({ startDate, endDate, month, size = 5000, page = 0 }) => {
          let url = `booking-people/stats?size=${size}&page=${page}`;
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

      // UPDATE ACTIVITY SCHEDULE
      updateActivitySchedule: builder.mutation({
        query: ({
          id,
          startTime,
          endTime,
          description,
          disclaimer,
          numberOfSeats,
          activityId,
          minNumberOfSeats,
          maxNumberOfSeats,
        }) => {
          return {
            url: `activity-schedules/${id}`,
            method: 'PATCH',
            body: {
              startTime,
              endTime,
              description,
              disclaimer,
              numberOfSeats,
              activityId,
              minNumberOfSeats,
              maxNumberOfSeats,
            },
          };
        },
      }),

      // CREATE ACTIVITY SCHEDULE
      createActivitySchedule: builder.mutation({
        query: ({
          startTime,
          endTime,
          description,
          disclaimer,
          numberOfSeats,
          activityId,
          minNumberOfSeats,
          maxNumberOfSeats,
        }) => {
          return {
            url: `activity-schedules`,
            method: 'POST',
            body: {
              startTime,
              endTime,
              description,
              disclaimer,
              numberOfSeats,
              activityId,
              minNumberOfSeats,
              maxNumberOfSeats,
            },
          };
        },
      }),

      // DELETE ACTIVITY SCHEUDLE
      deleteActivitySchedule: builder.mutation({
        query: ({ id }) => {
          return {
            url: `activity-schedules/${id}`,
            method: 'DELETE',
          };
        },
      }),

      // LIST ACTIVITY SCHEDULES
      fetchActivitySchedules: builder.query({
        query: ({ size = 10, page = 0, activityId }) => {
          let url = `activity-schedules?size=${size}&page=${page}`;
          if (activityId) {
            url += `&activityId=${activityId}`;
          }
          return {
            url,
          };
        },
      }),

      // LIST ACTIVITY RATES
      fetchActivityRates: builder.query({
        query: ({ size = 10, page = 0, activityId }) => {
          let url = `activity-rates?size=${size}&page=${page}`;
          if (activityId) {
            url += `&activityId=${activityId}`;
          }
          return {
            url,
          };
        },
      }),

      // CREATE ACTIVITY RATE
      createActivityRate: builder.mutation({
        query: ({
          name,
          ageRage,
          description,
          disclaimer,
          amountUsd,
          amountRwf,
          activityId,
        }) => {
          return {
            url: `activity-rates`,
            method: 'POST',
            body: {
              name,
              ageRage,
              description,
              disclaimer,
              amountUsd,
              amountRwf,
              activityId,
            },
          };
        },
      }),

      // CREATE ACTIVITY RATE
      updateActivityRate: builder.mutation({
        query: ({
          name,
          ageRage,
          description,
          disclaimer,
          amountUsd,
          amountRwf,
          activityId,
          id,
        }) => {
          return {
            url: `activity-rates/${id}`,
            method: 'PATCH',
            body: {
              name,
              ageRage,
              description,
              disclaimer,
              amountUsd,
              amountRwf,
              activityId,
            },
          };
        },
      }),

      // DELETE ACTIVITY RATE
      deleteActivityRate: builder.mutation({
        query: ({ id }) => {
          return {
            url: `activity-rates/${id}`,
            method: 'DELETE',
          };
        },
      }),

      // VERIFY AUTHENTICATION
      verifyAuthentication: builder.mutation({
        query: ({ email, otp }) => {
          return {
            url: `auth/verify`,
            method: 'POST',
            body: {
              otp,
              email,
            },
          };
        },
      }),

      // REQUEST OTP
      requestOtp: builder.mutation({
        query: ({ email }) => {
          return {
            url: `auth/request-login-otp`,
            method: 'POST',
            body: {
              email,
            },
          };
        },
      }),

      // GET USER PROFILE
      getUserById: builder.query({
        query: ({ id }) => `users/${id}`,
      }),

      // UPDATE USER
      updateUser: builder.mutation({
        query: ({
          id,
          name,
          email,
          role,
          gender,
          dateOfBirth,
          phone,
          nationality,
          residence,
        }) => {
          return {
            url: `users/${id}`,
            method: 'PATCH',
            body: {
              name,
              role,
              email,
              phone,
              gender,
              dateOfBirth,
              nationality,
              residence,
            },
          };
        },
      }),

      // CREATE PAYMENT
      createPayment: builder.mutation({
        query: ({ bookingId, amount, email, currency }) => {
          return {
            url: `payments`,
            method: 'POST',
            body: {
              bookingId,
              amount: amount,
              email,
              currency,
            },
          };
        },
      }),

      // FETCH PAYMENTS
      fetchPayments: builder.query({
        query: ({ size = 10, page = 0, bookingId, status, email }) => {
          let url = `payments?size=${size}&page=${page}`;

          if (bookingId) {
            url += `&bookingId=${bookingId}`;
          }

          if (status) {
            url += `&status=${status}`;
          }

          if (email) {
            url += `&email=${email}`;
          }

          return {
            url,
          };
        },
      }),

      // UPDATE PAYMENT
      updatePayment: builder.mutation({
        query: ({ paymentIntentId, status }) => {
          return {
            url: `payments`,
            method: 'PATCH',
            body: {
              status,
              paymentIntentId,
            },
          };
        },
      }),

      // CONFIRM PAYMENT
      confirmPayment: builder.mutation({
        query: ({ id, transactionToken }) => {
          return {
            url: `payments/${id}/confirm`,
            method: 'PATCH',
            body: {
              transactionToken,
            },
          };
        },
      }),

      // CREATE ACTIVITY
      createActivity: builder.mutation({
        query: ({ name, description, disclaimer, serviceId }) => {
          return {
            url: `activities`,
            method: 'POST',
            body: {
              name,
              description,
              disclaimer,
              serviceId,
            },
          };
        },
      }),

      // GET TERMS OF SERVICE
      getTermsOfService: builder.query({
        query: () => 'terms',
      }),

      // UPDATE BOOKING CONSENT
      updateBookingConsent: builder.mutation({
        query: ({ id, consent }) => {
          return {
            url: `bookings/${id}/consent`,
            method: 'PATCH',
            body: {
              consent,
            },
          };
        },
      }),

      // GET REMAINING SEATS
      getRemainingSeats: builder.query({
        query: ({ id, date }) =>
          `activity-schedules/${id}/seats/remaining?date=${date}`,
      }),

      // GET BOOKING AMOUNT
      getBookingAmount: builder.query({
        query: ({ id }) => `bookings/${id}/amount`,
      }),

      // UPDATE TERMS OF SERVICE
      updateTermsOfService: builder.mutation({
        query: ({ id, termsOfService }) => {
          return {
            url: `terms/${id}`,
            method: 'PATCH',
            body: {
              termsOfService,
            },
          };
        },
      }),

      // HANDLE PAYMENT CALLBACK
      handlePaymentCallback: builder.mutation({
        query: ({ CompanyRef, TransID, CCDapproval, status }) => {
          return {
            url: `payments/callback?CompanyRef=${CompanyRef}&TransID=${TransID}&CCDapproval=${CCDapproval}`,
            method: 'POST',
            body: {
              status,
            },
          };
        },
      }),

      // DOWNLOAD CONSENT FORM
      downloadConsentForm: builder.query({
        query: ({ id }) => {
          return {
            url: `bookings/${id}/consent/download`,
          };
        },
      }),

      // CREATE SEATS ADJUSTMENTS
      createSeatsAdjustments: builder.mutation({
        query: ({
          activityScheduleId,
          startDate,
          adjustedSeats,
          endDate,
          reason,
        }) => {
          return {
            url: `seats-adjustments`,
            method: 'POST',
            body: {
              activityScheduleId,
              startDate,
              adjustedSeats,
              endDate,
              reason,
            },
          };
        },
      }),

      // FETCH SEATS ADJUSTMENTS
      fetchSeatsAdjustments: builder.query({
        query: ({ size = 100, page = 0, activityScheduleId, userId }) => {
          let url = `seats-adjustments?size=${size}&page=${page}`;
          if (activityScheduleId) {
            url += `&activityScheduleId=${activityScheduleId}`;
          }
          if (userId) {
            url += `&userId=${userId}`;
          }
          return {
            url,
          };
        },
      }),

      // DELETE SEATS ADJUSTMENTS
      deleteSeatsAdjustments: builder.mutation({
        query: ({ id }) => {
          return {
            url: `seats-adjustments/${id}`,
            method: 'DELETE',
          };
        },
      }),

      // UPDATE USER PASSWORD
      updateUserPassword: builder.mutation({
        query: ({ id, existingPassword, newPassword }) => {
          return {
            url: `users/${id}/password`,
            method: 'PATCH',
            body: {
              existingPassword,
              newPassword,
            },
          };
        },
      }),

      // GET USD RATE
      getUsdRate: builder.query({
        query: () => '/settings/usd-rate',
      }),

      // SET USD RATE
      setUsdRate: builder.mutation({
        query: ({ usdRate }) => ({
          url: '/settings/usd-rate',
          method: 'PATCH',
          body: {
            usdRate,
          },
        }),
      }),

      // UPDATE USER PHOTO
      updateUserPhoto: builder.mutation({
        query: ({ id, formData }) => {
          return {
            url: `users/${id}/photo`,
            method: 'PATCH',
            body: formData,
            formData: true,
          };
        },
      }),

      // GET BOOKING EMAIL
      findBookingEmail: builder.query({
        query: ({ email, phone, referenceId, page, size }) => {
          let url = `bookings/search/email?page=${page}&size=${size}`;
          if (email) {
            url += `&email=${email}`;
          }
          if (phone) {
            url += `&phone=${phone}`;
          }
          if (referenceId) {
            url += `&referenceId=${referenceId}`;
          }
          return {
            url,
          };
        },
      }),

      // REQUEST BOOKING OTP
      requestBookingOtp: builder.mutation({
        query: ({ email, phone }) => {
          return {
            url: `bookings/request-otp`,
            method: 'POST',
            body: {
              email,
              phone,
            },
          };
        },
      }),

      // VERIFY BOOKING OTP
      verifyBookingOtp: builder.mutation({
        query: ({ email, otp }) => {
          return {
            url: `bookings/verify-otp`,
            method: 'POST',
            body: {
              email,
              otp,
            },
          };
        },
      }),

      // SEARCH BOOKINGS
      searchBookings: builder.query({
        query: ({ email, phone, referenceId, page, size, token }) => {
          let url = `bookings/search/draft/all?page=${page}&size=${size}&token=${token}`;
          if (email) {
            url += `&email=${email}`;
          }
          if (phone) {
            url += `&phone=${phone}`;
          }
          if (referenceId) {
            url += `&referenceId=${referenceId}`;
          }
          return {
            url,
          };
        },
      }),

      // FETCH ACTIVITIES LOGS
      fetchActivitiesLogs: builder.query({
        query: () => {
          return {
            url: `logs/activities`,
          };
        },
      }),

      // REQUEST RESET PASSWORD
      requestResetPassword: builder.mutation({
        query: ({ email }) => {
          return {
            url: `auth/request-password-reset`,
            method: 'POST',
            body: {
              email,
            },
          };
        },
      }),

      // VERIFY PASSWORD RESET
      verifyPasswordReset: builder.mutation({
        query: ({ email, otp }) => {
          return {
            url: `auth/verify-password-reset`,
            method: 'POST',
            body: {
              email,
              otp,
            },
          };
        },
      }),

      // RESET PASSWORD
      resetPassword: builder.mutation({
        query: ({ token, password }) => {
          return {
            url: `auth/reset-password`,
            method: 'POST',
            body: {
              token,
              password,
            },
          };
        },
      }),

      // UPDATE ADMIN EMAIL
      updateAdminEmail: builder.mutation({
        query: ({ email }) => {
          return {
            url: `settings/admin-email`,
            method: 'PATCH',
            body: {
              email,
            },
          };
        },
      }),

      // FETCH USD RATE HISTORY
      fetchUsdRateHistory: builder.query({
        query: () => {
          return {
            url: `settings/usd-rate-history`,
          };
        },
      }),

      // FETCH ADMIN EMAIL HISTORY
      fetchAdminEmailHistory: builder.query({
        query: () => {
          return {
            url: `settings/admin-email-history`,
          };
        },
      }),

      // FETCH SETTINGS
      fetchSettings: builder.query({
        query: () => {
          return {
            url: `settings`,
          };
        },
      }),

      // UPDATE SETTINGS
      updateSettings: builder.mutation({
        query: ({ id, usdRate, adminEmail }) => {
          return {
            url: `settings/${id}`,
            method: 'PATCH',
            body: {
              usdRate,
              adminEmail,
            },
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
  useUpdateActivityScheduleMutation,
  useCreateActivityScheduleMutation,
  useDeleteActivityScheduleMutation,
  useLazyFetchActivitySchedulesQuery,
  useLazyFetchActivityRatesQuery,
  useCreateActivityRateMutation,
  useDeleteActivityRateMutation,
  useUpdateActivityRateMutation,
  useVerifyAuthenticationMutation,
  useRequestOtpMutation,
  useLazyGetUserByIdQuery,
  useUpdateUserMutation,
  useCreatePaymentMutation,
  useLazyFetchPaymentsQuery,
  useUpdatePaymentMutation,
  useConfirmPaymentMutation,
  useCreateActivityMutation,
  useLazyGetTermsOfServiceQuery,
  useUpdateBookingConsentMutation,
  useLazyGetBookingAmountQuery,
  useLazyGetRemainingSeatsQuery,
  useUpdateTermsOfServiceMutation,
  useHandlePaymentCallbackMutation,
  useLazyDownloadConsentFormQuery,
  useCreateSeatsAdjustmentsMutation,
  useLazyFetchSeatsAdjustmentsQuery,
  useDeleteSeatsAdjustmentsMutation,
  useUpdateUserPasswordMutation,
  useLazyGetUsdRateQuery,
  useSetUsdRateMutation,
  useUpdateUserPhotoMutation,
  useLazyFindBookingEmailQuery,
  useRequestBookingOtpMutation,
  useVerifyBookingOtpMutation,
  useLazySearchBookingsQuery,
  useLazyFetchActivitiesLogsQuery,
  useRequestResetPasswordMutation,
  useVerifyPasswordResetMutation,
  useResetPasswordMutation,
  useUpdateAdminEmailMutation,
  useLazyFetchUsdRateHistoryQuery,
  useLazyFetchAdminEmailHistoryQuery,
  useLazyFetchSettingsQuery,
  useUpdateSettingsMutation,
} = apiSlice;

export default apiSlice;
