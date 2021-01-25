import Footer from './Footer';
import Navbar from './Navbar';

function MainLayout({ children }) {
  return (
    <div className="w-screen h-screen overflow-x-hidden flex flex-col text-black">
      <Navbar />
      <div className="w-full flex-grow pt-16">{children}</div>
      <Footer />
    </div>
  );
}

export default MainLayout;
