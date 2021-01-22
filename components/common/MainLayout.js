import Footer from './Footer';
import Navbar from './Navbar';

function MainLayout({ children }) {
  return (
    <div className="w-screen h-screen overflow-x-hidden text-black">
      <Navbar />
      <div className="w-full flex-grow h-full pt-16">{children}</div>
      <Footer />
    </div>
  );
}

export default MainLayout;
