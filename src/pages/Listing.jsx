import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { register } from "swiper/element/bundle";
// import Swiper from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import "swiper/css/bundle";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { EffectFade } from "swiper/modules";
import { FaLocationDot } from "react-icons/fa6";
import { FaBed } from "react-icons/fa";
import { FaBath } from "react-icons/fa";
import { FaParking } from "react-icons/fa";
import { MdOutlineChair } from "react-icons/md";

register();
function Listing() {
  const swiperElRef = useRef(null);
  const { listingId } = useParams();
  console.log("listingId", listingId);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", listingId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        setListing(docSnapshot.data());
        setLoading(false);
      }
    }

    fetchListing();
  }, [listingId]);
  console.log("listing 2", listing?.discountedPrice);
  console.log("listing 3", listing?.regularPrice);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade]}
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[500px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5">
        <div className=" w-full">
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {listing.name}- $
            {listing.offer
              ? listing.discountedPrice
                  ?.toString()
                  ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type == "Rent" && "/month"}
          </p>
          <div className="flex items-center gap-2 mb-3">
            <FaLocationDot className="text-green-700" />
            <p className="font-bold text-lg">{listing.address}</p>
          </div>
          <div className="mb-3 flex gap-3 ">
            <p className="p-1 bg-red-700 rounded-md px-6 w-fit text-white font-semibold">
              For {listing.type}
            </p>
            {listing.offer && (
              <p className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">
                $
                {Number(listing.regularPrice) - Number(listing.discountedPrice)}{" "}
                discount
              </p>
            )}
          </div>

          <div className="mb-3">
            <p>
              <span className="font-semibold">Description</span> -{" "}
              {listing.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 mb-3">
            <div>
              {listing.beds && (
                <div className="flex items-center space-x-1">
                  <FaBed />
                  <p className="font-bold">
                    {listing.beds > 1 ? `${listing.beds} Beds` : "1 Bed"}
                  </p>
                </div>
              )}
            </div>
            <div>
              {listing.baths && (
                <div className="flex items-center space-x-1">
                  <FaBath />
                  <p className="font-bold">
                    {Number(listing.beds) > 1
                      ? `${Number(listing.beds)} Baths`
                      : "1 Bath"}
                  </p>
                </div>
              )}
            </div>
            <div>
              {listing.parking && (
                <div className="flex items-center space-x-1">
                  <FaParking />
                  <p className="font-bold">Parking Spot</p>
                </div>
              )}
            </div>
            <div>
              {listing.furnished && (
                <div className="flex items-center space-x-1">
                  <MdOutlineChair />
                  <p className="font-bold">Furnished</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-blue-300 w-full h-20 "></div>
      </div>
    </main>
  );
}

export default Listing;
