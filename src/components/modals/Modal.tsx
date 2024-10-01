import { FC, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  mainClassName?: string;
  heading?: string | ReactNode;
  headingClassName?: string;
}

const JSX_MODAL: FC<ModalProps> = ({
  isOpen,
  children,
  onClose,
  heading = null,
  headingClassName = null,
  className = null,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`z-[1000] min-w-fit max-h-[80vh] overflow-y-scroll ${className}`}
      >
        <DialogHeader>
          <DialogTitle
            className={`text-lg font-semibold text-primary uppercase ${headingClassName}`}
          >
            {heading}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {isOpen && (
          <section className="h-fit overflow-y-scroll">{children}</section>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Modal: FC<ModalProps> = (props) => {
  const modalContainer = document.querySelector('#modal');
  if (!modalContainer) {
    throw new Error('Modal container not found');
  }

  return ReactDOM.createPortal(<JSX_MODAL {...props} />, modalContainer);
};

export default Modal;
