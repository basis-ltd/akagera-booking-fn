import store from 'store';
import { Link, useNavigate } from 'react-router-dom';
import akageraLogo from '/public/akagera_logo.webp';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store';
import { useState } from 'react';
import { User } from '@/types/models/user.types';
import { capitalizeString } from '@/helpers/strings.helper';

type NavbarProps = {
  className?: string;
  showLogo?: boolean;
  showNavigation?: boolean;
};

const navbarNav = [
  {
    label: 'Account',
    path: '/user/profile',
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
  const { user } = useSelector((state: RootState) => state.user);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className={`${
        sidebarOpen ? 'w-[80vw] left-[20vw]' : 'w-[95vw] left-[5vw]'
      } ${
        showLogo && '!w-[100vw] !left-0'
      } bg-white flex items-center gap-3 justify-between h-[9vh] mx-auto px-[7.5%] bg-transparent fixed py-6 z-[1000] ${className}`}
    >
      <Link to={'/'} className={`h-[8vh] w-auto ${!showLogo && 'invisible'}`}>
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
          className="h-10 w-10 flex items-center justify-center bg-gray-300 rounded-full text-black hover:text-primary cursor-pointer"
        >
          <img
            src={user?.photo}
            className="h-full w-full object-cover rounded-full"
            alt="User profile"
          />
        </Link>
        <NavbarDropdown isOpen={isOpen} user={user} />
      </menu>
    </header>
  );
};

const NavbarDropdown = ({ isOpen, user }: { isOpen: boolean; user?: User }) => {
  const navigate = useNavigate();

  return (
    <menu
      className={`w-[250px] right-[-95px] transition-all ease-out duration-500 flex flex-col gap-2 absolute translate-y-0 bg-white rounded-md shadow-md z-[10000] ${
        isOpen ? 'translate-y-0 top-14' : 'translate-y-[-400px]'
      }`}
    >
      <article className="flex flex-col gap-1 my-2 p-2 rounded-t-md bg-slate-500">
        <h1 className="text-white text-[13px] text-center">{user?.name}</h1>
        <p className="text-white text-[13px] text-center">
          {capitalizeString(user?.role)}
        </p>
      </article>
      <menu className="flex flex-col gap-1 w-full">
        {navbarNav.map((navItem, index) => {
          return (
            <Link
              key={index}
              to={navItem?.path}
              onClick={(e) => {
                e.preventDefault();
                if (navItem?.path === '/auth/login') {
                  store.clearAll();
                  navigate(navItem?.path);
                } else {
                  navigate(navItem?.path);
                }
              }}
              className="p-3 px-6 text-center text-black hover:bg-primary hover:text-white w-full"
            >
              {navItem?.label}
            </Link>
          );
        })}
      </menu>
    </menu>
  );
};

export default Navbar;
