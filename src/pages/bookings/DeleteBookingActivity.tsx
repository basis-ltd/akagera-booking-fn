import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import { useDeleteBookingActivityMutation } from '@/states/apiSlice';
import {
  removeBookingActivity,
  setDeleteBookingActivityModal,
  setSelectedBookingActivity,
} from '@/states/features/bookingActivitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteBookingActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { deleteBookingActivityModal, selectedBookingActivity } = useSelector(
    (state: RootState) => state.bookingActivity
  );

  // INITIALIZE DELETE BOOKING PERSON MUTATION
  const [
    deleteBookingActivity,
    {
      isLoading: deleteBookingActivityIsLoading,
      isError: deleteBookingActivityIsError,
      error: deleteBookingActivityError,
      isSuccess: deleteBookingActivityIsSuccess,
    },
  ] = useDeleteBookingActivityMutation();

  // HANDLE DELETE BOOKING PERSON RESPONSE
  useEffect(() => {
    if (deleteBookingActivityIsError) {
      if ((deleteBookingActivityError as ErrorResponse)?.status === 500) {
        toast.error('Failed to delete booking person. Please try again.');
      } else {
        toast.error(
          (deleteBookingActivityError as ErrorResponse)?.data?.message
        );
      }
    } else if (deleteBookingActivityIsSuccess) {
      toast.success(
        `${selectedBookingActivity?.activity?.name} has been removed from this booking.`
      );
      dispatch(setSelectedBookingActivity({}));
      dispatch(removeBookingActivity(selectedBookingActivity));
      window.location.reload();
      dispatch(setDeleteBookingActivityModal(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    deleteBookingActivityError,
    deleteBookingActivityIsError,
    deleteBookingActivityIsSuccess,
    dispatch,
  ]);

  return (
    <Modal
      isOpen={deleteBookingActivityModal}
      onClose={() => {
        dispatch(setDeleteBookingActivityModal(false));
      }}
      heading={`Delete ${selectedBookingActivity?.activity?.name} - ${selectedBookingActivity?.price}`}
    >
      <section className="flex flex-col gap-4 w-full">
        <h1 className="text-[14px]">
          Are you sure you want to remove{' '}
          {selectedBookingActivity?.activity?.name} from this booking?
        </h1>
        <menu className="flex items-center gap-3 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setDeleteBookingActivityModal(false));
            }}
          >
            Cancel
          </Button>
          <Button
            danger
            onClick={(e) => {
              e.preventDefault();
              deleteBookingActivity({ id: selectedBookingActivity?.id });
            }}
          >
            {deleteBookingActivityIsLoading ? <Loader /> : 'Delete'}
          </Button>
        </menu>
      </section>
    </Modal>
  );
};

export default DeleteBookingActivity;
