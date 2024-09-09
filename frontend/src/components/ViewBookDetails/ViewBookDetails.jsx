/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import Loader from "../loader/loader";
import {GrLanguage} from "react-icons/gr";

const ViewBookDetails = () => {
  const {id}=useParams();
  const [Data, setData] = useState();
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
  }, []); 

  return (
    <>
      {Data ? (
        <div className="px-4 py-6 md:px-12 md:py-8 bg-zinc-900 flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="bg-zinc-800 rounded p-4 h-[60vh] md:h-[88vh] w-full md:w-1/2 flex items-center justify-center">
            <img src={Data.url} alt="/" className="h-3/4 md:h-[70vh] object-contain" />
          </div>
          <div className="p-4 w-full md:w-1/2">
            <h1 className="text-2xl md:text-4xl text-zinc-300 font-semibold">{Data.title}</h1>
            <p className="text-sm md:text-base text-zinc-400 mt-2">{Data.author}</p> 
            <p className="text-sm md:text-base text-zinc-400 mt-2">{Data.desc}</p> 
            <p className="flex items-center justify-start text-sm md:text-base text-zinc-400 mt-4">
              <GrLanguage className="mr-2 md:mr-3" /> {/* Use className */}
              {Data.language}
            </p>
            <p className="text-lg md:text-3xl text-zinc-100 font-semibold mt-4">
              Price: {Data.price}
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