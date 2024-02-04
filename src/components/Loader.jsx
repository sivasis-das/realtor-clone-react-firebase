import React from "react";
import loader from "../assets/svg/loader.svg";
function Loader() {
  return (
    <div className="w-12">
      <div>
        <img src={loader} alt="loading" />
      </div>
    </div>
  );
}

export default Loader;
