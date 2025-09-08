"use client";

import { useState } from "react";
import axios from "axios";
import Header from "@/components/header/page";
import Sidebar from "@/components/sidebar/page";
import Layout from "@/components/layouts/page";
import Menu from "@/components/menu/page";
import Orders from "@/components/orders/page";

export default function HomePage() {
  const [activeComponent, setActiveComponent] = useState("layouts");
  return (
    <div className="bg-white min-h-screen">
      {/* Header stays on top */}
      <Header />

      {/* Below header: main content area with grid */}
      <div className="grid grid-cols-[20%_80%] w-[90%] mx-auto h-screen mt-15">
        {/* Left Sidebar */}
        <div>
          <Sidebar setActiveComponent={setActiveComponent} />
        </div>

        {/* Right Content Area */}
        <div className=" mx-3 mt-5  ">
          {activeComponent === "layouts" ? (
            <Layout />
          ) : activeComponent === "menu" ? (
            <Menu />
          ) : activeComponent === "orders" ? (
            <Orders />
          ) : (
            <p className="text-black">No Layouts Added</p>
          )}
        </div>
      </div>
    </div>
  );
}
