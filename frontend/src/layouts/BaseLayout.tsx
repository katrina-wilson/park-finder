import { Outlet } from "react-router";

function BaseLayout() {
  return (
    <div className="tw:flex tw:flex-col tw:h-screen tw:w-full">
      <main className="tw:flex tw:grow tw:h-full tw:w-full tw:overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default BaseLayout;