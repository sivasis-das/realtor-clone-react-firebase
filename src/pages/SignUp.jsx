import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  // const [notFilled, setNotFilled] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { name, email, password } = formData;

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
    // console.log("name is", name);
    // console.log("email is", email);
    // console.log("password is", password);
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      const user = userCredential.user;
      // console.log("user is :", user);
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.success("Sign up was successful");
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with the resgistration", {
        theme: "dark",
      });
      // console.log(error);
    }
  };

  return (
    <>
      <section className="relative top-24 m-0">
        <div className="flex justify-center">
          <div className="w-11/12 lg:w-9/12">
            <h1 className="text-center text-gray-400 font-bold text-xl uppercase ">Sign up</h1>
            <form action="" onSubmit={submitForm}>
              <div className="my-4">
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white transition ease-in duration-300 focus:ring-2 outline-none rounded mb-4"
                />
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
                <div className="flex justify-between mb-4">
                  <p className="text-gray-400">
                    Have an account?{" "}
                    <Link to="/sign-in" className="text-red-500 font-semibold">
                      Sign In
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

export default SignUp;
