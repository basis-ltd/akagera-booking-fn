import React, { useState } from 'react';
import { toggleSidebar } from '../../states/features/sidebarSlice';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import akageraLogo from '/akagera_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookmark,
  faChartLine,
  faChartSimple,
  faChevronCircleLeft,
  faChevronCircleRight,
  faDashboard,
  faFileContract,
  faUserGroup,
  faGear,
  faChevronDown,
  faChevronUp,
  faDollarSign,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { isOpen } = useSelector((state: RootState) => state.sidebar);
  const { user } = useSelector((state: RootState) => state.user);
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);

  // LOCATION
  const { pathname } = useLocation();

  // SIDEBAR LINKS
  const sidebarLinks = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: faChartLine,
      role: 'admin',
    },
    {
      label: 'Booking calendar',
      path: '/dashboard/bookings/activities',
      icon: faBookmark,
    },
    {
      label: 'Bookings/Registrations',
      path: '/dashboard/bookings',
      icon: faChartSimple,
      role: 'receptionist',
    },
    {
      label: 'Users',
      path: '/dashboard/users',
      icon: faUserGroup,
      role: 'admin',
    },
    {
      label: 'Activities',
      path: '/dashboard/activities',
      icon: faDashboard,
      role: 'admin',
    },
    {
      label: 'Settings',
      path: '#',
      icon: faGear,
      role: 'admin',
      subcategories: [
        {
          label: 'Terms & Conditions',
          path: '/dashboard/terms-of-services',
          icon: faFileContract,
        },
        {
          label: 'Exchange rates',
          path: '/dashboard/exchange-rates',
          icon: faDollarSign,
        },
      ],
    },
  ];

  return (
    <aside
      className={`h-[100vh] fixed ${
        isOpen ? 'w-[20vw]' : 'w-[5vw]'
      } bg-gray-100 transition-all ease-in-out duration-300 z-50 flex flex-col gap-6 py-4`}
    >
      <figure
        className={`flex items-center gap-3 justify-between pr-4 p-4 ${
          !isOpen && 'flex-col pr-0 gap-6'
        }`}
      >
        <Link to={`/`}>
          <img
            src={akageraLogo}
            className={`${isOpen ? 'w-[50%]' : 'w-full'} h-auto`}
          />
        </Link>
        <FontAwesomeIcon
          icon={isOpen ? faChevronCircleLeft : faChevronCircleRight}
          className="text-lg cursor-pointer text-black hover:scale-[1.02]"
          onClick={(e) => {
            e.preventDefault();
            dispatch(toggleSidebar(!isOpen));
          }}
        />
      </figure>
      <menu className="flex flex-col gap-2">
        {sidebarLinks.map((link, index) => {
          if (link?.role === 'admin' && user?.role !== 'admin') return null;
          return (
            <React.Fragment key={index}>
              <Link
                to={link.path}
                className={`${isOpen ? 'justify-start' : 'justify-center'} ${
                  pathname === link?.path && 'bg-primary text-white'
                } flex items-center gap-3 p-4 px-8 hover:bg-primary hover:text-white transition-all ease-in-out duration-300 w-full`}
                onClick={(e) => {
                  if (link.subcategories) {
                    e.preventDefault();
                    setSettingsIsOpen(!settingsIsOpen);
                  }
                }}
              >
                <FontAwesomeIcon icon={link?.icon} />
                <p className={`text-[14px] ${!isOpen && 'hidden'}`}>
                  {link?.label}
                </p>
                {link.subcategories && isOpen && (
                  <FontAwesomeIcon
                    icon={settingsIsOpen ? faChevronUp : faChevronDown}
                    className="ml-auto"
                  />
                )}
              </Link>
              {link.subcategories && isOpen && settingsIsOpen && (
                <ul className="px-2">
                  {link.subcategories.map((sub, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        to={sub.path}
                        className={`flex items-center gap-3 p-4 px-8 hover:bg-primary hover:text-white transition-all ease-in-out duration-300 w-full ${
                          pathname === sub.path && 'bg-primary text-white'
                        }`}
                      >
                        <FontAwesomeIcon icon={sub.icon} />
                        <p className="text-[14px]">{sub.label}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </React.Fragment>
          );
        })}
      </menu>
    </aside>
  );
};

export default Sidebar;
