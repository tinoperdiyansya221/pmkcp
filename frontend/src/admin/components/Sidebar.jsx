import { NavLink, useNavigate } from "react-router-dom";
import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { authAPI } from "../../services/api";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  // Auto-close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsOpen(false) // Close mobile overlay when switching to desktop
      }
    }

    // Listen for window resize
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setIsOpen]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/admin/login");
    }
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: HomeIcon,
    },
    {
      name: "Laporan",
      href: "/admin/laporan",
      icon: DocumentTextIcon,
    },
    {
      name: "Pengguna",
      href: "/admin/users",
      icon: UsersIcon,
    },
    {
      name: "Statistik",
      href: "/admin/stats",
      icon: ChartBarIcon,
    },
  ];

  const SidebarContent = ({ isCollapsed = false }) => (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-700">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1
            className={`text-white font-bold transition-all duration-300 ${
              isCollapsed ? "text-lg" : "text-xl"
            }`}
          >
            {isCollapsed ? "AP" : "Admin Panel"}
          </h1>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "text-red-100 hover:bg-blue-700"
                }`
              }
              onClick={() => setIsOpen && setIsOpen(false)}
              title={isCollapsed ? item.name : ""}
            >
              <item.icon
                className={`flex-shrink-0 h-6 w-6 text-white transition-all duration-200 ${
                  isCollapsed ? "mr-0" : "mr-3"
                }`}
                aria-hidden="true"
              />
              <span
                className={`transition-all duration-200 ${
                  isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                }`}
              >
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex-shrink-0 flex bg-red-700 p-4">
        <button
          onClick={handleLogout}
          className="flex-shrink-0 w-full group block"
          title={isCollapsed ? "Logout" : ""}
        >
          <div className="flex items-center">
            <div>
              <ArrowRightOnRectangleIcon
                className={`inline-block h-6 w-6 text-red-300 group-hover:text-red-100 transition-all duration-200 ${
                  isCollapsed ? "mr-0" : ""
                }`}
              />
            </div>
            <div
              className={`ml-3 transition-all duration-200 ${
                isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              }`}
            >
              <p className="text-sm font-medium text-red-100 group-hover:text-white">
                Logout
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 md:hidden"
          onClose={setIsOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarContent isCollapsed={false} />
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop - always visible and expanded */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:z-30 md:w-64">
        <SidebarContent isCollapsed={false} />
      </div>
    </>
  );
}
