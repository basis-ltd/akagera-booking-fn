import { Link } from 'react-router-dom';
import akageraLogo from '/public/akagera_logo.webp';

type NavbarProps = {
  className?: string;
};

const navbarNav = [
  {
    label: 'Account',
    path: '/auth/login',
  },
  {
    label: 'About Us',
    path: '/about',
  },
  {
    label: 'Services',
    path: '/services',
  },
  {
    label: 'Contact Us',
    path: '/contact',
  },
];

const Navbar = ({ className }: NavbarProps) => {
  return (
    <header
      className={`bg-white flex items-center gap-3 justify-between h-[10vh] w-[100%] mx-auto px-[7.5%] bg-transparent fixed py-6 z-[1000] ${className}`}
    >
      <Link to={'/'} className="h-[8vh] w-auto">
        <img className="text-white h-full w-auto" src={akageraLogo} />
      </Link>
      <menu className="w-full flex items-center gap-8 justify-end">
        {navbarNav.map((navItem, index) => {
          return (
            <Link key={index} to={navItem?.path} className="hover:underline">
              {navItem?.label}
            </Link>
          );
        })}
      </menu>
    </header>
  );
};

export default Navbar;
