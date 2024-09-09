/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useEffect } from "react";
import axios from 'axios'
import Loader from '../components/loader/loader'
import BookCard from '../components/BookCard/BookCard'

const AllBooks = () => {
  const [Data, setData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3100/api/v1/get-all-books"
        );
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="bg-zinc-900 h-auto px-12 py-8">
      {" "}
      <h4 className=" text-3xl text-yellow-100">  All AllBooks   </h4>
    {!Data && (
      <div>
        <Loader/>{" "}
      </div>)}
    <div className="my-8   grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 ">
      {Data &&
        Data.map((items, i) => (
          <div key={i}>
            <BookCard data={items} />{" "}
          </div>
        ))}
    </div></div>
  )
}

export default AllBooks