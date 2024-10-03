/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "./../BookCard/BookCard";
import Loader from "../loader/loader";

const RecentlyAdded = () => {
  const [Data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3100/api/v1/get-recent-books");
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="mt-8 px-4">
      <h4 className="text-3xl text-yellow-100 font-semibold text-center mb-6">Recently Added Books</h4>
      {!Data ? (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Data.map((items, i) => (
            <div key={i} className="transform transition-transform duration-300 hover:scale-105">
              <BookCard data={items} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyAdded;
