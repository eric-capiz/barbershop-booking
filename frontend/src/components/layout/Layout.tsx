import { ReactNode } from "react";
import Header from "./Header";
import "./_layout.scss";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <div className="main-content">{children}</div>
    </div>
  );
};

export default Layout;
