import Modal from '@/components/modals/Modal';
import { setCancellationPolicyModal } from '@/states/features/bookingSlice';
import { AppDispatch, RootState } from '@/states/store';
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CancellationPolicy = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { cancellationPolicyModal } = useSelector(
    (state: RootState) => state.booking
  );

  return (
    <Modal
      isOpen={cancellationPolicyModal}
      onClose={() => {
        dispatch(setCancellationPolicyModal(false));
      }}
      heading="Cancellation Policy"
    >
      <article
        dangerouslySetInnerHTML={{
          __html:
            `<p style='margin:0cm;font-size:16px;font-family:"Aptos",sans-serif;'>Cancellations are required to be in writing and incur the following charges:</p>
<p style='margin:0cm;font-size:16px;font-family:"Aptos",sans-serif;'>- More than 30 days prior to arrival: 20% of the total amount due</p>
<p style='margin:0cm;font-size:16px;font-family:"Aptos",sans-serif;'>- More than 7 days prior to arrival: 30% of the total amount due</p>
<p style='margin:0cm;font-size:16px;font-family:"Aptos",sans-serif;'>- Less than 7 days prior to arrival: 50% of the total amount due</p>
<p style='margin:0cm;font-size:16px;font-family:"Aptos",sans-serif;'>- After the activity was due to have commenced: 100% of the total amount due</p>
<p style='margin:0cm;font-size:16px;font-family:"Aptos",sans-serif;'>If the cancellation is made by the park management due to bad weather conditions or otherwise, a full refund will be</p>
<p style='margin:0cm;font-size:16px;font-family:"Aptos",sans-serif;'>given. No refunds will be given for no-shows or late arrivals. An alternative time to do the activity may be offered at</p>
<p style='margin:0cm;font-size:16px;font-family:"Aptos",sans-serif;'>the discretion of Management.</p>` as DetailedHTMLProps<
              HTMLAttributes<HTMLElement>,
              HTMLElement
            >,
        }}
      />
    </Modal>
  );
};

export default CancellationPolicy;
