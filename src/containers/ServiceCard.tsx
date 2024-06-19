import { Link } from 'react-router-dom';
import { Service } from '../types/models/service.types';
import { AppDispatch, RootState } from '../states/store';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedService } from '../states/features/serviceSlice';

type ServiceCardProps = {
  service: Service;
};

const ServiceCard = ({ service }: ServiceCardProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { selectedService } = useSelector((state: RootState) => state.service);

  return (
    <Link
      to={'#'}
      onClick={(e) => {
        e.preventDefault();
        dispatch(setSelectedService(service));
      }}
      className={`${
        selectedService?.id === service.id && '!bg-primary text-white'
      } w-full p-4 px-6 rounded-md shadow-md bg-slate-50 text-center hover:text-white hover:bg-primary`}
    >
      {service.name}
    </Link>
  );
};

export default ServiceCard;
