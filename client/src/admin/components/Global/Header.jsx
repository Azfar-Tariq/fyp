import { Fragment } from "react";
import { useState, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import { HiOutlineBell, HiSearch } from "react-icons/hi";
import classNames from "classnames";

export default function Header({ pageTitle }) {
  const [user, setUser] = useState(null);

  const get = async () => {
    try {
      const email = localStorage.getItem("email");

      if (!email) {
        console.error("Email not found in local storage");
        return;
      }

      const response = await fetch(
        `http://localhost:3001/admin-details?email=${email}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  useEffect(() => {
    get();
  }, []);

  return (
    <div className="bg-background sticky top-0 z-20 h-20 px-4 flex items-center justify-between">
      <h1 className="text-2xl text-white font-bold ml-2">{pageTitle}</h1>
      <div className="flex gap-4">
        <div className="flex items-center bg-primary px-4 p-2 rounded-lg">
          <HiSearch className="text-icon text-xl" />
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-1 bg-primary text-white rounded-lg focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3 mr-2">
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button
                  className={classNames(
                    open && "bg-primary",
                    "group bg-primary inline-flex p-3 items-center rounded-lg text-icon hover:bg-icon hover:text-primary transition ease-in-out duration-300 focus:outline-none"
                  )}
                >
                  <HiOutlineBell fontSize={24} />
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute right-0 z-10 mt-2.5 transform w-80">
                    <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                      <strong className="text-gray-700 font-medium">
                        Notifications
                      </strong>
                      <div className="mt-2 py-1 text-sm">
                        This is notification panel.
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
          <h3 className="text-center text-lg text-white font-medium leading-8">
            {user ? user.admin_name : "Loading..."}
          </h3>
        </div>
      </div>
    </div>
  );
}
