import { ReactNode } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import "./_layout.scss";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <div className="main-content">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
