/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../loader/loader";
import { GrLanguage } from "react-icons/gr";

const ViewBookDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3100/api/v1/get-book-by-id/${id}`
        );
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]); 

  return (
    <>
      {data ? (
        <div className="px-4 py-6 md:px-12 md:py-8 bg-gradient-to-r from-black to-gray-700 flex flex-col md:flex-row gap-6 md:gap-8 rounded-lg shadow-lg ">
          <div className="bg-zinc-800 rounded-lg overflow-hidden shadow-md h-[60vh] md:h-[70vh] w-full md:w-1/2 flex items-center justify-center">
            <img
              src={data.url}
              alt={data.title}
              className="h-full w-auto object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="p-6 w-full md:w-1/2 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl text-white font-bold hover:underline">{data.title}</h1>
            <p className="text-lg md:text-xl text-zinc-300 mt-2 italic">{data.author}</p> 
            <p className="text-sm md:text-base text-zinc-200 mt-4">{data.desc}</p> 
            <p className="flex items-center justify-start text-sm md:text-base text-zinc-200 mt-4">
              <GrLanguage className="mr-2 md:mr-3 text-blue-400" />
              {data.language}
            </p>
            <p className="text-lg md:text-2xl text-white font-semibold mt-4">
              Price: <span className="text-yellow-400">{data.price}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="h-screen bg-zinc-900 flex items-center justify-center">
          <Loader />
        </div>
      )}
    </>
  );
};

export default ViewBookDetails;
