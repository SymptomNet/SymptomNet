"use client"

import { motion, AnimatePresence } from "motion/react"
import Sidebar from "@/components/Sidebar";
import { use, useEffect, useState } from "react";
import useMeasure from "react-use-measure";

function ResultBox({ text , rank, treatment_steps }) {

  const [hovered, setHovered] = useState(false);

  const [ref, { height }] = useMeasure()

  return (
    <motion.div className="overflow-hidden"
      initial={{
        opacity: 0,
        translateX: -200,
      }}
      animate={{
        opacity: 1,
        translateX: 0,
        height: height
      }}
      exit={{
        opacity: 0,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      >
      <div ref={ref} className="group flex flex-col w-full min-h-28 p-5
        bg-[#0f983e]/40 rounded-xl space-x-8 justify-center">
        <div className="flex flex-row items-center justify-start space-x-8">
          <div className="text-[#24fc6f] font-bold text-5xl pl-5
          group-hover:scale-125 transition-all">
            {rank}
          </div>
          <div className="text-white text-xl">
            {text}
          </div>
        </div>
        {
          hovered && <motion.div
            initial={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -10 }}
            transition={{ duration: 0.3 }}
            >
              <div className="text-white text-xl font-bold p-5">Diagnosis Plan</div>
              <ol className="list-decimal list-outside text-white pl-10 space-y-2">
              {
                treatment_steps.map((t, i) => <li key={i}>{t}</li>)
              }
              </ol>
          </motion.div>
        }
      </div>
    </motion.div>
  )
}




export default function Diagnose() {

  const [symptoms, setSymptoms] = useState([]);
  const [results, setResults] = useState([
    { id: 0, rank: 1, text: 'Common Rash', treatment_steps: [
      "Conduct a visual examination to identify the rash's appearance, distribution, and any associated skin changes.",
      "Gather information about the patient's medical history, including allergies, medications, and previous skin conditions.",
      "Inquire about potential exposures to irritants, allergens, or infectious agents.",
      "Assess for accompanying symptoms such as itching, pain, fever, or systemic illness.",
      "Perform diagnostic tests, such as skin scrapings, cultures, or biopsies, if necessary, to rule out specific infections or conditions.",
      "Consider less common conditions based on your findings."
    ]},
    { id: 1, rank: 2, text: 'brain problem' , treatment_steps: ['baba']}
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const deleteSymptom = (id) => () => setSymptoms(symptoms => symptoms.filter(s => s.id !== id));

  const addSymptom = () => setSymptoms([...symptoms, { id: crypto.randomUUID(), text: "" }])

  const updateSymptomText = (id) => (text) => setSymptoms(symptoms => symptoms.map(s => 
    s.id === id ? { ...s, text: text } : s
  ));

  const getResults = () => {

    setIsLoading(true);

    // replace this with localhost:5000
    fetch('https://a316-202-171-178-0.ngrok-free.app/predict', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Message: symptoms.map((s) => s.text).join('. ')
      })
    }).then((response) => {
      if (response.ok)
        response.json().then((json) => {
          console.log(json.result)
          setResults(json.result.map((r, i) => ({id: crypto.randomUUID(), rank: i + 1, text: r, treatment_steps: ['None']})))
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
    <div className="flex flex-row w-full h-full space-x-5 text-white">
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
          <div className="pt-4 pb-6">Describe your patient's symptoms below.</div>
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
      whileHover={symptoms.length === 0 ? {} : {
      scale: 1.05,
      boxShadow: "0 0px 30px rgba(22, 101, 52, 0.5)",
      transition: { duration: 0.2 },
      }}
      whileTap={{scale: 0.9}}
      onClick={getResults}
      disabled={symptoms.length === 0}
      >
        Diagnose
      </motion.button>
      </div>
      <div className="flex flex-col w-1/2 px-5">
        <div className="flex flex-row justify-between items-start w-full pt-2">
          <div className="font-bold text-4xl">Diagnosis</div>
        </div>
        <div className="pt-4">
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
            <AnimatePresence mode="sync">
              {
                
                results.map((r, i) => <ResultBox key={r.id} text={r.text}
                rank={r.rank} treatment_steps={r.treatment_steps}/>)
              }
            </AnimatePresence>
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