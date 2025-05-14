"use client"

import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react"
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { New_Tegomin } from "next/font/google";


function SymptomBox({ text, onDelete, onChange }) {
  return (
    <motion.div className="relative flex items-center justify-start px-2 py-3
    w-full min-h-28 bg-white rounded-xl"
    initial={{
      opacity: 0,
      translateX: -200,
    }}
    animate={{
      opacity: 1,
      translateX: 0,
    }}
    exit={{
      opacity: 0,
    }}
    >
      <textarea className="w-[80%] min-h-22 h-full text-black p-2 focus:outline-none"
      defaultValue={text}
      placeholder="My patient is..."
      onChange={(e) => onChange(e.target.value)}
      ></textarea>
      <div className="absolute top-3 right-3 cursor-pointer hover:scale-105"
      onClick={onDelete}
      >
        <X color="red" size={32} className=" "/>
      </div>
    </motion.div>
  );
}

export default function Diagnose() {

  const [symptoms, setSymptoms] = useState([]);

  const deleteSymptom = (id) => () => setSymptoms(symptoms => symptoms.filter(s => s.id !== id));

  const addSymptom = () => setSymptoms([...symptoms, { id: crypto.randomUUID(), text: "" }])

  const updateSymptomText = (id) => (text) => setSymptoms(symptoms => symptoms.map(s => 
    s.id === id ? { ...s, text: text } : s
  ));

  useEffect(() => {
    console.log(symptoms)
  }, [symptoms])

  return (
  <div className="flex flex-col h-screen w-screen bg-[#1E2922]
  justify-center items-center">
    <div className="flex flex-row p-5 space-x-5 w-full h-[95%] items-center">
    <Sidebar />
    <div className="flex flex-row w-full h-full space-x-5">
      <div className="flex flex-col w-2/5 p-5">
        <div className="flex flex-row justify-between items-start w-full pt-2">
          <div className="font-bold text-4xl">Symptoms</div>
          <motion.button className="h-10 w-18 rounded-xl text-black font-bold
          bg-[#7EFFB2]"
          whileHover={{
          scale: 1.1,
          boxShadow: "0 0px 30px rgba(22, 101, 52, 0.5)",
          transition: { duration: 0.2 },
          }}
          whileTap={{scale: 0.9}}
          onClick={addSymptom}
          >
            Add
          </motion.button>
        </div>
        <div>Describe your patient's symptoms below.</div>
        <div className="flex flex-col max-h-full space-y-5 py-5">
          <AnimatePresence mode="sync">
            {
              symptoms.map((s) => <SymptomBox key={s.id} text={s.text} onDelete={deleteSymptom(s.id)} onChange={updateSymptomText(s.id)}/>)
            }
          </AnimatePresence>
        </div>
      </div>
      <div>

      </div>
      a
    </div>
    </div>
  </div>
  );
}