import { ReactNode } from "react";
import Header from "./Header";
import "./_layout.scss";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
