import { MouseEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface LandingPageCardProps {
  title: string;
  description?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const LandingPageCard = ({
  title,
  description,
  onClick,
}: LandingPageCardProps) => {
  return (
    <section className="w-full flex flex-col gap-4 rounded-md border border-background bg-white shadow-lg p-6 hover:shadow-2xl transition-all ease-in-out duration-300">
      <article className="w-full mx-auto flex flex-col gap-4">
        <h1 className="font-semibold text-center uppercase text-primary text-xl max-[1000px]:text-[50px] max-[900px]:text-[45px] max-[800px]:text-[40px] max-[600px]:text-[35px]">
          {title}
        </h1>
        <p className="font-medium text-center text-[15px] text-slate-800 text-md max-[1000px]:text-[18px] max-[900px]:text-[17px] max-[800px]:text-[16px] max-[600px]:text-[15px">
          {description}
        </p>
      </article>
      <Link to={'#'} className="mx-auto my-2 w-full" onClick={onClick}>
        <menu className="flex items-center gap-[5px] text-primary text transition-all ease-in-out duration-300 hover:gap-2 p-2 w-full hover:bg-primary hover:text-white justify-center rounded-sm">
          Continue{' '}
          <FontAwesomeIcon className="text-[14px]" icon={faArrowRight} />
        </menu>
      </Link>
    </section>
  );
};

export default LandingPageCard;
