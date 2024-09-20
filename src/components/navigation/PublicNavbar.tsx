import { Link, useNavigate } from 'react-router-dom';
import akageraLogo from '/public/akagera_logo.webp';
import Button from '../inputs/Button';
import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { useState } from 'react';

type PublicNavbarProps = {
  className?: string;
  hideActions?: boolean;
};

const PublicNavbar = ({ className, hideActions }: PublicNavbarProps) => {
  // NAVIGATION
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav
      className={`bg-white flex items-center justify-between h-[9vh] w-full px-4 sm:px-[7.5%] fixed py-6 z-[1000] ${className}`}
    >
      <Link
        to={'#'}
        onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}
        className="h-[8vh] w-auto"
        aria-label="Go to homepage"
      >
        <img className="h-full w-auto" src={akageraLogo} alt="Akagera Logo" />
      </Link>
      <ul className="hidden sm:flex items-center gap-4">
        {!hideActions &&
          (!user && !token ? (
            <li>
              <Button primary route={'/auth/login'}>
                Login
              </Button>
            </li>
          ) : (
            <li>
              <Button primary route={'/dashboard'}>
                Dashboard
              </Button>
            </li>
          ))}
      </ul>
      <button
        className="sm:hidden"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        {/* Hamburger Icon */}
        <span className="block w-6 h-1 bg-black mb-1"></span>
        <span className="block w-6 h-1 bg-black mb-1"></span>
        <span className="block w-6 h-1 bg-black"></span>
      </button>
      {isMenuOpen && (
        <nav className="sm:hidden absolute top-[9vh] right-0 w-full bg-white shadow-lg p-4">
          <ul>
            {!user && !token ? (
              <li>
                <Button primary route={'/auth/login'} onClick={toggleMenu}>
                  Login
                </Button>
              </li>
            ) : (
              <li>
                <Button primary route={'/dashboard'} onClick={toggleMenu}>
                  Dashboard
                </Button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </nav>
  );
};

export default PublicNavbar;
