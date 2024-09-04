/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import BookCard from "./../BookCard/BookCard";
import loader from "../loader/loader";

const RecentlyAdded = () => {
  const [Data, setData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3100/api/v1/get-recent-books"
        );
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="mt-8 px-4 ">
      <h4 className=" text-3xl text-yellow-100">  Recently Added Books </h4>
      <div className="my-8   grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 ">
        {Data && <loader/>}
        {Data &&
          Data.map((items, i) => (
            <div key={i}>
              <BookCard data={items} />
              {""}
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecentlyAdded;
