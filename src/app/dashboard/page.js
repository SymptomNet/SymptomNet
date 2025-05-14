"use client"

import { useState } from "react";
import { motion } from "motion/react"

import Sidebar from "@/components/Sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";

function RecordEntry({ date, illness, verify_percentage, status}) {

  const datestring = date.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })

  return (
    <div className="w-full h-12 grid grid-cols-5 place-items-center rounded-md
    hover:bg-white/5 transition-colors">
      <div className="col-span-1">{datestring}</div>
      <div className="col-span-2">{illness}</div>
      <div className="col-span-1">{verify_percentage}%</div>
      <div className="col-span-1">{status}</div>
    </div>
  );

}


function RecordTable() {

  const [records, setRecords] = useState([
    {
      id: 1,
      date: new Date(),
      illness: 'Covid-19',
      verify_percentage: 50,
      status: 'Pending',
    },
    {
      id: 2,
      date: new Date(new Date().getTime() - 3600000), // 1 hour ago
      illness: 'Flu',
      verify_percentage: 70,
      status: 'Verified',
    },
    {
      id: 3,
      date: new Date(new Date().getTime() - 7200000), // 2 hours ago
      illness: 'Chickenpox',
      verify_percentage: 90,
      status: 'Rejected',
    },
    {
      id: 4,
      date: new Date(new Date().getTime() - 10800000), // 3 hours ago
      illness: 'Diabetes',
      verify_percentage: 40,
      status: 'Pending',
    }
  ])

  return (
    <div className="flex flex-col w-full h-full justify-between">
      <div className="w-full h-172 p-5 bg-white/5 rounded-md justify-between">
        <div className="flex flex-col w-full h-full justify-start">
          <div className="grid grid-cols-5 place-items-center">
            <div className="col-span-1">Created</div>
            <div className="col-span-2">Illness</div>
            <div className="col-span-1">Verify %</div>
            <div className="col-span-1">Status</div>
          </div>
          <hr className="my-3"/>
          {
            records.map((r, i) => <RecordEntry 
            key={r.id}
            date={r.date}
            illness={r.illness}
            verify_percentage={r.verify_percentage}
            status={r.status}
            />)
          }
        </div>
        <hr className="pb-4"/>
      </div>
      <div className="flex flex-row w-full h-8 py-5 items-center space-x-3 pr-4">
        <div className="flex w-full justify-end">
          Page 1 / 10
        </div>
        <motion.button className="h-8 w-8 bg-transparent"
        whileHover={{
        color: '#24fc6f',
        scale: 1.1,
        transition: { duration: 0.2 },
        }}
        whileTap={{scale: 0.9}}
        onClick={() => {}}
        >
          <ChevronLeft className="w-8 h-8"/>
        </motion.button>
        <motion.button className="h-8 w-8 bg-transparent"
        whileHover={{
        color: '#24fc6f',
        scale: 1.1,
        transition: { duration: 0.2 },
        }}
        whileTap={{scale: 0.9}}
        onClick={() => {}}
        >
          <ChevronRight className="w-8 h-8"/>
        </motion.button>
      </div>
    </div>
  );
}


export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#040c07]
    justify-center items-center">
      <div className="flex flex-row p-5 space-x-5 w-full h-[95%] items-center">
        <Sidebar />
        <div className="flex flex-row w-full h-full space-x-5">
          <div className="flex flex-col w-full h-full px-5">
            <div className="flex flex-row justify-between items-start w-full pt-2">
              <div className="font-bold text-4xl">Records</div>
              <motion.button className="h-10 w-18 rounded-xl text-black font-bold
              bg-[#8de9ad]"
              whileHover={{
              scale: 1.1,
              boxShadow: "0 0px 30px rgba(22, 101, 52, 0.5)",
              transition: { duration: 0.2 },
              }}
              whileTap={{scale: 0.9}}
              onClick={() => {}}
              >
                New
              </motion.button>
            </div>
            <div className="py-4">Make an anonymous record of your patients' illnesses to the mainnet.</div>
            <RecordTable />
          </div>
        </div>
      </div>
    </div>
  );
}