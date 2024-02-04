import React, { useState } from "react";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function CreateListing() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    beds: 1,
    baths: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });

  const {
    type,
    name,
    beds,
    baths,
    parking,
    furnished,
    address,
    description,
    offer,
    price,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;

  const navigate = useNavigate();
  const auth = getAuth();
  const handleChange = (e) => {
    let boolean = null;
    if (e.target.value == "true") {
      boolean = true;
    }
    if (e.target.value == "false") {
      boolean = false;
    }
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: e.target.files,
      }));
    } else if (!e.target.files) {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: boolean ?? e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formadata", formData);
    setLoading(true);
    if (Number(discountedPrice) >= Number(regularPrice)) {
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("plz upload max of 6 images");
      return;
    }
    let geolocation = {};
    geolocation.lat = latitude;
    geolocation.log = longitude;

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        // refere upload files/images to firebase cloud docs
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const metadata = {
          contentType: `${image.type}`,
        };

        // const storageRef = ref(storage, "images/" + image.name);
        const storageRef = ref(storage, "images/" + filename);
        const uploadTask = uploadBytesResumable(storageRef, image, metadata);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case "storage/unauthorized":
                reject("User doesn't have permission to access the object");
                //
                break;
              case "storage/canceled":
                reject("User canceled the upload");
                //
                break;

              // ...

              case "storage/unknown":
                reject("Unknown error occurred, inspect error.serverResponse");
                //
                break;
            }
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ) //this here calls the storeImage and stores the images in the storage
      .catch((error) => {
        setLoading(false);
        toast.error("Images not uploaded");
        return;
      });

    //  console.log(imgUrls);
    // console.log("completed");

    // add the geoloaction & imgUrl to the formData --
    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };
    console.log("hey");
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    console.log("formDatacopy", formDataCopy);
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);

    setLoading(false);
    toast.success("Successfully Listed");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-md px-2 mx-auto">
      <div className="pb-6">
        <h1 className="text-2xl font-bold text-center text-gray-400 mt-6">
          Create a Listing
        </h1>
        <div>
          <form onSubmit={handleSubmit}>
            <h3 className="font-semibold mt-6">Sell / Rent</h3>
            <div className="flex gap-2 ">
              <input
                type="radio"
                name="type"
                id="sell"
                value="Sell"
                className="peer/sell hidden"
                onChange={handleChange}
                required
              />
              <label
                htmlFor="sell"
                className="peer-checked/sell:bg-gray-600 peer-checked/sell:text-white flex-1  rounded bg-white shadow-md text-center uppercase font-semibold p-2 "
              >
                Sell
              </label>
              <input
                type="radio"
                name="type"
                id="rent"
                value="Rent"
                className="peer/rent hidden "
                onChange={handleChange}
                required
              />
              <label
                htmlFor="rent"
                className="peer-checked/rent:bg-gray-600 peer-checked/rent:text-white flex-1 rounded bg-white shadow-md text-center uppercase font-semibold p-2 "
              >
                Rent
              </label>
            </div>
            <h3 className="font-semibold mt-6">Name</h3>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              className="w-full rounded shadow-md transition duration-300 ease-in-out focus:ring-2 outline-none p-2 placeholder:text-gray-500 invalid:border-pink-500 invalid:text-pink-600
              focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
              placeholder="Name"
              required
            />

            <div className="flex gap-6">
              <div className="w-20">
                <h3 className="font-semibold mt-6">Beds</h3>
                <input
                  type="number"
                  name="beds"
                  id="beds"
                  value={beds}
                  onChange={handleChange}
                  step={1}
                  min={1}
                  className="text-center shadow-md p-2 w-full transition duration-300 ease-in-out focus:ring-2 outline-none"
                  required
                />
              </div>
              <div className="w-20">
                <h3 className="font-semibold mt-6">Baths</h3>
                <input
                  type="number"
                  name="baths"
                  id="baths"
                  value={baths}
                  onChange={handleChange}
                  step={1}
                  min={1}
                  className="text-center shadow-md p-2 w-full transition duration-300 ease-in-out focus:ring-2 outline-none"
                  required
                />
              </div>
            </div>

            <h3 className="font-semibold mt-6">Parking spot</h3>
            <div className="flex gap-2 ">
              <input
                type="radio"
                name="parking"
                id="parkyes"
                value={true}
                className="peer/parkyes hidden"
                onChange={handleChange}
                required
              />
              <label
                htmlFor="parkyes"
                className="peer-checked/parkyes:bg-gray-600 peer-checked/parkyes:text-white flex-1  rounded bg-white shadow-md text-center uppercase font-semibold p-2"
              >
                yes
              </label>
              <input
                type="radio"
                name="parking"
                id="parkno"
                value={false}
                className="peer/parkno hidden"
                onChange={handleChange}
                required
              />
              <label
                htmlFor="parkno"
                className="peer-checked/parkno:bg-gray-600 peer-checked/parkno:text-white flex-1 rounded bg-white shadow-md text-center uppercase font-semibold p-2"
              >
                no
              </label>
            </div>

            <h3 className="font-semibold mt-6">Furnished</h3>
            <div className="flex gap-2 ">
              <input
                type="radio"
                name="furnished"
                id="furnishedyes"
                value={true}
                className="peer/furnishedyes hidden"
                onChange={handleChange}
                required
              />
              <label
                htmlFor="furnishedyes"
                className="peer-checked/furnishedyes:bg-gray-600 peer-checked/furnishedyes:text-white flex-1  rounded bg-white shadow-md text-center uppercase font-semibold p-2 "
              >
                yes
              </label>
              <input
                type="radio"
                name="furnished"
                id="furnishedno"
                value={false}
                className="peer/furnishedno hidden"
                onChange={handleChange}
                required
              />
              <label
                htmlFor="furnishedno"
                className="peer-checked/furnishedno:bg-gray-600 peer-checked/furnishedno:text-white flex-1 rounded bg-white shadow-md text-center uppercase font-semibold p-2"
              >
                no
              </label>
            </div>

            <h3 className="font-semibold mt-6">Address</h3>
            <textarea
              name="address"
              id="address"
              cols="30"
              rows="3"
              placeholder="Address"
              value={address}
              onChange={handleChange}
              className="w-full rounded shadow-md transition duration-300 ease-in-out focus:ring-2 outline-none p-2 placeholder:text-gray-500 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
              style={{ resize: "none" }}
              required
            ></textarea>

            {!geolocationEnabled && (
              <div className="flex gap-5">
                <div>
                  <h3 className="font-semibold mt-6">Latitude</h3>
                  <input
                    type="number"
                    name="latitude"
                    id="latitude"
                    value={latitude}
                    onChange={handleChange}
                    max={90}
                    min={-90}
                    className="text-center shadow-md p-2 w-full transition duration-300 ease-in-out focus:ring-2 outline-none"
                    required
                  />
                </div>
                <div>
                  <h3 className="font-semibold mt-6">Latitude</h3>
                  <input
                    type="number"
                    name="longitude"
                    id="longitude"
                    value={longitude}
                    onChange={handleChange}
                    max={180}
                    min={-180}
                    className="text-center shadow-md p-2 w-full transition duration-300 ease-in-out focus:ring-2 outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <h3 className="font-semibold mt-6">Description</h3>
            <textarea
              name="description"
              id="description"
              cols="30"
              rows="3"
              placeholder="Description"
              value={description}
              onChange={handleChange}
              className="w-full rounded shadow-md transition duration-300 ease-in-out focus:ring-2 outline-none p-2 placeholder:text-gray-500 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
              style={{ resize: "none" }}
              required
            ></textarea>

            <h3 className="font-semibold mt-6">Offer</h3>
            <div className="flex gap-2 ">
              <input
                type="radio"
                name="offer"
                id="offeryes"
                value={true}
                className="peer/offeryes hidden"
                onChange={handleChange}
                required
              />
              <label
                htmlFor="offeryes"
                className="peer-checked/offeryes:bg-gray-600 peer-checked/offeryes:text-white flex-1  rounded bg-white shadow-md text-center uppercase font-semibold p-2"
              >
                yes
              </label>
              <input
                type="radio"
                name="offer"
                id="offerno"
                value={false}
                className="peer/offerno hidden"
                onChange={handleChange}
                required
              />
              <label
                htmlFor="offerno"
                className="peer-checked/offerno:bg-gray-600 peer-checked/offerno:text-white flex-1 rounded bg-white shadow-md text-center uppercase font-semibold p-2"
              >
                no
              </label>
            </div>

            <h3 className="font-semibold mt-6">Regular Price</h3>
            <div>
              <input
                type="number"
                name="regularPrice"
                id="regular price"
                value={regularPrice}
                onChange={handleChange}
                step={1}
                min={1}
                className="text-center shadow-md p-2 w-full transition duration-300 ease-in-out focus:ring-2 outline-none"
                required
              />
              <p>$/Month</p>
            </div>
            {offer ? (
              <>
                <h3 className="font-semibold mt-6">Discounted Price</h3>
                <div>
                  <input
                    type="number"
                    name="discountedPrice"
                    id="discounted price"
                    value={discountedPrice}
                    onChange={handleChange}
                    step={1}
                    min={1}
                    className="text-center shadow-md p-2 w-full transition duration-300 ease-in-out focus:ring-2 outline-none"
                    required
                  />
                  <p>$/Month</p>
                </div>
              </>
            ) : null}

            <h3 className="font-semibold mt-6">Images</h3>
            <p>The first image will be the cover (max 6)</p>
            <div>
              <input
                type="file"
                name="images"
                id="images"
                accept=".jpg,.png,.jpeg"
                multiple
                onChange={handleChange}
                className="text-center shadow-md bg-white p-2 w-full transition duration-300 ease-in-out focus:ring-2 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 rounded text-white font-semibold w-full hover:bg-blue-800 active:bg-blue-950 shadow-md transition duration-200 ease-in h-11 uppercase flex items-center justify-center gap-3 mt-6"
            >
              create listing
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default CreateListing;
