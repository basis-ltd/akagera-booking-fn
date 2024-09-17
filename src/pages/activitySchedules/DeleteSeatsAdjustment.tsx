import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import { useDeleteSeatsAdjustmentsMutation } from '@/states/apiSlice';
import {
  removeFromSeatsAdjustmentsList,
  setDeleteSeatsAdjustmentModal,
  setManageSeatsAdjustmentsModal,
  setSelectedSeatsAdjustment,
} from '@/states/features/activityScheduleSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteSeatsAdjustment = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    deleteSeatsAdjustmentModal,
    selectedActivitySchedule,
    selectedSeatsAdjustment,
  } = useSelector((state: RootState) => state.activitySchedule);

  // INITIALIZE DELETE SEATS ADJUSTMENT MUTATION
  const [
    deleteSeatsAdjustment,
    {
      error: deleteSeatsAdjustmentError,
      isError: deleteSeatsAdjustmentIsError,
      isLoading: deleteSeatsAdjustmentIsLoading,
      isSuccess: deleteSeatsAdjustmentIsSuccess,
      reset: resetDeleteSeatsAdjustment,
    },
  ] = useDeleteSeatsAdjustmentsMutation();

  // HANDLE DELETE SEATS ADJUSTMENT RESPONSE
  useEffect(() => {
    if (deleteSeatsAdjustmentIsSuccess) {
      dispatch(removeFromSeatsAdjustmentsList(selectedSeatsAdjustment?.id));
      dispatch(setDeleteSeatsAdjustmentModal(false));
      dispatch(setManageSeatsAdjustmentsModal(true));
      dispatch(setSelectedSeatsAdjustment(undefined));
      resetDeleteSeatsAdjustment();
    } else if (deleteSeatsAdjustmentIsError) {
      const errorResponse =
        (deleteSeatsAdjustmentError as ErrorResponse)?.data?.message ||
        'An error occurred while deleting seats adjustment. Refresh page and try again.';
      toast.error(errorResponse);
    }
  }, [
    deleteSeatsAdjustmentIsSuccess,
    deleteSeatsAdjustmentIsError,
    dispatch,
    resetDeleteSeatsAdjustment,
    deleteSeatsAdjustmentError,
    selectedActivitySchedule?.id,
    selectedSeatsAdjustment?.id,
  ]);

  return (
    <Modal
      isOpen={deleteSeatsAdjustmentModal}
      onClose={() => {
        dispatch(setDeleteSeatsAdjustmentModal(false));
      }}
      heading={`Delete seats adjustment for ${selectedActivitySchedule?.startTime} - ${selectedActivitySchedule?.endTime}`}
      className="min-w-[50vw]"
      headingClassName="text-red-600"
    >
      <article className="w-full flex flex-col gap-5">
        <p className="text-[15px]">
          Are you sure you want to delete this seats adjustment? This action
          cannot be undone.
        </p>
        <menu className="w-full flex items-center gap-4 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedSeatsAdjustment(undefined));
              dispatch(setDeleteSeatsAdjustmentModal(false));
              dispatch(setManageSeatsAdjustmentsModal(true));
            }}
          >
            Cancel
          </Button>
          <Button
            danger
            onClick={(e) => {
              e.preventDefault();
              deleteSeatsAdjustment({
                id: selectedSeatsAdjustment?.id,
              });
            }}
          >
            {deleteSeatsAdjustmentIsLoading ? <Loader /> : 'Delete'}
          </Button>
        </menu>
      </article>
    </Modal>
  );
};

export default DeleteSeatsAdjustment;
