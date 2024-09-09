/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
const BookCard = ({ data }) => {
  console.log(data);
  
  return (
    <>
      <Link to={`/view-book-details/${data._id}`}>
        <div className="bg-zinc-700   p-4 flex flex-col rounded-lg shadow-md transform transition duration-100 hover:bg-zinc-500 hover:scale-105">
          <div className="bg-zinc-900 rounded flex items-center justify-center ">
            {" "}
            <img src={data.url} alt="/" className="h-[30vh] " />{" "}
          </div>
          <h2 className="mt-2 text-xl text-white font-semibold hover:text-blue-400">
            {data.title}
          </h2>
          <p className="mt-2 text-white font-semibold" >by{data.author}</p>
          <p className="mt-2 text-white font-semibold text-xl" >{data.price}</p>
          </div>{" "}
      </Link>
    </>
  );
};

export default BookCard;
