import Link from "next/link";
import Navbrand from "./Navbrand";

function Navbar() {
  return (
    <div className="w-screen p-2 h-14 flex items-center justify-around shadow fixed z-10 opacity-100 bg-white">
      <Navbrand />
      <div className="flex space-x-10 text-green-700 font-medium">
        <Link href="/jobs">
          <a className="hover:font-bold">JOBS</a>
        </Link>
        <Link href="/login">
          <a className="hover:font-bold">LOG IN</a>
        </Link>
        <Link href="/signup">
          <a className="hover:font-bold">SIGN UP</a>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
