import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import { useDeleteUserMutation } from '@/states/apiSlice';
import {
  removeUserFromList,
  setDeleteUserModal,
  setSelectedUser,
} from '@/states/features/userSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteUser = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { deleteUserModal, selectedUser } = useSelector(
    (state: RootState) => state.user
  );

  // INITIALIZE DELETE USER MUTATION
  const [
    deleteUser,
    {
      isLoading: deleteUserIsLoading,
      isError: deleteUserIsError,
      error: deleteUserError,
      isSuccess: deleteUserIsSuccess,
      reset: deleteUserReset,
    },
  ] = useDeleteUserMutation();

  // HANDLE DELETE USER RESPONSE
  useEffect(() => {
    if (deleteUserIsError) {
      const errorResponse =
        (deleteUserError as ErrorResponse)?.data?.message ||
        'An error occurred while deleting user. Refresh and try again.';
      toast.error(errorResponse);
    } else if (deleteUserIsSuccess && selectedUser) {
      toast.success(`${selectedUser?.name} has been removed successfully`);
      dispatch(removeUserFromList(selectedUser?.id));
      dispatch(setDeleteUserModal(false));
      deleteUserReset();
      dispatch(setSelectedUser(undefined));
    }
  }, [
    deleteUserError,
    deleteUserIsError,
    deleteUserIsSuccess,
    deleteUserReset,
    dispatch,
    selectedUser,
  ]);

  return (
    <Modal
      isOpen={deleteUserModal}
      onClose={() => {
        dispatch(setSelectedUser(undefined));
        dispatch(setDeleteUserModal(false));
      }}
      heading={`Delete ${selectedUser?.name}`}
    >
      Are you sure you want to delete {selectedUser?.name}? This action cannot
      be undone!
      <menu className="flex items-center gap-3 justify-between mt-4">
        <Button
          onClick={(e) => {
            e.preventDefault();
            dispatch(setSelectedUser(undefined));
            dispatch(setDeleteUserModal(false));
          }}
        >
          Cancel
        </Button>
        <Button
          danger
          primary
          onClick={(e) => {
            e.preventDefault();
            deleteUser({ id: selectedUser?.id });
          }}
        >
          {deleteUserIsLoading ? <Loader /> : 'Delete'}
        </Button>
      </menu>
    </Modal>
  );
};

export default DeleteUser;
