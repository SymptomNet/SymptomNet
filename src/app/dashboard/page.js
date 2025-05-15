"use client"

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react"

import Sidebar from "../../components/Sidebar";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DatePicker } from "@/components/DatePicker";
import SymptomBox from "@/components/SymptomBox";


function AddRecordDialog({ onOpenChange }) {

  const [admissionDate, setAdmissionDate] = useState(new Date());
  const [dischargeDate, setDischargeDate] = useState(new Date());
  const [sickness, setSickness] = useState("")
  const [symptoms, setSymptoms] = useState([])

  const deleteSymptom = (id) => () => setSymptoms(symptoms => symptoms.filter(s => s.id !== id));

  const addSymptom = () => setSymptoms([...symptoms, { id: crypto.randomUUID(), text: "" }])

  const updateSymptomText = (id) => (text) => setSymptoms(symptoms => symptoms.map(s => 
    s.id === id ? { ...s, text: text } : s
  ));

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger>
        <motion.div className="flex h-10 w-18 rounded-xl text-black font-bold
        bg-[#8de9ad] justify-center items-center"
        whileHover={{
        scale: 1.1,
        boxShadow: "0 0px 30px rgba(22, 101, 52, 0.5)",
        transition: { duration: 0.2 },
        }}
        whileTap={{scale: 0.9}}
        onClick={() => {}}
        >
          New
        </motion.div>
      </DialogTrigger>
      <DialogContent className="flex flex-col min-w-5/6 justify-center items-center
      space-y-2 bg-[#111814] text-white border-0 [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="font-bold text-4xl pt-5">New Record</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row w-full justify-evenly">
          <div className="space-y-5">
            <div className="text-xl font-semibold">Patient Details</div>
            <div className="space-y-1">
              <div className="text-lg pl-2">Age</div>
              <input className="bg-white/5 text-white w-96 h-12 p-5 rounded-lg inset-shadow-sm"/>
            </div>
            <div className="space-y-1">
              <div className="text-lg pl-2">Gender</div>
              <input className="bg-white/5 text-white w-96 h-12 p-5 rounded-lg inset-shadow-sm"/>
            </div>
            <div className="space-y-1">
              <div className="text-lg pl-2">Race</div>
              <input className="bg-white/5 text-white w-96 h-12 p-5 rounded-lg inset-shadow-sm"/>
            </div>
            <div className="space-y-1">
              <div className="text-lg pl-2">Country</div>
              <input className="bg-white/5 text-white w-96 h-12 p-5 rounded-lg inset-shadow-sm"/>
            </div>
            <div className="space-y-1">
              <div className="text-lg pl-2">Date Admitted</div>
              <DatePicker date={admissionDate} setDate={setAdmissionDate}/>
            </div>
            <div className="space-y-1">
              <div className="text-lg pl-2">Date Discharged</div>
              <DatePicker date={dischargeDate} setDate={setDischargeDate}/>
            </div>
          </div>
          <div className="space-y-5">
            <div className="text-xl font-semibold">Illness Details</div>
            <div className="space-y-1">
              <div className="text-lg pl-2">Diagnosis</div>
              <input className="bg-white/5 text-white w-96 h-12 p-5 rounded-lg inset-shadow-sm"
                onChange={(e) => setSickness(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <div className="flex flex-row justify-between pb-2">
                <div className="text-lg pl-2">Symptoms</div>
                <motion.div className="flex h-8 w-8 rounded-lg text-white 
              bg-[#8de9ad] justify-center items-center"
                whileHover={{
                scale: 1.1,
                boxShadow: "0 0px 30px rgba(22, 101, 52, 0.5)",
                transition: { duration: 0.2 },
                }}
                whileTap={{scale: 0.9}}
                onClick={addSymptom}
                >
                  <Plus className="text-black"/>
                </motion.div>
              </div>
              <div className="flex flex-col max-h-full space-y-5 py-5">
                <AnimatePresence mode="sync">
                  {
                    symptoms.map((s) => <SymptomBox key={s.id} text={s.text} onDelete={deleteSymptom(s.id)} onChange={updateSymptomText(s.id)}/>)
                  }
                </AnimatePresence>
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="text-xl font-semibold">Hospital Details</div>
            <div className="space-y-1">
              <div className="text-lg pl-2">Hospital Name</div>
              <input className="bg-white/5 text-white w-96 h-12 p-5 rounded-lg inset-shadow-sm"/>
            </div>
            <div className="space-y-1">
              <div className="text-lg pl-2">State</div>
              <input className="bg-white/5 text-white w-96 h-12 p-5 rounded-lg inset-shadow-sm"/>
            </div>
            <div className="space-y-1">
              <div className="text-lg pl-2">Country</div>
              <input className="bg-white/5 text-white w-96 h-12 p-5 rounded-lg inset-shadow-sm"/>
            </div>
          </div>


        </div>
        <motion.div className="flex h-12 w-32 rounded-xl text-black font-semibold
        bg-[#8de9ad] justify-center items-center text-2xl"
        whileHover={{
        scale: 1.1,
        boxShadow: "0 0px 30px rgba(22, 101, 52, 0.5)",
        transition: { duration: 0.2 },
        }}
        whileTap={{scale: 0.9}}
        onClick={() => {
          fetch('/api/record', {
            method: 'POST',
            body: JSON.stringify({
              sickness: sickness,
              symptoms: symptoms.map(x => x.text).join(","),
              treatment: "Drink warm warm water"
            })
          }).then(() => window.location.reload())
        }}
        >
          Add
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

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
    // {
    //   id: 1,
    //   date: new Date(),
    //   illness: 'Covid-19',
    //   verify_percentage: 50,
    //   status: 'Pending',
    // },
    // {
    //   id: 2,
    //   date: new Date(new Date().getTime() - 3600000), // 1 hour ago
    //   illness: 'Flu',
    //   verify_percentage: 70,
    //   status: 'Verified',
    // },
    // {
    //   id: 3,
    //   date: new Date(new Date().getTime() - 7200000), // 2 hours ago
    //   illness: 'Chickenpox',
    //   verify_percentage: 90,
    //   status: 'Rejected',
    // },
    // {
    //   id: 4,
    //   date: new Date(new Date().getTime() - 10800000), // 3 hours ago
    //   illness: 'Diabetes',
    //   verify_percentage: 40,
    //   status: 'Pending',
    // }
  ])

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    fetch('/api/record')
    .then((e) => e.json())
    .then((vals) => {
      const stuff = vals.map((x) => ({
        id: Number(x.id),
        date:  new Date(new Date().getTime() - 7200000), // dawg we forgot to store date
        illness: x.sickness,
        verify_percentage: Math.round((Number(x.verificationCount) / 3) * 100),
        status: capitalize(x.status)
      }))
      setRecords(stuff)
    })
  }, [])

  return (
    <div className="flex flex-col w-full h-full justify-between text-white">
      <div className="w-full h-172 p-5 bg-white/5 rounded-xl justify-between">
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
        <div className="flex flex-row w-full h-full space-x-5 text-white">
          <div className="flex flex-col w-full h-full px-5">
            <div className="flex flex-row justify-between items-start w-full pt-2">
              <div className="font-bold text-4xl">Records</div>
              <AddRecordDialog onOpenChange={() => {}}/>
            </div>
            <div className="py-4">Make an anonymous record of your patients' illnesses to the mainnet.</div>
            <RecordTable />
          </div>
        </div>
      </div>
    </div>
  );
}