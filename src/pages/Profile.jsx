import { getAuth, signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";

function Profile() {
  const auth = getAuth();
  // console.log("auth1",auth);
  // console.log("auth on top",auth.currentUser);
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
  });
  const [changeDetail, setChangeDetail] = useState(false);
  const navigate = useNavigate();

  const { name, email } = formData;
  // console.log("auth", auth);
  // console.log("currentUser", auth.currentUser);
  // console.log("name", name);
  // console.log("email", email);

  const handleEdit = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const submitChange = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        console.log("currentUser", auth.currentUser);
        // update display name in the firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        console.log("new edit", formData);
        // update name in the firestore

        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name: name,
        });
      }
      toast.success("Profile details successfully updated");
    } catch (error) {
      toast.error("Couldn't change the profile detail");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
      toast.success("GoodBye");
    } catch (error) {
      toast.error("i can't let you go");
    }
  };
  return (
    <>
      <section className="flex flex-col items-center max-w-6xl mx-auto">
        <h1 className="text-3xl text-center text-gray-400 mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-1/2 mt-6 px-3">
          <form>
            {/* Name Input */}

            <input
              type="text"
              id="name"
              value={name}
              onChange={handleEdit}
              readOnly={!changeDetail}
              className={`w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out duration-300   outline-none mb-6 ${
                changeDetail ? "ring-2" : null
              }`}
            />

            <input
              type="email"
              id="email"
              value={email}
              readOnly
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded  outline-none mb-6 "
            />

            <div className="flex justify-between whitespace-nowrap mb-6">
              <p>
                Do want to change your name?{" "}
                <span
                  className="text-blue-700 font-semibold cursor-pointer"
                  onClick={(e) => {
                    changeDetail && submitChange();
                    setChangeDetail(!changeDetail);
                  }}
                >
                  {changeDetail ? "Save Edit" : "Edit"}
                </span>
              </p>
              <p
                onClick={handleSignOut}
                className="text-red-500 font-semibold cursor-pointer"
              >
                Sign Out
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default Profile;
