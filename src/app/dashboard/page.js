"use client"

import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#040c07]
    justify-center items-center">
      <div className="flex flex-row p-5 space-x-5 w-full h-[95%] items-center">
        <Sidebar />
        <div className="flex flex-row w-full space-x-5 bg-amber-200">
          <div>
            records
          </div>
          <div>

          </div>
          a
        </div>
      </div>
    </div>
  );
}