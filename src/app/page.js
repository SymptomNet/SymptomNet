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
    <div className="flex flex-col space-y-12 w-2/6 h-100 items-center
    justify-center bg-white rounded-xl shadow-2xl shadow-green-800">
      <div className="flex text-black font-bold text-4xl">Login</div>
      <WorldIDLogin onSuccess={onLoginSuccess}/>
      <motion.button className="flex flex-row justify-center items-center space-x-5
      w-60 h-12 bg-white border-2 border-black text-black 
      rounded-xl hover:shadow-md cursor-pointer"
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}>
        <div>Login With Google</div>
        <Image src={'/google.svg'} alt='WorldID' width={25} height={25}/>
      </motion.button>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#1E2922]
    justify-center items-center">
      <div className="flex flex-row w-full justify-evenly items-center">
        <Login />
      </div>
    </div>
  );
}
