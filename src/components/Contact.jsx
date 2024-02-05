import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";

function Contact({ userRef, listing }) {
  const [landLord, setLandLord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getLandlord() {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandLord(docSnap.data());
      } else {
        toast.error("couldn't get landlord data");
      }
    }
    getLandlord();
  }, [userRef]);

  return (
    <div>
      <p>
        Contact {landLord?.name} for the {listing.name.toLowerCase()}
      </p>
      <textarea
        name="message"
        id="message"
        cols="30"
        rows="3"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        placeholder="Message..."
        className="w-full rounded shadow-md transition duration-300 ease-in-out focus:ring-2 outline-none border-2 p-2 resize-none placeholder:text-gray-500 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
        required
      ></textarea>
      <a
        href={`mailto:${landLord?.email}?subject=${listing.name}&body=${message}`}
      >
        <button className="bg-blue-600 rounded text-white font-semibold w-full hover:bg-blue-800 active:bg-blue-950 shadow-md transition duration-200 ease-in h-11 uppercase">
          Send Message
        </button>
      </a>
    </div>
  );
}

export default Contact;
