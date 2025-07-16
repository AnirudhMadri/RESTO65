"use client";

import React, { useState } from "react";
import LayoutCanvas from "@/components/layouts/layoutcanvas";
import TableLayout from "@/components/tablelayoutgrid/page";

export default function Layout() {
  const [layouts, setLayouts] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);
  const [table, setTable] = useState([]);
  return (
    <div>
      <p className="text-white text-2xl mb-3 bg-purple-500 rounded-sm p-5 font-black">
        Table and Floor Plan
      </p>
      <div className="w-full grid grid-cols-[20%_80%] bg-gray-100">
        <div className="rounded-sm p-4 mr-2 border-2 border-gray-300 h-full">
          <button
            onClick={() => setShowCanvas(true)}
            className="text-black flex items-center gap-2 mt-3 rounded-sm w-full bg-gray-100 border-purple-200 font-bold p-4 hover:bg-gray-200 hover:cursor-pointer"
          >
            Add New Layout
          </button>
          <hr className="w-[90%] border-t border-gray-300 mx-auto my-1" />
        </div>
        <div className="rounded-sm  border-2 border-gray-300 h-full">
          <div className=" h-full">
            {showCanvas ? (
              <TableLayout />
            ) : (
              <p className="text-gray-600">No Layout Loaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
