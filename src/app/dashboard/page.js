"use client"

import Image from "next/image";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

function SidebarButton({text, imageURL, url, isCurrentPage}) {

  const router = useRouter()

  const onCLickSidebarButton = () => {

    if (url) {
      router.push(url)
    }

  }

  return (
      <motion.button className={`flex flex-row justify-between items-center
      w-full h-15 ${isCurrentPage ? 'bg-[#7EFFB2]' : 'bg-white'} text-black p-5 rounded-xl cursor-pointer`}
      whileHover={{
        backgroundColor: isCurrentPage ? "#6AD997" : "#C9C9C9",
        transition: { duration: 0.2 },
      }}
      onClick={onCLickSidebarButton}
      >
        <Image src={imageURL} alt={text} width={40} height={40}/>
        <div className="font-bold">{text}</div>
      </motion.button>
  )
}

function Sidebar() {
  return (
    <div className="flex flex-col w-64 h-[95%] bg-white rounded-xl text-black
    justify-start items-center">
      <div className="pt-8 pb-5 text-xl font-bold">SymptomNet</div>
      <hr className="border-2 rounded-xl w-[80%] mb-3"/>
      <div className="w-[80%] space-y-3">
        <SidebarButton text={"Dashboard"} isCurrentPage={true} imageURL={'/dashboard.svg'} url={'/dashboard'}/>
        <SidebarButton text={"Diagnose"} isCurrentPage={false} imageURL={'/diagnose.svg'} url={'/diagnose'}/>
        <SidebarButton text={"API"} isCurrentPage={false} imageURL={'/api.svg'}/>
      </div>
    
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#1E2922]
    justify-center items-center">
      <div className="flex flex-row p-5 space-x-5 w-full h-full items-center">
        <Sidebar />
        <div className="flex flex-row w-full space-x-5 bg-amber-200">
          <div>
            records
          </div>
          <div>

          </div>
          a
        </div>
      </div>
    </div>
  );
}