"use client"

import Image from "next/image";
import { motion } from "motion/react";
import { useRouter, usePathname } from "next/navigation";

const sidebarConfig = [
  {
    text: "Dashboard",
    iconUrl: "/dashboard.svg",
    url: "/dashboard",
  },
  {
    text: "Diagnose",
    iconUrl: "/diagnose.svg",
    url: "/diagnose",
  },
  {
    text: "API",
    iconUrl: "/api.svg",
    url: "/docs",
  }
]


function SidebarButton({text, iconUrl, url, isCurrentPage}) {

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
        <Image src={iconUrl} alt={text} width={40} height={40}/>
        <div className="font-bold text-lg">{text}</div>
      </motion.button>
  )
}

export default function Sidebar() {
  
  const pathname = usePathname();
  return (
    <div className="flex flex-col w-82 h-full bg-white rounded-xl text-black
    justify-start items-center">
      <div className="pt-8 pb-5 text-3xl font-bold">SymptomNet</div>
      <hr className="border-2 rounded-xl w-[80%] mb-3"/>
      <div className="w-[80%] space-y-3">
        {
          sidebarConfig.map((v, i) => <SidebarButton key={i} text={v.text} iconUrl={v.iconUrl} url={v.url} isCurrentPage={v.url === pathname} />)
        }
      </div>
    </div>
  );
}
