import Navbrand from './Navbrand';

function Navbar() {
  return (
    <div className="w-full p-2 h-14 flex items-center justify-around shadow absolute opacity-100 bg-white">
      <Navbrand />
      <div className="flex space-x-10 text-green-700 font-medium">
        <a href="/" className="hover:font-bold">
          HOME
        </a>
        <a href="/search" className="hover:font-bold">
          JOBS
        </a>
        <a href="/login" className="hover:font-bold">
          LOG IN
        </a>
        <a href="/signup" className="hover:font-bold">
          SIGN UP
        </a>
      </div>
    </div>
  );
}

export default Navbar;
