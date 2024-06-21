import { Link, useNavigate } from 'react-router-dom';
import akageraLogo from '/public/akagera_logo.webp';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

type NavbarProps = {
  className?: string;
  showLogo?: boolean;
  showNavigation?: boolean;
};

const navbarNav = [
  {
    label: 'Account',
    path: '/auth/login',
  },
  {
    label: 'Log out',
    path: '/auth/login',
  },
];

const Navbar = ({ className, showLogo, showNavigation }: NavbarProps) => {

  // STATE VARIABLES
  const { isOpen: sidebarOpen } = useSelector(
    (state: RootState) => state.sidebar
  );
  const [isOpen, setIsOpen] = useState(false);

  // NAVIGATION
  const navigate = useNavigate();

  return (
    <header
      className={`${
        sidebarOpen ? 'w-[80vw] left-[20vw]' : 'w-[95vw] left-[5vw]'
      } ${
        showLogo && '!w-[100vw] !left-0'
      } bg-white flex items-center gap-3 justify-between h-[10vh] mx-auto px-[7.5%] bg-transparent fixed py-6 z-[1000] ${className}`}
    >
      <Link to={'#'} onClick={(e) => {
        e.preventDefault();
        navigate('/');
      }} className={`h-[8vh] w-auto ${!showLogo && 'invisible'}`}>
        <img className="text-white h-full w-auto" src={akageraLogo} />
      </Link>
      <menu
        className={`w-full flex items-center gap-8 justify-end ${
          !showNavigation && 'invisible'
        }`}
      >
        {navbarNav.map((navItem, index) => {
          return (
            <Link key={index} to={navItem?.path} className="hover:underline">
              {navItem?.label}
            </Link>
          );
        })}
      </menu>
      <menu className="w-fit relative flex flex-col gap-3">
        <Link
          to={'#'}
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
          className="h-12 w-12 flex items-center justify-center bg-gray-300 rounded-full text-black hover:text-primary cursor-pointer"
        >
          <FontAwesomeIcon icon={faUser} />
        </Link>
        <NavbarDropdown isOpen={isOpen} />
      </menu>
    </header>
  );
};

const NavbarDropdown = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <menu
      className={`w-[250px] right-[-95px] transition-all ease-out duration-500 flex flex-col gap-2 absolute translate-y-0 bg-white rounded-md shadow-md z-[10000] ${
        isOpen ? 'translate-y-0 top-14' : 'translate-y-[-400px]'
      }`}
    >
      {navbarNav.map((navItem, index) => {
        return (
          <Link
            key={index}
            to={navItem?.path}
            className="p-3 px-6 text-center text-black hover:bg-primary hover:text-white w-full"
          >
            {navItem?.label}
          </Link>
        );
      })}
    </menu>
  );
};

export default Navbar;
