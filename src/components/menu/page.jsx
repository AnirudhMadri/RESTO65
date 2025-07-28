"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function page() {
  const [category, setCategory] = useState("");
  const [showForm1, setShowForm1] = useState(false);
  const [showForm2, setShowForm2] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [dishes, setDishes] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if (category) {
      setLoading(true);
      const fetchDishes = async () => {
        const { data, error } = await supabase
          .from("menu")
          .select("*")
          .eq("category", category);
        if (!error) setDishes(data);
        else console.error("Error fetching menu: ", error);
        setLoading(false);
      };
      fetchDishes();
    }
  }, [category]);

  const handleAddItem = async () => {
    if (!name || !desc || !price || !type || !category) {
      alert("Please fill in all fields.");
      return;
    }
    const { data, error } = await supabase.from("menu").insert([
      {
        name: name,
        description: desc,
        price: price,
        type: type,
        category: category,
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      alert("Error adding item.");
    } else {
      alert("Item added!");
      // Optionally clear form:
      setName("");
      setDesc("");
      setPrice("");
      setType("");
      setShowForm1(false);
    }
  };

  const [categories, setCategories] = useState([
    { name: "South Indian" },
    { name: "Punjabi" },
    { name: "Chinese" },
    { name: "Italian" },
    { name: "Desserts" },
    { name: "Beverages" },
    { name: "Snacks" },
  ]);

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
              <button className="text-sm text-gray-100 mx-5 font-medium border-2 border-blue-700 hover:cursor-pointer  hover:bg-blue-600 bg-blue-500  px-3 py-1 rounded">
                Go to Weekly Specials
              </button>

              <button
                onClick={() => {
                  setShowForm2(true);
                }}
                className="text-sm mr-5 font-medium border-2 border-green-600 hover:cursor-pointer  hover:bg-green-500 bg-green-400 text-gray-50 px-3 py-1 rounded"
              >
                Add category
              </button>

              {showForm2 && (
                <div className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center">
                  <div className="w-72 bg-white rounded-md shadow-md border border-gray-300 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-200 px-4 py-2 border-b border-gray-300">
                      <p className="text-xl font-semibold text-gray-700">
                        Add New Category
                      </p>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Category Name
                      </label>
                      <input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        type="text"
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 p-1 text-black font-medium"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          if (newCategory.trim() !== "") {
                            setCategories([
                              ...categories,
                              { name: newCategory.trim() },
                            ]);
                            setNewCategory("");
                            setShowForm2(false);
                          }
                        }}
                        className="text-sm mr-5 mt-5 w-full font-medium border-2 border-blue-600 hover:cursor-pointer hover:bg-blue-500 bg-blue-400 text-gray-50 px-3 py-1 rounded"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm2(false)}
                        className="text-sm mr-5 mt-5 w-full font-medium border-2 border-red-600 hover:cursor-pointer hover:bg-red-500 bg-red-400 text-gray-50 px-3 py-1 rounded"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
              <p className="text-black text-2xl font-medium">
                {category || "Please select a category"}
              </p>

              {category && (
                <button
                  onClick={() => setShowForm1(true)}
                  className="text-sm mr-5 font-medium border-2 border-green-600 hover:cursor-pointer  hover:bg-green-500 bg-green-400 text-gray-50 px-3 py-1 rounded"
                >
                  Add item
                </button>
              )}

              {showForm1 && (
                <div className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center">
                  <div className="w-72 bg-white rounded-md shadow-md border border-gray-300 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-200 px-4 py-2 border-b border-gray-300">
                      <p className="text-xl font-semibold text-gray-700">
                        New {category} item
                      </p>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Name
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 p-1 text-black font-medium"
                      />
                      <label className="text-sm font-medium text-gray-700 mt-3 block">
                        Description
                      </label>
                      <input
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        type="textarea"
                        className="w-full border-b border-gray-300 text-black font-medium focus:outline-none focus:border-blue-500 p-1"
                      />
                      <label className="text-sm font-medium text-gray-700 mt-3 block">
                        Price
                      </label>
                      <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        type="text"
                        className="w-full border-b text-black font-medium border-gray-300 focus:outline-none focus:border-blue-500 p-1"
                      />

                      <div className="flex gap-4 mt-5">
                        <label className="flex items-center font-medium gap-2 text-gray-700">
                          <input
                            type="radio"
                            name="type"
                            value="veg"
                            checked={type === "veg"}
                            onChange={(e) => setType(e.target.value)}
                            className="accent-green-600"
                          />
                          Veg
                        </label>
                        <label className="flex items-center font-medium gap-2 text-gray-700">
                          <input
                            type="radio"
                            name="type"
                            value="nonveg"
                            checked={type === "nonveg"}
                            onChange={(e) => setType(e.target.value)}
                            className="accent-red-600"
                          />
                          Non-Veg
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await handleAddItem(); // Wait for the item to be added
                          setShowForm1(false); // Then close the form
                        }}
                        className="text-sm mr-5 mt-5 w-full font-medium border-2 border-blue-600 hover:cursor-pointer  hover:bg-blue-500 bg-blue-400 text-gray-50 px-3 py-1 rounded"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm1(false); // Then close the form
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
            <div className="p-4">
              {category ? (
                loading ? (
                  <p className="text-black text-center">Loading dishes…</p>
                ) : (
                  dishes.map((dish, index) => (
                    <div
                      key={dish.id}
                      className="mb-4 rounded cursor-pointer bg-white  "
                      onClick={() =>
                        setExpanded(expanded === index ? null : index)
                      }
                    >
                      <h2 className="text-lg text-black font-bold">
                        {dish.name}
                      </h2>
                      <hr className="w-full mx-auto border-gray-400 my-4" />

                      {expanded === index && (
                        <div className="mt-2">
                          <p className="my-2 font-medium text-lg text-black">
                            {dish.description}
                          </p>
                          <p className="text-black font-semibold">
                            Price: ₹{dish.price}
                          </p>
                          <p className="text-black mt-2 font-semibold">
                            {dish.type === "veg" ? "🟢 Veg" : "🔴 Non-Veg"}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )
              ) : (
                <p className="text-gray-500 text-center">Select a category.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
