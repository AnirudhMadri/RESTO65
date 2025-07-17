"use client";

import { useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  useDraggable,
} from "@dnd-kit/core";

const DraggableTable = ({ id, position, removeTable }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const x = (transform?.x ?? 0) + position.x;
  const y = (transform?.y ?? 0) + position.y;

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeTable(id);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="absolute w-20 h-20 bg-purple-500 text-white rounded flex items-center justify-center shadow cursor-move"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <button
        onMouseDown={handleRemove}
        onClick={handleRemove}
        onPointerDown={handleRemove}
        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white w-5 h-5 text-xs flex items-center justify-center rounded-full shadow cursor-pointer z-10"
        style={{ pointerEvents: "auto" }}
      >
        ✕
      </button>
      Table
    </div>
  );
};

export default function DraggableGridWithMemory() {
  const [tables, setTables] = useState([]);

  const sensors = useSensors(useSensor(MouseSensor));

  const removeTable = (idToRemove) => {
    setTables((prevTables) =>
      prevTables.filter((table) => table.id !== idToRemove)
    );
  };

  const addTable = () => {
    const newTable = {
      id: `table-${Date.now()}`,
      position: { x: 300, y: 200 },
    };
    setTables((prev) => [...prev, newTable]);
  };

  const GRID_SIZE = 40;

  const snapToGrid = (x, y) => {
    return {
      x: Math.round(x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(y / GRID_SIZE) * GRID_SIZE,
    };
  };

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

  return (
    <div className="w-full h-screen p-4">
      <button
        onClick={addTable}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        ➕ Add Table
      </button>

      <div
        className="relative w-full h-full mt-4 border rounded-lg cursor-crosshair"
        style={{
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
              removeTable={removeTable}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}
