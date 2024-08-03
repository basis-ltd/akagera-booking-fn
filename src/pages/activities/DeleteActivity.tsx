import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import { useDeleteActivityMutation } from '@/states/apiSlice';
import {
  removeActivityFromList,
  setDeleteActivityModal,
  setSelectedActivity,
} from '@/states/features/activitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { deleteActivityModal, selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );

  // INITIALIZE DELETE ACTIVITY MUTATION
  const [
    deleteActivity,
    {
      error: deleteActivityError,
      isError: deleteActivityIsError,
      isLoading: deleteActivityIsLoading,
      isSuccess: deleteActivityIsSuccess,
      reset: deleteActivityReset,
    },
  ] = useDeleteActivityMutation();

  // NAVIGATION
  const navigate = useNavigate();

  // HANDLE DELETE ACTIVITY RESPONSE
  useEffect(() => {
    if (deleteActivityIsError) {
      const errorResponse =
        (deleteActivityError as ErrorResponse)?.data?.message ||
        'An error occurred while deleting activity. Refresh page and try again.';
      toast.error(errorResponse);
    } else if (deleteActivityIsSuccess && selectedActivity?.id) {
      dispatch(removeActivityFromList(selectedActivity?.id));
      dispatch(setSelectedActivity(undefined));
      dispatch(setDeleteActivityModal(false));
      deleteActivityReset();
      navigate('/dashboard/activities');
    }
  }, [
    deleteActivityIsError,
    deleteActivityError,
    deleteActivityIsSuccess,
    dispatch,
    navigate,
    selectedActivity?.id,
    deleteActivityReset,
  ]);

  return (
    <Modal
      isOpen={deleteActivityModal}
      onClose={() => {
        dispatch(setDeleteActivityModal(false));
      }}
      heading={`Delete ${selectedActivity?.name}`}
      className="!max-w-[50vw]"
      headingClassName="text-red-600"
    >
      <section className="flex flex-col gap-6">
        <p className="text-[15px]">
          Are you sure you want to delete{' '}
          <span className="font-bold">{selectedActivity?.name}</span> with its
          associated rates and schedules? This activity cannot be undone!
        </p>
        <menu className="flex items-center gap-3 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedActivity(undefined));
              dispatch(setDeleteActivityModal(false));
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              deleteActivity({ id: selectedActivity?.id });
            }}
            danger
          >
            {deleteActivityIsLoading ? <Loader /> : 'Delete'}
          </Button>
        </menu>
      </section>
    </Modal>
  );
};

export default DeleteActivity;
