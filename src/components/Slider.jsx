import React, { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { register } from "swiper/element/bundle";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { EffectFade } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

register();

function Slider() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
        const querySnap = await getDocs(q);

        let retrevedData = [];
        querySnap.forEach((doc) => {
          return retrevedData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(retrevedData);
        setLoading(false);
        console.log("retreveed Data", retrevedData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  console.log("listings", listings);
  if (loading) {
    return (
      <>
        <Spinner />
      </>
    );
  }
  if (listings.length === 0) {
    return <></>;
  }
  return (
    listings && (
      <>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade]}
          slidesPerView={1}
          // navigation
          // pagination={{ type: "progressbar" }}
          effect="fade"
          autoplay={{ delay: 15000 }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                className="relative w-full overflow-hidden h-[500px]"
                style={{
                  background: `url(${data?.imgUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              >
                <div className="  absolute flex flex-col items-center justify-center left-0 right-0 top-0 bottom-0">
                  <div className="mb-14">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl text-white font-bold text-center">
                      The #1 site real eastate <br />
                      professionals trust*
                    </h1>
                  </div>
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    onClick={(e) => e.stopPropagation()}
                    className="w-10/12 md:w-1/2  bg-white overflow-hidden rounded-3xl relative p-2"
                  >
                    <input
                      type="text"
                      placeholder="Address, School, City, Zip or Neighborhood"
                      className=" w-full outline-none  pl-3  text-2xl font-light  placeholder:text-wrap"
                    />
                    <div className="bg-gray-400 cursor-pointer p-3 rounded-full absolute right-1 top-1 hover:bg-gray-600">
                      <FaSearch className="text-white" />
                    </div>
                  </form>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}

export default Slider;
