import Button from '@/components/inputs/Button';
import Modal from '@/components/modals/Modal';
import { capitalizeString } from '@/helpers/strings.helper';
import {
  setConfirmPaymentModal,
  setPaymentVerification,
} from '@/states/features/paymentSlice';
import { AppDispatch, RootState } from '@/states/store';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';

const ConfirmPayment = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { confirmPaymentModal, paymentVerification } = useSelector(
    (state: RootState) => state.payment
  );

  return (
    <Modal
      isOpen={confirmPaymentModal}
      onClose={() => {
        dispatch(setPaymentVerification(false));
        dispatch(setConfirmPaymentModal(false));
      }}
      className="min-w-[50vw]"
      heading={
        <figure className="w-full flex gap-1 items-center justify-start">
          <p className="text-primary font-semibold">Payment Verified</p>
          <FontAwesomeIcon
            className="text-lg text-primary"
            icon={faCircleCheck}
          />
        </figure>
      }
    >
      <article className="w-full flex flex-col items-center gap-4">
        <menu className="w-full grid grid-cols-2 gap-5 justify-between">
          {Object.entries(paymentVerification ?? {}).map(([key, value]) => {
            return (
              <label key={key} className="flex flex-col">
                <h3 className="text-[15px] font-medium">
                  {capitalizeString(key)}
                </h3>
                <p className="text-[14px]">{value}</p>
              </label>
            );
          })}
        </menu>
        <menu className="w-full my-2 flex items-center justify-center">
          <Button
            primary
            onClick={(e) => {
              e.preventDefault();
              dispatch(setPaymentVerification(false));
              dispatch(setConfirmPaymentModal(false));
            }}
          >
            Close
          </Button>
        </menu>
      </article>
    </Modal>
  );
};

export default ConfirmPayment;
