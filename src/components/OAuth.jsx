import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const navigate = useNavigate()

  const onGoogleClick = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log("user info",user ); 

      // check for user

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        await setDoc(docRef,{
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        })
      }
      navigate('/')
    } catch (error) {
      toast.error("Could not authorize with Google");
      console.log(error);
    
    
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={onGoogleClick}
        className="bg-red-700 rounded text-white font-semibold w-full hover:bg-red-800 active:bg-red-950 shadow-md transition duration-200 ease-in flex items-center justify-center gap-2 uppercase h-11"
      >
        <FcGoogle className="bg-white rounded-full" /> Continue with Google
      </button>
    </>
  );
}

export default OAuth;
