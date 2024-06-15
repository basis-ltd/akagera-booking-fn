import akageraLogo from '/public/akagera_logo.webp';

type NavbarProps = {
  className?: string;
};

const Navbar = ({ className }: NavbarProps) => {

  return (
    <header
      className={`bg-white flex items-center h-[10vh] w-[100%] mx-auto px-[7.5%] bg-transparent fixed py-6 z-[1000] ${className}`}
    >
      <figure className="h-[8vh] w-auto">
        <img className="text-white h-full w-auto" src={akageraLogo} />
      </figure>
    </header>
  );
};

export default Navbar;
