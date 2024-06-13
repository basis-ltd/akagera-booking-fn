import { useEffect, useState } from 'react';
import akageraLogo from '/public/akagera_logo.webp';

type NavbarProps = {
  className?: string;
};

const Navbar = ({ className }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const heroSectionHeight = (
        document.querySelector('.hero-section') as HTMLElement
      ).offsetHeight;
      setIsScrolled(offset > Number(heroSectionHeight - 50));
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`${
        isScrolled ? 'text-black bg-white' : 'text-white'
      } flex items-center h-[10vh] w-[100%] mx-auto px-[7.5%] bg-transparent fixed py-6 z-[1000] ${className}`}
    >
      <figure className="h-[8vh] w-auto">
        <img className="text-white h-full w-auto" src={akageraLogo} />
      </figure>
    </header>
  );
};

export default Navbar;
