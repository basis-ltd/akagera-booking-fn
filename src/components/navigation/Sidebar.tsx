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
  faBug,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isOpen } = useSelector((state: RootState) => state.sidebar);
  const { user } = useSelector((state: RootState) => state.user);
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const { pathname } = useLocation();

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
    {
      label: 'Logs',
      path: '/dashboard/logs',
      icon: faBug,
      role: 'admin',
    }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-100 ease-in-out duration-300 z-[10000] flex flex-col gap-6 py-4 overflow-y-auto ${
        isOpen
          ? 'w-[60vw] md:w-[40vw] lg:w-[20vw] max-w-full'
          : 'w-[70px] overflow-x-hidden'
      }`}
    >
      {/* Logo and Toggle Button */}
      <figure
        className={`flex items-center gap-3 justify-between px-4 py-4 ${
          !isOpen && 'flex-col gap-6'
        }`}
      >
        <Link to={`/`}>
          <img
            src={akageraLogo}
            className={`transition-all ${
              isOpen ? 'w-[50%] sm:w-[40%] md:w-[30%]' : 'w-[40px]'
            } h-auto`}
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

      {/* Sidebar Links */}
      <menu className="flex flex-col gap-2 w-full">
        {sidebarLinks.map((link, index) => {
          if (link?.role === 'admin' && user?.role !== 'admin') return null;
          return (
            <React.Fragment key={index}>
              <Link
                to={link.path}
                className={`${
                  isOpen ? 'justify-start' : 'justify-center'
                } flex items-center py-3 gap-3 px-4 w-full text-left hover:bg-primary hover:text-white transition-all ease-in-out ${
                  pathname === link?.path ? 'bg-primary text-white' : ''
                }`}
                onClick={(e) => {
                  if (link.subcategories) {
                    e.preventDefault();
                    setSettingsIsOpen(!settingsIsOpen);
                  }
                }}
              >
                <FontAwesomeIcon icon={link?.icon} />
                <p className={`text-sm ${!isOpen && 'hidden'}`}>
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
                <ul className="w-[90%] mx-auto space-y-1">
                  {link.subcategories.map((sub, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        to={sub.path}
                        className={`flex items-center gap-3 p-2 hover:bg-primary hover:text-white ease-in-out ${
                          pathname === sub.path ? 'bg-primary text-white' : ''
                        }`}
                      >
                        <FontAwesomeIcon icon={sub.icon} />
                        <p className="text-sm">{sub.label}</p>
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
