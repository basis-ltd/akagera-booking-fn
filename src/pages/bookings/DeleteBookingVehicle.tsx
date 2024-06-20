import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import { useDeleteBookingVehicleMutation } from '@/states/apiSlice';
import {
  removeBookingVehicle,
  setDeleteBookingVehicleModal,
  setSelectedBookingVehicle,
} from '@/states/features/bookingVehicleSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteBookingVehicle = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { deleteBookingVehicleModal, selectedBookingVehicle } = useSelector(
    (state: RootState) => state.bookingVehicle
  );

  // INITIALIZE DELETE BOOKING PERSON MUTATION
  const [
    deleteBookingVehicle,
    {
      isLoading: deleteBookingVehicleIsLoading,
      isError: deleteBookingVehicleIsError,
      error: deleteBookingVehicleError,
      isSuccess: deleteBookingVehicleIsSuccess,
    },
  ] = useDeleteBookingVehicleMutation();

  // HANDLE DELETE BOOKING PERSON RESPONSE
  useEffect(() => {
    if (deleteBookingVehicleIsError) {
      if ((deleteBookingVehicleError as ErrorResponse)?.status === 500) {
        toast.error('Failed to delete booking person. Please try again.');
      } else {
        toast.error(
          (deleteBookingVehicleError as ErrorResponse)?.data?.message
        );
      }
    } else if (deleteBookingVehicleIsSuccess) {
      toast.success(
        `${selectedBookingVehicle?.plateNumber} has been removed from this booking.`
      );
      dispatch(setSelectedBookingVehicle({}));
      dispatch(removeBookingVehicle(selectedBookingVehicle));
      dispatch(setDeleteBookingVehicleModal(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    deleteBookingVehicleError,
    deleteBookingVehicleIsError,
    deleteBookingVehicleIsSuccess,
    dispatch,
  ]);

  return (
    <Modal
      isOpen={deleteBookingVehicleModal}
      onClose={() => {
        dispatch(setDeleteBookingVehicleModal(false));
      }}
      heading={`Delete vehicle #${selectedBookingVehicle?.plateNumber}`}
    >
      <section className="flex flex-col gap-4 w-full">
        <h1 className="text-[14px]">
          Are you sure you want to remove {selectedBookingVehicle?.plateNumber}{' '}
          from this booking?
        </h1>
        <menu className="flex items-center gap-3 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setDeleteBookingVehicleModal(false));
            }}
          >
            Cancel
          </Button>
          <Button
            danger
            onClick={(e) => {
              e.preventDefault();
              deleteBookingVehicle({ id: selectedBookingVehicle?.id });
            }}
          >
            {deleteBookingVehicleIsLoading ? <Loader /> : 'Delete'}
          </Button>
        </menu>
      </section>
    </Modal>
  );
};

export default DeleteBookingVehicle;
