"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
// Mock supabase client - replace with your actual import

export default function Layout() {
  const [layouts, setLayouts] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);
  const [table, setTable] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [activeLayoutIdx, setActiveLayoutIdx] = useState(null);
  const [layoutInfo, setLayoutInfo] = useState([]);
  const [loadedLayout, setLoadedLayout] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState("idle");
  const [initialTables, setInitialTables] = useState([]);
  const [layoutData, setLayoutData] = useState([]);
  const [tables, setTables] = useState([]);
  const [mode, setMode] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [completedOrders, setCompletedOrders] = useState([]);

  const [tableStatuses, setTableStatuses] = useState(
    Object.fromEntries(tables.map((t) => [t.id, "free"]))
  );
  const [tableWaiters, setTableWaiters] = useState(
    Object.fromEntries(tables.map((t) => [t.id, ""])) // 👈 default empty waiter
  );
  const handleWaiterChange = (tableId, name) => {
    setTableWaiters((prev) => ({ ...prev, [tableId]: name }));
  };

  const handleStatusChange = (tableId, newStatus) => {
    setTableStatuses((prev) => ({
      ...prev,
      [tableId]: newStatus,
    }));
  };

  const getBgColor = (status) => {
    switch (status) {
      case "free":
        return "bg-green-200";
      case "served":
        return "bg-blue-200";
      case "preparing":
        return "bg-yellow-200";
      default:
        return "bg-green-200";
    }
  };

  const fetchLayoutData = async () => {
    const { data, error } = await supabase
      .from("layouts")
      .select("name, tables, table_location, table_id, table_capacity");
    if (error) {
      console.error("Error fetching layouts:", error.message);
    }
    console.log(data);

    if (!data || data.length === 0) {
      console.warn("No layouts found");
      return;
    }

    // take first row
    const layout = data[0];

    const parsedLayout = {
      name: layout.name,
      tables: Number(layout.tables),
      table_location: JSON.parse(layout.table_location),
      table_id: JSON.parse(layout.table_id),
      table_capacity: JSON.parse(layout.table_capacity),
    };
    setTables(
      parsedLayout.table_location.map((loc, idx) => ({
        id: parsedLayout.table_id[idx],
        capacity: parsedLayout.table_capacity[idx],
        x: loc.x,
        y: loc.y,
      }))
    );

    console.log("Parsed Layout:", parsedLayout);
  };
  const handleMode = () => {
    setMode(!mode);
  };

  const fetchMenu = async () => {
    const { data, error } = await supabase
      .from("menu")
      .select("name, category, price");
    if (error) {
      console.error("Error fetching menu:", error.message);
      return;
    }

    const grouped = data.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
    setMenuItems(grouped);
  };

  return (
    <div>
      <p className="text-white text-2xl mb-3 bg-purple-500 rounded-sm p-5 font-black">
        Orders
      </p>
      <div className="w-full grid grid-cols-[20%_80%] ">
        <div className="rounded-sm mr-4 h-full">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={mode}
              onChange={handleMode}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-md text-black font-bold">
              {mode ? "Layout Mode" : "Tabular Mode"}
            </span>
          </label>

          <p className="my-2 text-black text-lg font-bold ">
            Load tables here:
          </p>
          <hr className="w-[90%] border-t border-gray-300 mx-auto mt-3" />

          <button
            onClick={fetchLayoutData}
            className="text-black flex border-2 items-center gap-2 mt-3 rounded-sm w-full bg-yellow-50 border-yellow-600 font-bold p-4 hover:bg-yellow-100 hover:cursor-pointer"
          >
            Load tables
          </button>
        </div>

        <div className="rounded-md overflow-hidden border-2 border-gray-300 h-full">
          <div className="grid grid-cols-5 p-0 m-0">
            {tables.map((table, idx) => (
              <div
                key={idx}
                onClick={() => {
                  fetchMenu();
                  setSelectedTable(table);
                  setShowOrderForm(true);
                }}
                className={`aspect-square border border-gray-300 flex items-center justify-center cursor-pointer ${getBgColor(
                  tableStatuses[table.id]
                )}`}
              >
                <div className="text-black font-bold text-xs text-center">
                  <div className="text-sm">{table.id}</div>
                  <div className="text-xs opacity-80">{table.capacity}</div>
                  {tableWaiters[table.id] && (
                    <div className="text-xs italic mt-1">
                      {tableWaiters[table.id]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div>
            {showOrderForm && selectedTable && (
              <div className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center">
                <div className="w-72 bg-white rounded-md shadow-md border border-gray-300 overflow-hidden">
                  {/* Header */}
                  <div
                    className={`px-4 py-2 border-b border-gray-300 ${getBgColor(
                      tableStatuses[selectedTable.id]
                    )}`}
                  >
                    <p className="text-xl font-semibold text-gray-700">
                      New order for {selectedTable.id}
                    </p>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      No. of customers
                    </label>
                    <input
                      type="number"
                      defaultValue={1}
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 p-1 text-black font-medium"
                    />
                    <label className="text-sm font-medium text-gray-700 mt-3 block">
                      Order Item
                    </label>
                    <select
                      value={selectedItem?.name || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Find the item inside menuItems
                        let foundItem = null;
                        Object.values(menuItems).forEach((items) => {
                          const match = items.find(
                            (item) => item.name === value
                          );
                          if (match) foundItem = match;
                        });
                        setSelectedItem(foundItem);
                      }}
                      className="text-sm text-black mx-2 mb-3 font-medium border-2 hover:cursor-pointer px-3 py-1 rounded"
                    >
                      <option value="">Select Item</option>

                      {Object.entries(menuItems).map(([category, items]) => (
                        <optgroup key={category} label={category}>
                          {items.map((item, idx) => (
                            <option key={idx} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <label className="text-sm font-medium text-gray-700 mt-3 block">
                      Set Table Status
                    </label>
                    <select
                      value={tableStatuses[selectedTable.id] || ""}
                      onChange={(e) =>
                        handleStatusChange(selectedTable.id, e.target.value)
                      }
                      className="text-sm text-black mx-2 mb-3 font-medium border-2 hover:cursor-pointer px-3 py-1 rounded"
                    >
                      <option value="">Select Status</option>
                      <option value="preparing">Preparing</option>
                      <option value="served">Served</option>
                      <option value="free">Free</option>
                    </select>

                    <label className="text-sm font-medium text-gray-700 mt-3 block">
                      Set Waiting Time
                    </label>
                    <input
                      type="text"
                      className="w-full border-b text-black font-medium border-gray-300 focus:outline-none focus:border-blue-500 p-1"
                    />
                    <label className="text-sm font-medium text-gray-700 mt-3 block">
                      Waiter Name
                    </label>
                    <input
                      type="text"
                      placeholder="Waiter Name"
                      value={tableWaiters[selectedTable.id] || ""}
                      onChange={(e) =>
                        handleWaiterChange(selectedTable.id, e.target.value)
                      }
                      className="w-full border-b text-black font-medium border-gray-300 focus:outline-none focus:border-blue-500 p-1"
                    />
                    <label className="text-sm font-medium text-gray-700 mt-3 block">
                      Quantity
                    </label>
                    <input
                      type="number"
                      defaultValue={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full border-b text-black font-medium border-gray-300 focus:outline-none focus:border-blue-500 p-1"
                    />
                    <label className="text-sm font-medium text-gray-700 mt-3 block">
                      Price
                    </label>
                    <input
                      type="number"
                      value={selectedItem ? selectedItem.price * quantity : 0}
                      readOnly
                      className="w-full border-b text-black font-medium border-gray-300 focus:outline-none focus:border-blue-500 p-1"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedTable || !selectedItem) return;

                        const newOrder = {
                          tableId: selectedTable.id,
                          waiterName: tableWaiters[selectedTable.id] || "",
                          status: tableStatuses[selectedTable.id] || "free",
                          item: selectedItem.name,
                          price: selectedItem.price * quantity,
                          quantity: quantity,
                          time: new Date().toLocaleTimeString(),
                        };

                        setOrders((prev) => [...prev, newOrder]); // append to orders array
                        setShowOrderForm(false); // close form after adding
                        console.log(orders);
                      }}
                      className="text-sm mr-5 mt-5 w-full font-medium border-2 border-blue-600 hover:cursor-pointer  hover:bg-blue-500 bg-blue-400 text-gray-50 px-3 py-1 rounded"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowOrderForm(false); // Then close the form
                      }}
                      className="text-sm mr-5 mt-5 w-full font-medium border-2 border-red-600 hover:cursor-pointer  hover:bg-red-500 bg-red-400 text-gray-50 px-3 py-1 rounded"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 w-full p-4">
            {/* Left - Current Orders */}
            <div className="bg-white border-2 border-gray-300 rounded p-4">
              <h2 className="text-lg font-bold text-gray-700 mb-2">
                Current Orders
              </h2>
              {/* Current orders content goes here */}
              {orders.length === 0 ? (
                <p className="text-gray-500 text-sm">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        setExpandedOrder(expandedOrder === idx ? null : idx)
                      }
                      className="border border-gray-300 rounded-lg p-3 bg-gray-50 cursor-pointer"
                    >
                      <p className="font-semibold text-gray-700">
                        {order.tableId} — {order.item} × {order.quantity}
                      </p>

                      <p className="text-sm text-gray-600">
                        Total: ₹{order.price}
                      </p>
                      <p className="text-sm text-gray-400">
                        Time: {order.time}
                      </p>

                      {expandedOrder === idx && (
                        <button
                          type="button"
                          onClick={() => {
                            setCompletedOrders((prev) => [...prev, order]);
                            setOrders((prev) =>
                              prev.filter((_, i) => i !== idx)
                            );
                            setExpandedOrder(null);
                          }}
                          className="text-sm mr-5 mt-5 w-full font-medium border-2 border-blue-600 hover:cursor-pointer  hover:bg-blue-500 bg-blue-400 text-gray-50 px-3 py-1 rounded"
                        >
                          Mark as Complete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Completed Orders */}
            <div className="bg-white border-2 border-gray-300 rounded p-4">
              <h2 className="text-lg font-bold text-gray-700 mb-2">
                Completed Orders
              </h2>
              {completedOrders.length === 0 ? (
                <p className="text-gray-500 text-sm">No completed orders.</p>
              ) : (
                <div className="space-y-3">
                  {completedOrders.map((order, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-300 rounded-lg p-3 bg-green-50"
                    >
                      <p className="font-semibold text-gray-700">
                        {order.tableId} — {order.item} × {order.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Waiter: {order.waiterName || "—"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: ₹{order.price}
                      </p>
                      <p className="text-xs text-gray-400">
                        Completed at: {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {/* Completed orders content goes here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
