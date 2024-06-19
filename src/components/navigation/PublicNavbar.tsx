import { Link } from 'react-router-dom';
import akageraLogo from '/public/akagera_logo.webp';

type PublicNavbarProps = {
  className?: string;
};

const PublicNavbar = ({ className }: PublicNavbarProps) => {
  return (
    <header
      className={`bg-white flex items-center h-[9vh] w-[100%] mx-auto px-[7.5%] bg-transparent fixed py-6 z-[1000] ${className}`}
    >
      <Link to={'/'} className="h-[8vh] w-auto">
        <img className="text-white h-full w-auto" src={akageraLogo} />
      </Link>
    </header>
  );
};

export default PublicNavbar;
