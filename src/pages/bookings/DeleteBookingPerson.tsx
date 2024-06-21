import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import { useDeleteBookingPersonMutation } from '@/states/apiSlice';
import {
  removeBookingPerson,
  setDeleteBookingPersonModal,
  setSelectedBookingPerson,
} from '@/states/features/bookingPeopleSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteBookingPerson = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { deleteBookingPersonModal, selectedBookingPerson } = useSelector(
    (state: RootState) => state.bookingPeople
  );

  // INITIALIZE DELETE BOOKING PERSON MUTATION
  const [
    deleteBookingPerson,
    {
      isLoading: deleteBookingPersonIsLoading,
      isError: deleteBookingPersonIsError,
      error: deleteBookingPersonError,
      isSuccess: deleteBookingPersonIsSuccess,
    },
  ] = useDeleteBookingPersonMutation();

  // HANDLE DELETE BOOKING PERSON RESPONSE
  useEffect(() => {
    if (deleteBookingPersonIsError) {
      if ((deleteBookingPersonError as ErrorResponse)?.status === 500) {
        toast.error('Failed to delete booking person. Please try again.');
      } else {
        toast.error((deleteBookingPersonError as ErrorResponse)?.data?.message);
      }
    } else if (deleteBookingPersonIsSuccess) {
      toast.success(
        `${selectedBookingPerson?.name} has been removed from this booking.`
      );
      dispatch(setSelectedBookingPerson({}));
      dispatch(removeBookingPerson(selectedBookingPerson));
      dispatch(setDeleteBookingPersonModal(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    deleteBookingPersonError,
    deleteBookingPersonIsError,
    deleteBookingPersonIsSuccess,
    dispatch,
  ]);

  return (
    <Modal
      isOpen={deleteBookingPersonModal}
      onClose={() => {
        dispatch(setDeleteBookingPersonModal(false));
      }}
      heading={`Delete ${selectedBookingPerson?.name}`}
    >
      <section className="flex flex-col gap-4 w-full">
        <h1 className="text-[14px]">
          Are you sure you want to remove {selectedBookingPerson?.name} from
          this booking?
        </h1>
        <menu className="flex items-center gap-3 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setDeleteBookingPersonModal(false));
            }}
          >
            Cancel
          </Button>
          <Button
            danger
            onClick={(e) => {
              e.preventDefault();
              deleteBookingPerson({ id: selectedBookingPerson?.id });
            }}
          >
            {deleteBookingPersonIsLoading ? <Loader /> : 'Delete'}
          </Button>
        </menu>
      </section>
    </Modal>
  );
};

export default DeleteBookingPerson;
