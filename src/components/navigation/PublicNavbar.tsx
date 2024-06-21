import { Link, useNavigate } from 'react-router-dom';
import akageraLogo from '/public/akagera_logo.webp';
import Button from '../inputs/Button';

type PublicNavbarProps = {
  className?: string;
  hideActions?: boolean;
};

const PublicNavbar = ({ className, hideActions }: PublicNavbarProps) => {
  // NAVIGATION
  const navigate = useNavigate();

  return (
    <header
      className={`bg-white flex items-center justify-between h-[9vh] w-[100%] mx-auto px-[7.5%] bg-transparent fixed py-6 z-[1000] ${className}`}
    >
      <Link
        to={'#'}
        onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}
        className="h-[8vh] w-auto"
      >
        <img className="text-white h-full w-auto" src={akageraLogo} />
      </Link>
      {!hideActions && (
        <Button primary route={'/auth/login'}>
          Login
        </Button>
      )}
    </header>
  );
};

export default PublicNavbar;
