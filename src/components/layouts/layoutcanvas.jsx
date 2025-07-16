"use client";
import { useState } from "react";
import Draggable from "react-draggable";

export default function LayoutCanvas() {
  const [tables, setTables] = useState([]);

  const addTable = () => {
    setTables([
      ...tables,
      {
        id: Date.now(),
        position: { x: 0, y: 0 },
      },
    ]);
  };

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <button
          onClick={addTable}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          ➕Add Table
        </button>
      </div>
      <div
        className="relative grow border border-gray-300"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage:
            "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
        }}
      >
        {tables.map((table) => (
          <Draggable
            key={table.id}
            grid={[40, 40]} // 👈 snap to 40px blocks
            defaultPosition={{ x: 0, y: 0 }}
          >
            <div className="absolute bg-blue-500 text-white w-20 h-20 flex items-center justify-center rounded-md shadow-md cursor-move">
              Table
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}
