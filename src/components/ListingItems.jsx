import { formatDistanceToNow } from "date-fns";
import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

function ListingItems({ listing, id, onDelete, onEdit }) {
  //  toDate() is a firebase methode to convert the seconds timestamp to date object
  const date = listing.timestamp.toDate(); //output-- Sun Feb 04 2024 11:42:55 GMT+0530

  const timePeriod = formatDistanceToNow(date); //output---about 5 hours

  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-2">
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <img
          src={listing.imgUrls[0]}
          alt="house image"
          loading="lazy"
          className=" resize w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
        />
        <p className="absolute top-2 left-2 bg-blue-600 text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg">
          {timePeriod} ago{" "}
        </p>
        <div className="w-full p-[10px]">
          <div className="flex items-center space-x-1">
            <FaLocationDot className="h-4 w-4 text-green-600" />
            <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">
              {listing.address}
            </p>
          </div>
          <p className="font-semibold text-xl truncate">{listing.name}</p>
          <p className="text-blue-500 mt-2 font-semibold">
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type == "rent" && "/month"}
          </p>
          <div className="flex items-center mt-[10px] space-x-3">
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {listing.beds > 1 ? `${listing.beds} Bedrooms` : "1 Bedroom"}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {listing.baths > 1
                  ? `${listing.baths} Bathrooms`
                  : "1 Bathroom"}
              </p>
            </div>
          </div>
        </div>
      </Link>
      {onEdit && (
        <MdModeEdit
          onClick={() => onEdit(id)}
          className="absolute bottom-2 right-8 cursor-pointer text-gray-400 hover:text-blue-600"
          size={20}
        />
      )}
      {onDelete && (
        <FaTrash
          onClick={() => onDelete(id)}
          className="absolute bottom-2 right-2 cursor-pointer text-gray-400 hover:text-red-600"
        />
      )}
    </li>
  );
}

export default ListingItems;
