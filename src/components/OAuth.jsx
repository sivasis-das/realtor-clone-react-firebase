import React from "react";
import { FcGoogle } from "react-icons/fc";
function OAuth() {
  return (
    <>
      <button
        type="submit"
        className="bg-red-700 rounded text-white font-semibold w-full hover:bg-red-800 active:bg-red-950 shadow-md transition duration-200 ease-in flex items-center justify-center gap-2 uppercase h-11"
      >
       <FcGoogle  className="bg-white rounded-full" /> Continue with Google
      </button>
    </>
  );
}

export default OAuth;
