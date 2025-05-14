"use client"

import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react"
import Sidebar from "@/components/Sidebar";
import { use, useEffect, useState } from "react";

function ResultBox({ text , rank }) {

  return (
    <motion.div className="group flex flex-row items-center justify-start p-5
    w-full min-h-28 bg-[#0f983e]/40 rounded-xl space-x-8"
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
      <div className="text-[#24fc6f] font-bold text-5xl pl-5
      group-hover:scale-125 transition-all">
        {rank}
      </div>
      <div className="text-white text-xl">
        {text}
      </div>
    </motion.div>
  )
}


function SymptomBox({ text, onDelete, onChange }) {
  return (
    <motion.div className="relative flex items-center justify-start px-2 py-3
    w-full min-h-28 bg-[#d2e8da] rounded-xl"
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
      <div className="absolute top-3 right-3 cursor-pointer hover:rotate-180 transition-all"
      onClick={onDelete}
      >
        <X color="red" size={35} className=" "/>
      </div>
    </motion.div>
  );
}

export default function Diagnose() {

  const [symptoms, setSymptoms] = useState([]);
  const [results, setResults] = useState([
    { id: 0, rank: 1, text: 'flu'},
    { id: 1, rank: 2, text: 'brain problem'}
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const deleteSymptom = (id) => () => setSymptoms(symptoms => symptoms.filter(s => s.id !== id));

  const addSymptom = () => setSymptoms([...symptoms, { id: crypto.randomUUID(), text: "" }])

  const updateSymptomText = (id) => (text) => setSymptoms(symptoms => symptoms.map(s => 
    s.id === id ? { ...s, text: text } : s
  ));

  const getResults = () => {

    setIsLoading(true);

    fetch('https://railway.com/bababaaba', {
      method: 'GET',
      body: {

      }
    }).then((response) => {
      if (response.ok)
        response.json().then((json) => {
      
            // put into results here

            setResults([])
            setIsLoading(false)
        })
    }).catch((error) => {
      console.error(error)
    })
  }

  return (
  <div className="flex flex-col h-screen w-screen bg-[#040c07]
  justify-center items-center">
    <div className="flex flex-row p-5 space-x-5 w-full h-[95%] items-center">
    <Sidebar />
    <div className="flex flex-row w-full h-full space-x-5">
      <div className="flex flex-col w-1/2 px-5 justify-between">
        <div className="flex flex-col w-full h-full justify-start">
          <div className="flex flex-row justify-between items-start w-full pt-2">
            <div className="font-bold text-4xl">Symptoms</div>
            <motion.button className="h-10 w-18 rounded-xl text-black font-bold
            bg-[#8de9ad]"
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
          <div className="pt-2 pb-6">Describe your patient's symptoms below.</div>
          <div className="flex flex-col max-h-full space-y-5 py-5">
            <AnimatePresence mode="sync">
              {
                symptoms.map((s) => <SymptomBox key={s.id} text={s.text} onDelete={deleteSymptom(s.id)} onChange={updateSymptomText(s.id)}/>)
              }
            </AnimatePresence>
          </div>
        </div>

      <motion.button className="h-16 w-full rounded-xl text-black font-bold text-2xl
        bg-[#8de9ad]"
      whileHover={{
      scale: 1.05,
      boxShadow: "0 0px 30px rgba(22, 101, 52, 0.5)",
      transition: { duration: 0.2 },
      }}
      whileTap={{scale: 0.9}}
      onClick={getResults}
      >
        Diagnose
      </motion.button>
      </div>
      <div className="flex flex-col w-1/2 px-5">
        <div className="flex flex-row justify-between items-start w-full pt-2">
          <div className="font-bold text-4xl">Diagnosis</div>
        </div>
        <div className="pt-2">
          Our AI will attempt to diagnose your patient's disease, based on the
          symptoms described by you.
        </div>
        {
          isLoading === false && results.length === 0 && <div className="flex flex-col flex-1 w-full h-full justify-center place-items-center">
            No diagnosis has been performed yet.
          </div>
        }
        {
          isLoading === false && results.length > 0 && <div className="flex flex-col max-h-full space-y-5 py-5">
            {
              results.map((r, i) => <ResultBox key={r.id} text={r.text} rank={r.rank}/>)
            }
          </div>
        }
        {
          isLoading === true &&< div className="flex flex-col flex-1 w-full h-full justify-center place-items-center">
            <img src="/loading.svg" alt="loading" className="w-24 h-24 select-none"/>
          </div>
        }
      </div>
    </div>
    </div>
  </div>
  );
}