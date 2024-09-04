/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
const BookCard = ({ data }) => {
  console.log(data);
  
  return (
    <>
      <Link>
        {" "}
        <div className="bg-zinc-700 rounded  p-4 flex flex-col ">
          <div className="bg-zinc-900 rounded flex items-center justify-center ">
            {" "}
            <img src={data.url} alt="/" className="h-[30vh]" />{" "}
          </div>
          <h2 className="mt-2 text-xl text-zinc-100 font-semibold">
            {data.title}
          </h2>
          <p className="mt-2 text-zinc-400 font-semibold" >by{data.author}</p>
          <p className="mt-2 text-zinc-400 font-semibold text-xl " >{data.price}</p>
          </div>{" "}
      </Link>
    </>
  );
};

export default BookCard;
