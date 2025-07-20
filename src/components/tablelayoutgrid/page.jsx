"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  useDraggable,
} from "@dnd-kit/core";

const DraggableTable = ({
  id,
  position,
  capacity,
  onClick,
  removeTable,
  isSelected,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const x = (transform?.x ?? 0) + position.x;
  const y = (transform?.y ?? 0) + position.y;

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeTable(id);
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(id);
  };

  return (
    <div
      ref={setNodeRef}
      className={`absolute w-20 h-20 p-2 text-white rounded flex flex-col items-center justify-center shadow cursor-move relative text-xs ${
        isSelected ? "bg-purple-700 ring-2 ring-yellow-400" : "bg-purple-500"
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      {...attributes}
      {...listeners}
    >
      {/* Click area for selection */}
      <div
        onClick={handleClick}
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        <span>{id}</span>
        <span>Cap: {capacity}</span>
      </div>

      {/* Remove button */}
      <div
        onMouseDown={handleRemove}
        onClick={handleRemove}
        onPointerDown={handleRemove}
        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white w-5 h-5 text-xs flex items-center justify-center rounded-full shadow cursor-pointer z-10"
        style={{ pointerEvents: "auto" }}
      >
        ✕
      </div>
    </div>
  );
};

export default function DraggableGridWithMemory({
  onTableUpdate,
  initialTables,
}) {
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  useEffect(() => {
    if (onTableUpdate) {
      onTableUpdate(tables);
    }
  }, [tables, onTableUpdate]);
  useEffect(() => {
    if (initialTables) {
      setTables(initialTables);
    }
  }, [initialTables]);

  // Configure mouse sensor to require a minimum distance before dragging starts
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    })
  );

  const removeTable = (idToRemove) => {
    setTables((prevTables) =>
      prevTables.filter((table) => table.id !== idToRemove)
    );
    if (selectedTableId === idToRemove) {
      setSelectedTableId(null);
    }
  };

  const addTable = () => {
    const newTable = {
      id: `Table ${tables.length + 1}`,
      position: { x: 300, y: 200 },
      capacity: 0,
    };
    setTables((prev) => [...prev, newTable]);
  };

  const handleClickTable = (id) => {
    setSelectedTableId(id);
  };

  const setCapacity = () => {
    const cap = prompt("Enter capacity:");
    if (cap === null) return;
    const parsedCap = parseInt(cap) || 0;
    setTables((prev) =>
      prev.map((table) =>
        table.id === selectedTableId ? { ...table, capacity: parsedCap } : table
      )
    );
  };

  const GRID_SIZE = 40;
  const snapToGrid = (x, y) => ({
    x: Math.round(x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(y / GRID_SIZE) * GRID_SIZE,
  });

  const handleDragEnd = (event) => {
    const { delta, active } = event;

    setTables((prevTables) =>
      prevTables.map((table) => {
        if (table.id === active.id) {
          const newX = table.position.x + delta.x;
          const newY = table.position.y + delta.y;
          const snapped = snapToGrid(newX, newY);
          return {
            ...table,
            position: snapped,
          };
        }
        return table;
      })
    );
  };

  const selectedTable = tables.find((t) => t.id === selectedTableId);

  return (
    <div className="w-full h-screen p-4">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={addTable}
          className="bg-purple-600 text-white font-medium px-4 py-2 rounded hover:bg-purple-700"
        >
          + Add Table
        </button>

        {selectedTable && (
          <div className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-2 rounded">
            <p className="font-medium text-black mr-5">
              {selectedTable.id} | Capacity: {selectedTable.capacity}
            </p>
            <button
              onClick={setCapacity}
              className="px-4 py-2 hover:cursor-pointer font-medium bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Set Capacity
            </button>
            <button
              onClick={() => {
                removeTable(selectedTable.id);
              }}
              className="px-4 py-2 hover:cursor-pointer font-medium bg-red-600 text-white rounded text-xs hover:bg-red-700"
            >
              Delete table
            </button>
          </div>
        )}
      </div>

      <div
        className="relative w-full h-full border rounded-lg cursor-crosshair"
        style={{
          height: "calc(100vh - 120px)",
          backgroundSize: "40px 40px",
          backgroundImage:
            "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
        }}
      >
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          {tables.map((table) => (
            <DraggableTable
              key={table.id}
              id={table.id}
              position={table.position}
              capacity={table.capacity}
              onClick={handleClickTable}
              removeTable={removeTable}
              isSelected={selectedTableId === table.id}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}
