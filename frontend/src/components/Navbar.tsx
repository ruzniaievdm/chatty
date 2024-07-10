import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

export function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <nav className="bg-white border-gray-200 px-4 sm:px-6 py-2.5 rounded dark:bg-gray-800">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Chatty
            </span>
          </Link>
          <div className="hidden w-full md:block md:w-auto">
            <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
              {
                !user ? (
                  <li>
                    <Link to="/login" className="block py-2 pr-4 pl-3 text-white md:p-0 dark:text-white">
                      Login
                    </Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/search"
                        className="block py-2 pr-4 pl-3 text-white md:p-0 dark:text-white"
                        aria-current="page"
                      >
                        Search
                      </Link>
                    </li>
                    <b className="text-white">{user.username}</b>
                    <button className="block py-2 pr-4 pl-3 text-white md:p-0 dark:text-white" onClick={logout}>
                      Logout
                    </button>
                  </>
                )
              }
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}