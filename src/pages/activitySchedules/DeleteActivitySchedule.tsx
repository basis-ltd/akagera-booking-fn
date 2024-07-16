import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import { useDeleteActivityScheduleMutation } from '@/states/apiSlice';
import {
  removeFromActivityScheduleList,
  setDeleteActivityScheduleModal,
  setSelectedActivitySchedule,
} from '@/states/features/activityScheduleSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteActivitySchedule = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { deleteActivityScheduleModal, selectedActivitySchedule } = useSelector(
    (state: RootState) => state.activitySchedule
  );

  // INITIALIZE DELETE ACTIVITY SCHEDULE MUTATION
  const [
    deleteActivitySchedule,
    {
      error: deleteActivityScheduleError,
      isError: deleteActivityScheduleIsError,
      isLoading: deleteActivityScheduleIsLoading,
      isSuccess: deleteActivityScheduleIsSuccess,
    },
  ] = useDeleteActivityScheduleMutation();

  // HANDLE DELETE ACTIVITY SCHEDULE RESPONSE
  useEffect(() => {
    if (deleteActivityScheduleIsSuccess) {
      toast.success('Activity schedule deleted successfully.');
      dispatch(setDeleteActivityScheduleModal(false));
      dispatch(removeFromActivityScheduleList(selectedActivitySchedule?.id));
    } else if (deleteActivityScheduleIsError) {
      const errorResponse = (deleteActivityScheduleError as ErrorResponse)?.data
        .message;
      toast.error(
        errorResponse ||
          'An error occurred while deleting activity schedule. Refresh and try again.'
      );
    }
  }, [
    deleteActivityScheduleError,
    deleteActivityScheduleIsError,
    deleteActivityScheduleIsSuccess,
    dispatch,
    selectedActivitySchedule?.id,
  ]);

  return (
    <Modal
      isOpen={deleteActivityScheduleModal}
      onClose={() => {
        dispatch(setDeleteActivityScheduleModal(false));
        dispatch(setSelectedActivitySchedule(null));
      }}
      heading={`Delete ${selectedActivitySchedule?.description || 'schedule'}`}
    >
      Are you sure you want to delete this activity schedule? This action cannot
      be undone!
      <menu className="w-full flex items-center gap-3 justify-between">
        <Button
          onClick={(e) => {
            e.preventDefault();
            dispatch(setDeleteActivityScheduleModal(false));
            dispatch(setSelectedActivitySchedule(null));
          }}
        >
          Cancel
        </Button>
        <Button
          danger
          onClick={(e) => {
            e.preventDefault();
            deleteActivitySchedule({ id: selectedActivitySchedule?.id });
          }}
        >
          {deleteActivityScheduleIsLoading ? <Loader /> : 'Delete'}
        </Button>
      </menu>
    </Modal>
  );
};

export default DeleteActivitySchedule;
