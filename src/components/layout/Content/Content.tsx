import { Outlet } from "react-router-dom";

const Content = () => {
  return (
    <div className="flex-1 bg-slate-50 px-4 py-5 dark:bg-[#111116] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-full flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default Content;
