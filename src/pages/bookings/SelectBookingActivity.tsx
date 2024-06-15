import Button from '@/components/inputs/Button';
import Modal from '@/components/modals/Modal';
import { formatDate } from '@/helpers/strings';
import { setSelectBookingActivityModal } from '@/states/features/activitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch, useSelector } from 'react-redux';

const SelectBookingActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { selectBookingActivityModal, selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );
  const { booking } = useSelector((state: RootState) => state.booking);

  return (
    <Modal
      isOpen={selectBookingActivityModal}
      onClose={() => {
        dispatch(setSelectBookingActivityModal(false));
      }}
      heading={`Confirm adding ${selectedActivity.name} to "${
        booking?.name
      } - ${formatDate(booking?.startDate)}"?`}
    >
      <h2>
        Below are a few details to assist you in adding this activity to your
        booking
      </h2>
      <menu className="flex flex-col gap-2 w-full">
        <ul className="flex items-center gap-2">
          <h3 className="underline font-medium">Name:</h3>
          <p>{selectedActivity?.name}</p>
        </ul>
        {selectedActivity?.description && (
          <ul className="flex items-center gap-2">
            <h3 className="underline font-medium">Description:</h3>
            <p>{selectedActivity?.description}</p>
          </ul>
        )}
        {selectedActivity?.disclaimer && (
          <ul className="flex items-center gap-2">
            <h3 className="underline font-medium">Disclaimer:</h3>
            <p>{selectedActivity?.disclaimer}</p>
          </ul>
        )}
        <ul className="flex items-start flex-col gap-2 mt-4">
          <h3 className="uppercase font-bold">Rates</h3>
          <ul className="flex flex-col items-start gap-1">
            <h4 className="underline font-medium">Adults:</h4>
            {selectedActivity?.activityRates
              ?.filter((activityRate) => activityRate.ageRange === 'adults')
              ?.map((activityRate) => {
                return (
                  <li key={activityRate.id} className="flex items-center gap-2">
                    <p>
                      {activityRate?.name &&
                        `${activityRate?.name}`}{' - '}
                      {`$${activityRate?.amountUsd}`}{' '}
                      {activityRate?.amountRwf &&
                        `| RWF${activityRate.amountRwf}`}
                    </p>
                  </li>
                );
              })}
          </ul>
          <ul className="flex flex-col items-start gap-1">
            <h4 className="underline font-medium">Children:</h4>
            {selectedActivity?.activityRates
              ?.filter((activityRate) => activityRate.ageRange === 'children')
              ?.map((activityRate) => {
                return (
                  <li key={activityRate.id} className="flex items-center gap-2">
                    <p>
                      {activityRate?.name && `${activityRate.name} - `}
                      {`$${activityRate?.amountUsd}`}{' '}
                      {activityRate?.amountRwf &&
                        `| RWF${activityRate.amountRwf}`}
                    </p>
                  </li>
                );
              })}
          </ul>
        </ul>
        <menu className="flex items-center gap-3 justify-between mt-3">
          <Button
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectBookingActivityModal(false));
            }}
            danger
          >
            Cancel
          </Button>
          <Button
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectBookingActivityModal(false));
            }}
            primary
          >
            Confirm
          </Button>
        </menu>
      </menu>
    </Modal>
  );
};

export default SelectBookingActivity;
