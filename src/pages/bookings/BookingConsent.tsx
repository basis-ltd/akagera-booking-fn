import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import Table from '@/components/table/Table';
import { bookingPeopleColumns } from '@/constants/bookingPerson.constants';
import { COUNTRIES } from '@/constants/countries.constants';
import { genderOptions } from '@/constants/inputs.constants';
import PublicLayout from '@/containers/PublicLayout';
import {
  useLazyFetchBookingPeopleQuery,
  useLazyGetTermsOfServiceQuery,
  useUpdateBookingConsentMutation,
} from '@/states/apiSlice';
import { setBookingPeopleList } from '@/states/features/bookingPeopleSlice';
import { getBookingDetailsThunk } from '@/states/features/bookingSlice';
import { AppDispatch, RootState } from '@/states/store';
import { BookingPerson } from '@/types/models/bookingPerson.types';
import { ColumnDef } from '@tanstack/react-table';
import { UUID } from 'crypto';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookingConsent = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [termsOfService, setTermsOfService] = useState<string>('');
  const [isDeclining, setIsDeclining] = useState<boolean>(false);
  const { booking } = useSelector((state: RootState) => state.booking);
  const { bookingPeopleList } = useSelector(
    (state: RootState) => state.bookingPeople
  );

  // NAVIGATION
  const navigate = useNavigate();
  const { id } = useParams();

  // INITIALIZE FETCHING TERMS OF SERVICE
  const [
    fetchTermsOfService,
    {
      data: termsOfServiceData,
      error: termsOfServiceError,
      isFetching: termsOfServiceIsFetching,
      isError: termsOfServiceIsError,
      isSuccess: termsOfServiceIsSuccess,
    },
  ] = useLazyGetTermsOfServiceQuery();

  // FETCH TERMS OF SERVICE
  useEffect(() => {
    fetchTermsOfService({});
  }, [fetchTermsOfService]);

  // HANDLE TERMS OF SERVICE RESPONSE
  useEffect(() => {
    if (termsOfServiceIsError) {
      const errorResponse =
        (termsOfServiceError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching terms of service. Please try again.';
      toast.error(errorResponse);
    } else if (termsOfServiceIsSuccess) {
      setTermsOfService(termsOfServiceData?.data[0]?.termsOfService || '');
    }
  }, [
    termsOfServiceData?.data,
    termsOfServiceData?.data.content,
    termsOfServiceError,
    termsOfServiceIsError,
    termsOfServiceIsSuccess,
  ]);

  // INITIALIZE UPDATE BOOKING CONSENT
  const [
    updateBookingConsent,
    {
      error: updateBookingConsentError,
      isLoading: updateBookingConsentIsLoading,
      isError: updateBookingConsentIsError,
      isSuccess: updateBookingConsentIsSuccess,
    },
  ] = useUpdateBookingConsentMutation();

  // HANDLE UPDATE BOOKING CONSENT RESPONSE
  useEffect(() => {
    if (updateBookingConsentIsError) {
      const errorResponse =
        (updateBookingConsentError as ErrorResponse)?.data?.message ||
        'An error occurred while updating booking consent. Please try again.';
      toast.error(errorResponse);
    } else if (updateBookingConsentIsSuccess) {
      toast.success('Terms of service accepted successfully.');
      if (booking?.consent) {
        navigate(`/bookings/${id}/create`);
      } else {
        navigate(`/bookings/${id}/preview`);
      }
    }
  }, [
    booking?.consent,
    id,
    navigate,
    updateBookingConsentError,
    updateBookingConsentIsError,
    updateBookingConsentIsSuccess,
  ]);

  // INITIALIZE FETCH BOOKING PEOPLE QUERY
  const [
    fetchBookingPeople,
    {
      data: fetchBookingPeopleData,
      error: fetchBookingPeopleError,
      isFetching: fetchBookingPeopleIsFetching,
      isSuccess: fetchBookingPeopleIsSuccess,
      isError: fetchBookingPeopleIsError,
    },
  ] = useLazyFetchBookingPeopleQuery();

  // FETCH BOOKING PEOPLE
  useEffect(() => {
    fetchBookingPeople({ bookingId: booking?.id, size: 100, page: 0 });
  }, [booking?.id, fetchBookingPeople]);

  // HANDLE FETCH BOOKING PEOPLE RESPONSE
  useEffect(() => {
    if (fetchBookingPeopleIsError) {
      if ((fetchBookingPeopleError as ErrorResponse)?.status === 500) {
        toast.error(
          'An error occurred while fetching booking people. Please try again later'
        );
      } else {
        toast.error((fetchBookingPeopleError as ErrorResponse)?.data?.message);
      }
    } else if (fetchBookingPeopleIsSuccess) {
      dispatch(setBookingPeopleList(fetchBookingPeopleData?.data?.rows));
    }
  }, [
    fetchBookingPeopleIsSuccess,
    fetchBookingPeopleData,
    dispatch,
    fetchBookingPeopleIsError,
    fetchBookingPeopleError,
  ]);

  // GET BOOKING DETAILS THUNK
  useEffect(() => {
    if (id) {
      dispatch(getBookingDetailsThunk({ id: id as UUID }));
    }
  }, [dispatch, id]);

  // NAVIGATION LINKS
  const navigationLinks = [
    {
      route: `/bookings/${id}/create`,
      label: `${booking?.name}`,
    },
    {
      route: `/bookings/${id}/create`,
      label: 'Booking activities',
    },
    {
      route: `/bookings/${id}/consent`,
      label: 'Consent',
    },
  ];

  return (
    <PublicLayout>
      <main className="w-full mx-auto flex flex-col gap-4 p-6">
        {termsOfServiceIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[40vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <menu className="flex w-[80%] mx-auto flex-col gap-4">
            <CustomBreadcrumb navigationLinks={navigationLinks} />
            <article
              className="w-full"
              dangerouslySetInnerHTML={{ __html: termsOfService }}
            />
          </menu>
        )}
        {fetchBookingPeopleIsFetching && (
          <figure className="min-h-[10vh] flex items-center justify-center">
            <Loader className="text-primary" />
          </figure>
        )}
        {bookingPeopleList?.length > 0 ? (
          <section className="w-[80%] mx-auto flex flex-col gap-4">
            <h1 className="text-primary uppercase font-bold">
              Booking participants
            </h1>
            <Table
              showPagination={false}
              showFilter={false}
              data={bookingPeopleList?.map((bookingPerson: BookingPerson) => {
                return {
                  ...bookingPerson,
                  gender: genderOptions?.find(
                    (gender) => gender.value === bookingPerson?.gender
                  )?.label,
                  nationality: COUNTRIES?.find(
                    (country) => country.code === bookingPerson?.nationality
                  )?.name,
                  residence: COUNTRIES?.find(
                    (country) => country.code === bookingPerson?.residence
                  )?.name,
                  age: Number(
                    moment().diff(bookingPerson?.dateOfBirth, 'years', false)
                  ),
                  numberOfDays: Number(
                    moment(bookingPerson?.endDate).diff(
                      bookingPerson?.startDate,
                      'days'
                    )
                  ),
                };
              })}
              columns={bookingPeopleColumns as ColumnDef<BookingPerson>[]}
            />
          </section>
        ) : (
          fetchBookingPeopleIsSuccess && (
            <figure className="min-h-[10vh] flex items-center justify-center">
              <p className="text-black text-[14px]">
                You have not yet added people to your booking.
              </p>
            </figure>
          )
        )}
        <menu className="w-[80%] mx-auto flex items-center gap-3 justify-between my-4">
          {booking?.consent ? (
            <menu className="flex flex-col gap-3 w-full items-center">
              <h3 className="font-medium text-primary">
                You have agreed to the terms of service outlined above 🎉
              </h3>
              <ul className="w-full flex items-center gap-3 justify-between">
                <Button
                  danger
                  onClick={(e) => {
                    e.preventDefault();
                    updateBookingConsent({ id, consent: false });
                  }}
                >
                  {updateBookingConsentIsLoading ? (
                    <Loader />
                  ) : (
                    'Revoke consent'
                  )}
                </Button>
                <Button
                  primary
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/bookings/${id}/preview`);
                  }}
                >
                  Continue
                </Button>
              </ul>
            </menu>
          ) : (
            <>
              <Button
                danger
                onClick={(e) => {
                  e.preventDefault();
                  setIsDeclining(true);
                }}
              >
                Decline
              </Button>
              <Button
                primary
                onClick={(e) => {
                  e.preventDefault();
                  updateBookingConsent({ id, consent: true });
                }}
              >
                {updateBookingConsentIsLoading ? (
                  <Loader className="text-white" />
                ) : (
                  'Accept & Continue'
                )}
              </Button>
            </>
          )}
        </menu>
      </main>
      <ConfirmDecline
        isOpen={isDeclining}
        onClose={() => setIsDeclining(false)}
      />
    </PublicLayout>
  );
};

const ConfirmDecline = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  // NAVIGATION
  const navigate = useNavigate();

  return (
    <Modal
      heading="Decline terms of service"
      isOpen={isOpen}
      onClose={() => onClose()}
    >
      <h2 className="text-md text-start">
        Declining the terms of service will cancel your booking. You can always
        resume the process later.
      </h2>
      <menu className="flex items-center gap-3 justify-between">
        <Button
          danger
          onClick={(e) => {
            e.preventDefault();
            onClose();
            navigate('/');
          }}
        >
          Yes, decline
        </Button>
        <Button
          primary
          onClick={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          Go back
        </Button>
      </menu>
    </Modal>
  );
};

export default BookingConsent;
