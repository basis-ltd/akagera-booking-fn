import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

type DashboardCardProps = {
  label: string;
  value: string | number;
  callToAction: () => void;
};

const DashboardCard = ({ label, value, callToAction }: DashboardCardProps) => {
  return (
    <article className="flex flex-col gap-4 w-full max-w-[25vw] rounded-lg shadow-lg p-4 transition-all duration-300 hover:scale-[1.005] cursor-pointer">
      <h1 className="text-primary uppercase font-medium text-lg">{label}</h1>
      <p className="text-3xl font-semibold">{value}</p>
      <Link
        to={'#'}
        onClick={(e) => {
          e.preventDefault();
          callToAction();
        }}
        className="!py-1 text-[14px] justify-self-end text-primary transition-all duration-300 hover:gap-2 flex items-center gap-[6px]"
      >
        View Details
        <FontAwesomeIcon
          icon={faArrowRight}
          className="text-primart font-semibold"
        />
      </Link>
    </article>
  );
};

export default DashboardCard;
