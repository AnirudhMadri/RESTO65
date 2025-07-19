"use client";

import React, { useState } from "react";
import LayoutCanvas from "@/components/layouts/layoutcanvas";
import TableLayout from "@/components/tablelayoutgrid/page";
import { supabase } from "@/utils/supabaseClient";

export default function Layout() {
  const [layouts, setLayouts] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);
  const [table, setTable] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [activeLayoutIdx, setActiveLayoutIdx] = useState(null);
  const [layoutInfo, setLayoutInfo] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState("idle"); // "idle" | "loading" | "done"

  return (
    <div>
      <p className="text-white text-2xl mb-3 bg-purple-500 rounded-sm p-5 font-black">
        Table and Floor Plan
      </p>
      <div className="w-full grid grid-cols-[20%_80%] bg-gray-100">
        <div className="rounded-sm p-4 mr-2 border-2 border-gray-300 h-full">
          <button
            onClick={() => {
              const nextNumber = layouts.length + 1;
              const newLayout = `Layout ${nextNumber}`;
              setLayouts([...layouts, newLayout]);
              setShowCanvas(true);
            }}
            className="text-black flex border-2 items-center gap-2 mt-3 rounded-sm w-full bg-blue-50 border-blue-600 font-bold p-4 hover:bg-blue-100 hover:cursor-pointer"
          >
            + Add New Layout
          </button>
          <hr className="w-[90%] border-t border-gray-300 mx-auto my-4" />

          <div className="border-2 border-gray-300 rounded-sm ">
            <p className="w-full text-sm bg-gray-200 overflow-hidden p-2 font-bold text-black">
              Layouts
            </p>
            <div className="w-full flex flex-col items-start justify-center">
              {layouts.map((layout, idx) => (
                <div key={idx} className="w-full">
                  <hr className="w-full border-t border-gray-300 mx-auto" />
                  <button
                    onClick={() =>
                      setActiveLayoutIdx(activeLayoutIdx === idx ? null : idx)
                    }
                    className="w-full text-left text-sm text-black font-bold p-2 hover:cursor-pointer"
                  >
                    {layout}
                  </button>

                  {activeLayoutIdx === idx && (
                    <div className="flex gap-2 font-medium px-2 pb-2">
                      <button className="text-xs bg-green-500 px-2 py-1 rounded">
                        Save
                      </button>
                      <button className="text-xs bg-yellow-500 px-2 py-1 rounded">
                        Edit
                      </button>
                      <button className="text-xs bg-red-500 px-2 py-1 rounded">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-md overflow-hidden border-2 border-gray-300 h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-gray-200">
            {activeLayoutIdx !== null ? (
              <>
                <p className="text-lg font-bold text-black">
                  {layouts[activeLayoutIdx]}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      if (activeLayoutIdx === null) return;

                      const layoutName = layouts[activeLayoutIdx];

                      const { error } = await supabase.from("layouts").insert([
                        {
                          name: layoutName,
                          tables: layoutInfo.length,
                          table_capacity: layoutInfo.map((t) => t.capacity),
                          table_location: layoutInfo.map((t) => t.position),
                        },
                      ]);

                      if (error) {
                        alert("Error saving layout: " + error.message);
                      } else {
                        alert("Layout saved to Supabase!");
                      }
                    }}
                    className="text-sm font-medium hover:cursor-pointer hover:bg-green-600 bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={async () => {
                      if (activeLayoutIdx === null) return;

                      setDeleteStatus("loading");

                      const layoutName = layouts[activeLayoutIdx];

                      const { error } = await supabase
                        .from("layouts")
                        .delete()
                        .eq("name", layoutName);

                      if (error) {
                        alert("Error deleting layout: " + error.message);
                        setDeleteStatus("idle");
                      } else {
                        // Update state
                        const updatedLayouts = [...layouts];
                        updatedLayouts.splice(activeLayoutIdx, 1);
                        setLayouts(updatedLayouts);
                        setActiveLayoutIdx(null);
                        setLayoutInfo([]);

                        setDeleteStatus("done");

                        // Show "Deleted" for 1 sec
                        setTimeout(() => {
                          setDeleteStatus("idle");
                        }, 1000);
                      }
                    }}
                    className="text-sm font-medium hover:cursor-pointer hover:bg-red-600 bg-red-500 text-white px-3 py-1 rounded"
                  >
                    {deleteStatus === "loading" ? (
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                    ) : deleteStatus === "done" ? (
                      "Deleted"
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-500 font-medium">No Layout Selected</p>
            )}
          </div>

          <div className=" h-full">
            {showCanvas ? (
              <TableLayout onTableUpdate={setLayoutInfo} />
            ) : (
              <p className="text-gray-600 font-bold">No Layout Loaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
