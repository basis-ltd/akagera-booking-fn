import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import { useDeleteActivityRateMutation } from '@/states/apiSlice';
import {
  removeFromActivityRatesList,
  setDeleteActivityRateModal,
  setSelectedActivityRate,
} from '@/states/features/activityRateSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteActivityRate = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { deleteActivityRateModal, selectedActivityRate } = useSelector(
    (state: RootState) => state.activityRate
  );

  // INITIALIZE DELETE ACTIVITY RATE MUTATION
  const [
    deleteActivityRate,
    {
      error: deleteActivityRateError,
      isError: deleteActivityRateIsError,
      isLoading: deleteActivityRateIsLoading,
      isSuccess: deleteActivityRateIsSuccess,
    },
  ] = useDeleteActivityRateMutation();

  // HANDLE DELETE ACTIVITY RATE RESPONSE
  useEffect(() => {
    if (deleteActivityRateIsSuccess) {
      toast.success('Activity rate deleted successfully.');
      dispatch(setDeleteActivityRateModal(false));
      dispatch(removeFromActivityRatesList(selectedActivityRate?.id));
    } else if (deleteActivityRateIsError) {
      const errorResponse = (deleteActivityRateError as ErrorResponse)?.data
        .message;
      toast.error(
        errorResponse ||
          'An error occurred while deleting activity rate. Refresh and try again.'
      );
    }
  }, [
    deleteActivityRateError,
    deleteActivityRateIsError,
    deleteActivityRateIsSuccess,
    dispatch,
    selectedActivityRate?.id,
  ]);

  return (
    <Modal
      isOpen={deleteActivityRateModal}
      onClose={() => {
        dispatch(setDeleteActivityRateModal(false));
        dispatch(setSelectedActivityRate(null));
      }}
      heading={`Delete ${selectedActivityRate?.name || 'rate'}`}
      headingClassName="text-red-600"
    >
      Are you sure you want to delete this activity rate -{' '}
      {selectedActivityRate?.name}? This action cannot be undone!
      <menu className="w-full flex items-center gap-3 justify-between">
        <Button
          onClick={(e) => {
            e.preventDefault();
            dispatch(setDeleteActivityRateModal(false));
            dispatch(setSelectedActivityRate(null));
          }}
        >
          Cancel
        </Button>
        <Button
          danger
          onClick={(e) => {
            e.preventDefault();
            deleteActivityRate({ id: selectedActivityRate?.id });
          }}
        >
          {deleteActivityRateIsLoading ? <Loader /> : 'Delete'}
        </Button>
      </menu>
    </Modal>
  );
};

export default DeleteActivityRate;
