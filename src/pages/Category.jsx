import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import ListingItems from "../components/ListingItems";
import { useParams } from "react-router-dom";

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListings, setLastFetchedListings] = useState(null);

  const { categoryName } = useParams();
  //   console.log("catregoryname",categoryName);

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", categoryName),
          orderBy("timestamp", "desc"),
          limit(8)
        );
        const querySnap = await getDocs(q);
        console.log("querySnap is:", querySnap);
        // important ------ keeping track of the last fetched document
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListings(lastVisible);

        const retrevedData = [];
        querySnap.forEach((doc) => {
          retrevedData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(retrevedData);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Could not fetch listing");
      }
    }
    fetchListings();
  }, [categoryName]);

  // here we are fetching documents starting from the last fetched document so new documents are fetched and they are spread with the previous fetched data------------
  async function onFetchMoreListings() {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("offer", "==", categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListings),
        limit(4)
      );
      const querySnap = await getDocs(q);
      console.log("querySnap is:", querySnap);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListings(lastVisible);
      const retrevedData = [];
      querySnap.forEach((doc) => {
        retrevedData.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prevData) => [...prevData, ...retrevedData]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Could not fetch listing");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6 font-bold mb-6">{categoryName == "rent" ? "Places for rent":"Places for sale"}</h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItems
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </main>
          {lastFetchedListings && (
            <div className="flex justify-center items-center">
              <button
                onClick={onFetchMoreListings}
                className="bg-white px-3 py-1.5 text-gray-700 border-gray-300 rounded-md mb-6 mt-6 shadow-md hover:shadow-lg hover:bg-gray-400 hover:text-white transition duration-500 ease-in-out"
              >
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Could not find new places for {categoryName=="rent"?"rent":"sale"}</p>
      )}
    </div>
  );
}

export default Category;
