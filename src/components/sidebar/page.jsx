"use client";

import { FaChair, FaTable, FaListAlt, FaMoneyBill } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import React from "react";

export default function Sidebar({ setActiveComponent }) {
  return (
    <div>
      <div className="flex flex-col my-5 py-4 text-black items-center justify-center rounded-lg border border-gray-300">
        <button
          type="button"
          onClick={() => setActiveComponent("layouts")}
          className="flex items-center gap-2 rounded-sm  border-2 w-[90%] bg-gray-100 border-purple-200 font-bold p-4 hover:bg-gray-200 hover:cursor-pointer"
        >
          <FaTable className="text-3xl text-purple-500 " />
          Table and Floor Plan
        </button>

        <button
          onClick={() => setActiveComponent("orders")}
          className="flex items-center gap-2 mt-3 rounded-sm border-2 w-[90%] bg-gray-100 border-purple-200 font-bold p-4 hover:bg-gray-200 hover:cursor-pointer"
        >
          <FaChair className="text-3xl text-purple-500 " />
          Orders
        </button>

        <button className="flex items-center gap-2 mt-3 rounded-sm border-2 w-[90%] bg-gray-100 border-purple-200 font-bold p-4 hover:bg-gray-200 hover:cursor-pointer">
          <FaPeopleGroup className="text-3xl text-purple-500 " />
          Staff
        </button>

        <button
          onClick={() => setActiveComponent("menu")}
          className="flex items-center gap-2 mt-3 rounded-sm border-2 w-[90%] bg-gray-100 border-purple-200 font-bold p-4 hover:bg-gray-200 hover:cursor-pointer"
        >
          <FaListAlt className="text-3xl text-purple-500 " />
          Menu
        </button>

        <button className="flex items-center gap-2 mt-3 rounded-sm border-2 w-[90%] bg-gray-100 border-purple-200 font-bold p-4 hover:bg-gray-200 hover:cursor-pointer">
          <FaMoneyBill className="text-3xl text-purple-500 " />
          Payments
        </button>
      </div>
    </div>
  );
}
