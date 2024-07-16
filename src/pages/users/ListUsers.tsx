import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Table from '@/components/table/Table';
import { userColumns } from '@/constants/user.constants';
import AdminLayout from '@/containers/AdminLayout';
import { useLazyFetchUsersQuery } from '@/states/apiSlice';
import { setCreateUserModal, setDeleteUserModal, setSelectedUser, setUsersList } from '@/states/features/userSlice';
import { AppDispatch, RootState } from '@/states/store';
import { User } from '@/types/models/user.types';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';
import DeleteUser from './DeleteUser';

const ListUsers = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { usersList } = useSelector((state: RootState) => state.user);

  // INITIALIZE FETCH USERS QUERY
  const [
    fetchUsers,
    {
      data: usersData,
      isFetching: usersIsFetching,
      isSuccess: usersIsSuccess,
      isError: usersIsError,
      error: usersError,
    },
  ] = useLazyFetchUsersQuery();

  // FETCH USERS
  useEffect(() => {
    fetchUsers({ size: 100, page: 0 });
  }, [fetchUsers]);

  // HANDLE FETCH USERS RESPONSE
  useEffect(() => {
    if (usersIsError) {
      if ((usersError as ErrorResponse)?.status === 500) {
        toast.error(
          'An error occurred while fetching users. Refresh and try again'
        );
      } else {
        toast.error((usersError as ErrorResponse)?.data?.message);
      }
    } else if (usersIsSuccess) {
      dispatch(setUsersList(usersData?.data?.rows));
    }
  }, [dispatch, usersData, usersError, usersIsError, usersIsSuccess]);

  // USER COLUMNS
  const userExtendedColumns = [
    ...userColumns,
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<User> }) => {
        return (
          <menu className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectedUser(row?.original))
                dispatch(setDeleteUserModal(true))
              }}
              className="text-white p-2 cursor-pointer px-[8.2px] bg-red-600 rounded-full text-[13px] transition-all duration-300 hover:scale-[1.01]"
            />
          </menu>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <main className="flex flex-col gap-6 p-6 w-[95%] mx-auto h-full">
        <menu className="w-full flex items-center gap-3 justify-between">
          <h1 className="text-primary uppercase font-bold text-lg">Users</h1>
          <Button
            primary
            className="!py-[5px]"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setCreateUserModal(true));
            }}
          >
            <menu className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} />
              Add user
            </menu>
          </Button>
        </menu>
        {usersIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[40vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          usersIsSuccess && (
            <Table
              data={usersList?.map((user: User, index: number) => {
                return {
                  ...user,
                  no: index + 1,
                };
              })}
              columns={userExtendedColumns as ColumnDef<User>[]}
            />
          )
        )}
      </main>
      <DeleteUser />
    </AdminLayout>
  );
};

export default ListUsers;
