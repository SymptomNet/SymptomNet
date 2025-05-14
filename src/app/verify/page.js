"use client"

import { useState } from "react";
import { motion } from "motion/react"

import Sidebar from "@/components/Sidebar";

export default function Verify() {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#040c07]
    justify-center items-center">
      <div className="flex flex-row p-5 space-x-5 w-full h-[95%] items-center">
        <Sidebar />
        <div className="flex flex-row w-full h-full space-x-5">
          <div className="flex flex-col items-start w-full pt-2 px-5">
            <div className="font-bold text-4xl">Verify</div>
            <div className="py-4">Verify records made by other doctors, and get rewarded.</div>
          </div>
        </div>
      </div>
    </div>
  );
}