import { Outlet } from "react-router-dom";

const Content = () => {
  return (
    <div className="min-w-0 flex-1 bg-slate-50 px-3 py-4 dark:bg-[#2d2d30] sm:px-6 sm:py-5 lg:px-8">
      <div className="mx-auto flex w-full min-w-0 max-w-full flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default Content;
