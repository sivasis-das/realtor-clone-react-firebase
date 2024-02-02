import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { toast } from "react-toastify";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  // const [notFilled, setNotFilled] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // setNotFilled(false)
  };

  const submitForm = async (e) => {
    e.preventDefault();
    // if the user has not filled any input it will be red
    // if (email) {
    //   setNotFilled(true)
    // }
    // console.log("email is", email);
    // console.log("password is", password);
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Bad user credential");
    }
  };

  return (
    <>
      <section className="relative top-24 m-0">
        <div className="flex justify-center">
          <div className="w-11/12 lg:w-9/12">
            <h1 className="text-center text-xl uppercase ">Sign In</h1>
            <form action="" onSubmit={submitForm}>
              <div className="my-4">
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white transition ease-in duration-300 focus:ring-2 outline-none rounded mb-4"
                />
                <div className="">
                  <div className="relative w-full ">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full px-4 py-2 text-xl text-gray-700 bg-white transition ease-in duration-300 focus:ring-2 outline-none rounded mb-4"
                    />
                    {showPassword ? (
                      <FaEyeSlash
                        onClick={() => setShowPassword(!showPassword)}
                        className=" absolute top-3 right-2 cursor-pointer"
                      />
                    ) : (
                      <FaEye
                        onClick={() => setShowPassword(!showPassword)}
                        className=" absolute top-3 right-2 cursor-pointer"
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-between mb-4 whitespace-nowrap">
                  <p>
                    Don't have an account?{" "}
                    <Link to="/sign-up" className="text-red-500 font-semibold">
                      Sign Up
                    </Link>
                  </p>
                  <Link
                    to="/forgot-password"
                    className="text-blue-700 font-semibold"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 rounded text-white font-semibold w-full hover:bg-blue-800 active:bg-blue-950 shadow-md transition duration-200 ease-in h-11"
                >
                  SIGN IN
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

export default SignIn;
