import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import LoginUserModal from "./LoginUserModal";
import LoginAdminModal from "./LoginAdminModal";

import RegisterUserModal from "./RegisterUserModal";

const navigation = [
  { name: "Beranda", href: "/", current: false },
  { name: "Tentang", href: "/about", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation();
  const [isLoginUserModalOpen, setIsLoginUserModalOpen] = useState(false);
  const [isLoginAdminModalOpen, setIsLoginAdminModalOpen] = useState(false);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Update current status berdasarkan location
  const updatedNavigation = navigation.map((item) => ({
    ...item,
    current: location.pathname === item.href,
  }));

  return (
    <>
      <Disclosure as="nav" className="bg-white sticky top-0 z-40 shadow-lg">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-end sm:justify-between sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/" className=" ml-3 text-xl font-bold text-blue-600">
                      Pengaduan Masyarakat
                    </Link>
                  </div>
                  <div className="hidden w-full sm:ml-6 sm:block">
                    <div className="flex justify-end space-x-3 w-full">
                      {updatedNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-blue-500 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <button
                        onClick={() => setIsLoginUserModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />

      <LoginAdminModal
        isOpen={isLoginAdminModalOpen}
        closeModal={() => setIsLoginAdminModalOpen(false)}
        openUserModal={() => {
          setIsLoginAdminModalOpen(false);
          setIsLoginUserModalOpen(true);
        }}
        openRegisterModal={() => {
          setIsLoginAdminModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
                        </svg>
                        <span>Login</span>
                      </button>
                      <button
                        onClick={() => setIsLoginAdminModalOpen(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                        <span>Login Admin</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {updatedNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-blue-500 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
                <button
                    onClick={() => setIsLoginUserModalOpen(true)}
                    className="bg-blue-600 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
                  >
                    Masuk sebagai Pengguna
                  </button>
                  <button
                    onClick={() => setIsLoginAdminModalOpen(true)}
                    className="bg-red-600 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-red-700 transition-colors mt-2"
                  >
                    Masuk sebagai Admin
                  </button>

              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Modals */}
      <LoginUserModal
        isOpen={isLoginUserModalOpen}
        closeModal={() => setIsLoginUserModalOpen(false)}
        openRegisterModal={() => {
          setIsLoginUserModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
        openAdminModal={() => {
          setIsLoginUserModalOpen(false);
          setIsLoginAdminModalOpen(true);
        }}

      />



      <RegisterUserModal
        isOpen={isRegisterModalOpen}
        closeModal={() => setIsRegisterModalOpen(false)}
        openLoginModal={() => {
          setIsRegisterModalOpen(false);
          setIsLoginUserModalOpen(true);
        }}

      />
    </>
  );
}
