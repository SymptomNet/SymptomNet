"use client"

import { useEffect, useState } from "react";
import { motion } from "motion/react"

import Sidebar from "../../components/Sidebar";
import { CircleDollarSign } from "lucide-react";

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
  tokens: 220,

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
    name: "",
    symptoms: [
    ],
    treatment: [
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
  const [id, setID] = useState(-1)
  const [data, setData] = useState({})

  useEffect(() => {
    setData(exampleLong)
    console.log(data)
  }, [])

  useEffect(() => {
    fetch(`/api/verify`).then((e) => e.json()).then((obj) => {
      const { data } = obj
      console.log(data)
      setID(Number(data.id))
      setData(Object.assign(exampleLong, {
        id: Number(data.id),
        date: new Date(data.date),
        illness: {
          name: data.sickness,
          symptoms: data.symptoms.split(","),
          treatment: data.treatment.split(","),
        },
      }))
      console.log(data)
    })
  }, [])

  return (
    <div className="flex flex-col h-screen w-screen bg-[#040c07]
    justify-center items-center">
      <div className="flex flex-row p-5 space-x-5 w-full h-[95%] items-center">
        <Sidebar />
        <div className="flex flex-col w-full h-full space-x-5 text-white">
          <div className="flex flex-col w-full h-full px-5">
            <div className="flex flex-col items-start w-full pt-2">
              <div className="font-bold text-4xl">Verify</div>
              <div className="py-4">Verify records made by other doctors, and get rewarded.</div>
            </div>
            <div className="flex flex-row justify-start w-full h-150 space-x-5">
              <div className="flex flex-col w-1/3 bg-white/5 rounded-xl justify-start p-5">
                <div className="font-bold text-2xl pb-5">Patient Details</div>
                <div className="space-y-2">
                  <div>Age: {data.patient?.age}</div>
                  <div>Gender: {data.patient?.gender}</div>
                  <div>Race: {data.patient?.race}</div>
                  <div>Country of Origin: {data.patient?.country}</div>
                  <div>Date Admitted: {data.patient?.admission_date.toLocaleString()}</div>
                  <div>Date Discharged: {data.patient?.discharge_date.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex flex-col w-1/3 bg-white/5 rounded-xl justify-start p-5">
                <div className="font-bold text-2xl pb-5">Illness Details</div>
                <div className="space-y-2">
                  <div>Diagnosis: {data.illness?.name}</div>
                  <div>Symptoms:</div>
                  <ul className="list-disc list-inside pl-5 space-y-2">
                    {
                      data.illness?.symptoms.map((s, i) => <li key={i}>{s}</li>)
                    }
                  </ul>
                  <div>Treatment:</div>
                  <ul className="list-disc list-inside pl-5 space-y-2">
                    {
                      data.illness?.treatment.map((d, i) => <li key={i}>{d}</li>)
                    }
                  </ul>
                </div>
              </div>
              <div className="flex flex-col w-1/3 bg-white/5 rounded-xl justify-start p-5">
                <div className="font-bold text-2xl pb-5">Hospital Details</div>
                <div className="space-y-2">
                  <div>Name: {data.hospital?.name}</div>
                  <div>Location: {data.hospital?.state}, {data.hospital?.country}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-row w-full justify-between pt-5">
              <div className="flex flex-row w-3/4 justify-evenly items-center">
                <motion.button className="h-16 w-72 rounded-xl text-black font-bold text-2xl
                  bg-[#8de9ad]"
                whileHover={{
                scale: 1.05,
                boxShadow: "0 0px 30px rgba(22, 101, 52, 0.5)",
                transition: { duration: 0.2 },
                }}
                whileTap={{scale: 0.9}}
                onClick={() => {
                  fetch(`/api/verify/${id}`, {
                    method: 'POST'
                  }).then(() => window.location.reload())
                }}
                >
                  Verify
                </motion.button>
                <motion.button className="h-16 w-72 rounded-xl text-black font-bold text-2xl
                  bg-red-400"
                whileHover={{
                scale: 1.05,
                boxShadow: "0 0px 30px rgba(255, 133, 133, 0.5)",
                transition: { duration: 0.2 },
                }}
                whileTap={{scale: 0.9}}
                onClick={() => {}}
                >
                  Deny
                </motion.button>
              </div>
              <div className="flex flex-col w-72 h-32 bg-white/5 rounded-xl p-5 items-center transition-colors justify-between">
                <div className="text-xl">Accurate verification yields</div>
                <div className="flex flex-row w-full justify-center space-x-5 items-center">
                  <CircleDollarSign color="currentColor" className="w-12 h-12 text-[#24fc6f]"/>
                  <div className="text-5xl font-bold text-[#24fc6f]">{data.tokens}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}