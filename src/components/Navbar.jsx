import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-50">
      <header className="flex justify-between px-3 items-start max-w-6xl mx-auto">
        <div className="self-center">
          <NavLink to='/'>
            <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="realtor logo"
            className="h-5 cursor-pointer"
          />
          </NavLink>
          
        </div>
        <div className="">
          <ul className="*:cursor-pointer py-3 text-sm font-semibold  text-gray-400  flex space-x-10">
            <li>
              <NavLink to='home' className={({isActive})=>`${isActive&&'border-b-4 border-b-red-500 text-black'} hover:border-b-red-500 hover:border-b-4 py-3`}>
                Home
              </NavLink>
              
              
            </li>
            <li>
            <NavLink to='offers' className={({isActive})=>`${isActive&&'border-b-4 border-b-red-500 text-black'} hover:border-b-red-500 hover:border-b-4 py-3`}>
                Offer
              </NavLink>
            </li>
            <li>
            <NavLink to='sign-in' className={({isActive})=>`${isActive&&'border-b-4 border-b-red-500 text-black'} hover:border-b-red-500 hover:border-b-4 py-3`}>
                Sign In
              </NavLink>
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
