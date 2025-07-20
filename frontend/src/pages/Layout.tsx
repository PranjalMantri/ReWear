import Navbar from "../components/Navbar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;
