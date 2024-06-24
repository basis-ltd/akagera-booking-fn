import { FC } from "react";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  mainClassName?: string;
  heading?: string;
  headingClassName?: string;
}

const JSX_MODAL: FC<ModalProps> = ({
  isOpen,
  children,
  onClose,
  className,
  mainClassName = null,
  heading = null,
  headingClassName = null,
}) => {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }

    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isOpen]);

  return (
    <main
      className={`${
        isOpen ? 'opacity-1' : 'opacity-0 pointer-events-none'
      } min-h-screen flex items-center justify-center flex-col overflow-scroll gap-6 fixed top-0 bottom-0 left-0 right-0 z-[1000] bg-black bg-opacity-30 transition-all ease-in-out duration-300 ${mainClassName}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <section
        className={`flex min-w-[35%] max-w-[100vw] overflow-y-scroll flex-col z-[100000] bg-white h-fit gap-4 p-8 py-6 relative shadow-md rounded-md max-[600px]:min-w-[70%] ${className}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <menu className="flex items-center gap-3 justify-between w-full">
          <h1 className={`text-md font-semibold text-primary uppercase ${headingClassName}`}>{heading}</h1>
          <FontAwesomeIcon
            className="text-[15px] text-primary font-balck w-8 !bg-transparent !px-0 !py-0 border-none transition-all ease-in-out duration-300 hover:scale-[1.02] rounded-full cursor-pointer"
            icon={faX}
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          />
        </menu>
        {children}
      </section>
    </main>
  );
};

const Modal: FC<ModalProps> = (props) => {
  const modalContainer = document.querySelector("#modal");
  if (!modalContainer) {
    throw new Error("Modal container not found");
  }

  return ReactDOM.createPortal(<JSX_MODAL {...props} />, modalContainer);
};

export default Modal;
