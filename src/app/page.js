'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import WorldIDLogin from "@/components/WorldIDLogin";

function Login() {

  const router = useRouter();

  const onLoginSuccess = async (result) => {

    const response = await fetch('/api/session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(result)
    })

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex flex-col space-y-12 w-2/6 h-64 items-center
    justify-center bg-white/5 rounded-xl shadow-2xl/20 shadow-[#24fc6f]">
      <div className="flex text-white font-semibold text-4xl">Login</div>
      <WorldIDLogin onSuccess={onLoginSuccess}/>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#040c07]
    justify-center items-center">
      <div className="flex flex-col w-full justify-evenly items-center">
        <div className="pb-12 text-5xl font-bold">SymptomNet</div>
        <Login />
      </div>
    </div>
  );
}
