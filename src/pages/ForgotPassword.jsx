import React, { useState } from "react";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import { toast } from "react-toastify";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

function ForgotPassword() {
  // const [notFilled, setNotFilled] = useState(false)
  const [email, setEmail] = useState("");

  const submitForm = async (e) => {
    e.preventDefault();
    // if the user has not filled any input it will be red
    // if (email) {
    //   setNotFilled(true)
    // }

    // console.log("email is", email);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email was sent");
    } catch (error) {
      toast.error("Could not send reset password");
    }
  };

  return (
    <>
      <section className="relative top-24 m-0">
        <div className="flex justify-center">
          <div className="w-11/12 lg:w-9/12">
            <h1 className="text-center text-xl uppercase ">
              FORGOT PASSWORD ?
            </h1>
            <form action="" onSubmit={submitForm}>
              <div className="my-4">
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white transition ease-in duration-300 focus:ring-2 outline-none rounded mb-4"
                />

                <div className="flex justify-between mb-4">
                  <p>
                    Don't have an account?{" "}
                    <Link to="/sign-up" className="text-red-500 font-semibold">
                      Sign Up
                    </Link>
                  </p>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 rounded text-white font-semibold w-full hover:bg-blue-800 active:bg-blue-950 shadow-md transition duration-200 ease-in h-11"
                >
                  SIGN UP
                </button>
                <div className="my-4 before:border-t before:border-gray-900 flex  before:flex-1 items-center after:border-t after:border-gray-900 after:flex-1">
                  <p className="text-center font-semibold mx-2">OR</p>
                </div>
                <OAuth />
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default ForgotPassword;
