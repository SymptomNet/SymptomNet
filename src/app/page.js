'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";


function Login() {

  const router = useRouter();

  const loginWorldID = () => {

    router.push('/dashboard')
  }


  return (
    <div className="flex flex-col space-y-12 w-2/6 h-100 items-center
    justify-center bg-white rounded-xl shadow-2xl shadow-green-800">
      <div className="flex text-black font-bold text-4xl">Login</div>
      <button className="flex flex-row justify-center items-center space-x-5
      w-60 h-12 bg-white border-2 border-black text-black rounded-xl
      hover:shadow-md hover:scale-105 transition-all"
      onClick={loginWorldID}
      >
        <div>Login With WorldID</div>
        <Image src={'/worldID.svg'} alt='WorldID' width={25} height={25}/>
      </button>
      <button className="flex flex-row justify-center items-center space-x-5
      w-60 h-12 bg-white border-2 border-black text-black rounded-xl
      hover:shadow-md hover:scale-105 transition-all">
        <div>Login With Google</div>
        <Image src={'/google.svg'} alt='WorldID' width={25} height={25}/>
      </button>
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
