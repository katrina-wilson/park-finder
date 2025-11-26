import { Outlet } from "react-router";
import TopNav from '../components/TopNav';

function Layout() {
  return (
    <div className="tw:flex tw:flex-col tw:h-screen tw:w-full">
      <TopNav />
      <main className="tw:flex tw:grow tw:h-full tw:w-full tw:overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;