import Navbar from "./Navbar";

function MainLayout({ children }) {
  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <Navbar />
      <div className="w-full flex-grow h-full pt-16">{children}</div>
    </div>
  );
}

export default MainLayout;
