"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function page() {
  const [category, setCategory] = useState("");
  const categories = [
    { name: "South Indian" },
    { name: "Punjabi" },
    { name: "Chinese" },
    { name: "Italian" },
    { name: "Desserts" },
    { name: "Beverages" },
    { name: "Snacks" },
  ];

  return (
    <div>
      <p className="text-white text-2xl mb-3 bg-purple-500 rounded-sm p-5 font-black">
        Menu
      </p>
      <div className="w-full grid grid-cols-[20%_80%]">
        <div className="rounded-md overflow-hidden border-2 border-gray-300">
          <div className="flex items-center justify-between p-3 border-b border-gray-300 bg-gray-200">
            <p className="text-gray-500 text-2xl font-medium">Item</p>
          </div>
          <p className="text-gray-500 my-3 px-4 font-medium">Name</p>
          <hr className="w-[90%] my-2 mx-auto border-gray-300" />

          <p className="text-gray-500 my-3 px-4 font-medium">Description</p>
          <hr className="w-[90%] my-2 mx-auto border-gray-300" />

          <p className="text-gray-500 my-3 px-4 font-medium">Price</p>
          <hr className="w-[90%] my-2 border-gray-300 mx-auto" />

          <button className="text-sm font-medium hover:cursor-pointer m-2 hover:bg-blue-600 bg-blue-500 text-white px-3 py-1 rounded">
            Edit
          </button>
          <button className="text-sm font-medium hover:cursor-pointer hover:bg-red-600 bg-red-500 text-white px-3 py-1 rounded">
            Remove
          </button>
        </div>
        <div className="h-full mx-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-2xl mr-3 font-medium">Categories</p>
            </div>

            <div>
              <button className="text-sm mx-5 font-medium border-2 border-blue-300 hover:cursor-pointer  hover:bg-blue-600 bg-blue-700 text-white px-3 py-1 rounded">
                Go to Weekly Specials
              </button>

              <button className="text-sm mr-5 font-medium border-2 border-green-300 hover:cursor-pointer  hover:bg-green-700 bg-green-600 text-white px-3 py-1 rounded">
                Add item
              </button>
            </div>
          </div>

          <hr className="w-full my-2  border-gray-300" />
          <div className="flex flex-row flex-wrap my-4">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => setCategory(cat.name)}
                className="text-sm mx-5 font-medium border-2 border-blue-900 hover:cursor-pointer hover:bg-blue-950 bg-blue-900 text-white px-3 py-1 rounded"
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="rounded-md overflow-hidden border-2 border-gray-300">
            <div className="flex items-center justify-between p-3 border-b border-gray-300 bg-gray-200">
              <p className="text-gray-500 text-2xl font-medium">
                {category || "Please select a category"}
              </p>
            </div>
            <p className="text-gray-500 my-3 px-4 font-medium">Name</p>
            <hr className="w-[90%] my-2 mx-auto border-gray-300" />

            <p className="text-gray-500 my-3 px-4 font-medium">Description</p>
            <hr className="w-[90%] my-2 mx-auto border-gray-300" />

            <p className="text-gray-500 my-3 px-4 font-medium">Price</p>
            <hr className="w-[90%] my-2 border-gray-300 mx-auto" />

            <button className="text-sm font-medium hover:cursor-pointer m-2 hover:bg-blue-600 bg-blue-500 text-white px-3 py-1 rounded">
              Edit
            </button>
            <button className="text-sm font-medium hover:cursor-pointer hover:bg-red-600 bg-red-500 text-white px-3 py-1 rounded">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
