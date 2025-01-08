import { ReactNode } from "react";
import "./_layout.scss";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <div className="main-content">{children}</div>
    </div>
  );
};

export default Layout;
