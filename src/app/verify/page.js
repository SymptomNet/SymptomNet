"use client"

import { useState } from "react";
import { motion } from "motion/react"

import Sidebar from "@/components/Sidebar";

const exampleShort = {
  id: 1,
  date: new Date(),
  illness: 'Covid-19',
  verify_percentage: 50,
  status: 'Pending',
}

const exampleLong = {

  id: 1,
  date: new Date(),
  verify_percentage: 50,
  status: 'Pending',

  patient: {
    age: 69,
    gender: 'M',
    country: 'Malaysia',
    race: 'Chinese',
    admission_date: new Date(),
    discharge_date: new Date(),
    status: 'Recovered'
  },
  illness: {
    name: "Covid-19",
    symptoms: [
      "Cough", "Sore Throat", "Fever"
    ]
  },
  treatment: [
    "Given ibuprofen 500mg"
  ],
  hospital: {
    name: "Subang Jaya Medical Centre",
    country: 'Malaysia',
    state: 'Selangor',
  },
}

export default function Verify() {

  return (
    <div className="flex flex-col h-screen w-screen bg-[#040c07]
    justify-center items-center">
      <div className="flex flex-row p-5 space-x-5 w-full h-[95%] items-center">
        <Sidebar />
        <div className="flex flex-col w-full h-full space-x-5 ">
          <div className="flex flex-col items-start w-full pt-2 px-5">
            <div className="font-bold text-4xl">Verify</div>
            <div className="py-4">Verify records made by other doctors, and get rewarded.</div>
          </div>
          <div className="w-full h-100 bg-white/5 rounded-xl mx-5">
            NIgga!
          </div>
        </div>
      </div>
    </div>
  );
}