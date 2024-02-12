import React, { useEffect, useState } from "react";
import Slider from "../components/Slider";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import ListingItems from "../components/ListingItems";

function Home() {
  const [offerListings, setOfferListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  const [sellListings, setSellListings] = useState(null);

  // offers
  useEffect(() => {
    async function fetchOfferListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // execute the query
        const querySnap = await getDocs(q);
        const retrevedData = [];
        querySnap.forEach((doc) => {
          return retrevedData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListings(retrevedData);
        // console.log("querySnap is",querySnap);
        // console.log("retrevedData is",retrevedData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();
  }, []);

  // Places for rent
  useEffect(() => {
    async function fetchRentListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create query
        const q = query(
          listingsRef,
          where("type", "==", "Rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // execute the query
        const querySnap = await getDocs(q);
        const retrevedData = [];
        querySnap.forEach((doc) => {
          return retrevedData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListings(retrevedData);
        // console.log("querySnap is",querySnap);
        // console.log("retrevedData for rent is", retrevedData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRentListings();
  }, []);
  // Places for sell
  useEffect(() => {
    async function fetchSellListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create query
        const q = query(
          listingsRef,
          where("type", "==", "Sell"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // execute the query
        const querySnap = await getDocs(q);
        const retrevedData = [];
        querySnap.forEach((doc) => {
          return retrevedData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSellListings(retrevedData);
        // console.log("querySnap is",querySnap);
        // console.log("retrevedData for sell is", retrevedData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSellListings();
  }, []);

  return (
    <>
      <div>
        <Slider />
        <div className="max-w-6xl mx-auto pt-4 space-y-6">
          {offerListings && offerListings.length > 0 ? (
            <>
              <div className="m-2 mb-6">
                <h2 className="px-3 text-2xl mt-6 font-semibold">
                  Recent Offers
                </h2>
                <Link to="/offers">
                  <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                    Show more offers
                  </p>
                </Link>
                <ul className="sm:grid sm:grid-cols-2  lg:grid-cols-4">
                  {offerListings.map((listings) => (
                    <ListingItems
                      key={listings.id}
                      listing={listings.data}
                      id={listings.id}
                    />
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <Loader />
            </>
          )}
          {rentListings && rentListings.length > 0 ? (
            <>
              <div className="m-2 mb-6">
                <h2 className="px-3 text-2xl mt-6 font-semibold">
                  Places for rent
                </h2>
                <Link to="/offers">
                  <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                    Show more places for rent
                  </p>
                </Link>
                <ul className="sm:grid sm:grid-cols-2  lg:grid-cols-4">
                  {rentListings.map((listings) => (
                    <ListingItems
                      key={listings.id}
                      listing={listings.data}
                      id={listings.id}
                    />
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <Loader />
            </>
          )}
          {sellListings && sellListings.length > 0 ? (
            <>
              <div className="m-2 mb-6">
                <h2 className="px-3 text-2xl mt-6 font-semibold">
                  Places for sell
                </h2>
                <Link to="/offers">
                  <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                    Show more places for sell
                  </p>
                </Link>
                <ul className="sm:grid sm:grid-cols-2  lg:grid-cols-4">
                  {sellListings.map((listings) => (
                    <ListingItems
                      key={listings.id}
                      listing={listings.data}
                      id={listings.id}
                    />
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <Loader />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
