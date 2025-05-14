"use client"

import Image from "next/image";
import { motion } from "motion/react";
import { useRouter, usePathname } from "next/navigation";

import { LayoutDashboard, Fingerprint, Code } from "lucide-react";

const sidebarConfig = [
  {
    text: "Dashboard",
    currentPageIcon: <LayoutDashboard
      color="currentColor" 
      className="w-6 h-6 text-[#24fc6f]"
    />,
    icon: <LayoutDashboard
      color="currentColor" 
      className="w-6 h-6 text-green-600 group-hover:text-[#24fc6f]"
    />,
    url: "/dashboard",
  },
  {
    text: "Diagnose",
    currentPageIcon: <Fingerprint
      color="currentColor" 
      className="w-6 h-6 text-[#24fc6f]"
    />,
    icon: <Fingerprint
      color="currentColor" 
      className="w-6 h-6 text-green-600 group-hover:text-[#24fc6f]"
    />,
    url: "/diagnose",
  },
  {
    text: "API",
    currentPageIcon: <Code
      color="currentColor" 
      className="w-6 h-6 text-[#24fc6f]"
    />,
    icon: <Code
      color="currentColor" 
      className="w-6 h-6 text-green-600 group-hover:text-[#24fc6f]"
    />,
    url: "/docs",
  }
]


function SidebarButton({text, currentPageIcon, icon, url, isCurrentPage}) {

  const router = useRouter()

  const onCLickSidebarButton = () => {
    if (url) {
      router.push(url)
    }
  }

  return (
      <motion.button className={`group flex flex-row justify-start space-x-5 items-center
      w-full h-15 ${isCurrentPage ? 'bg-[#0f983e]/50 text-white' : 'bg-transparent text-white/50'}
      p-5 rounded-full cursor-pointer`}
      whileHover={{
        color: "#FFFFFF",
        transition: { duration: 0.2 },
      }}
      onClick={onCLickSidebarButton}
      >
        {isCurrentPage ? currentPageIcon : icon}
        <div className="text-lg">{text}</div>
      </motion.button>
  )
}

export default function Sidebar() {
  
  const pathname = usePathname();
  return (
    <div className="flex flex-col w-96 h-full bg-white/5 rounded-xl text-white
    justify-start items-center">
      <div className="pt-8 pb-5 text-3xl font-bold">SymptomNet</div>
      <hr className="border-2 rounded-xl w-[80%] mb-3"/>
      <div className="w-[80%] space-y-3">
        {
          sidebarConfig.map((v, i) => <SidebarButton 
          key={i}
          text={v.text}
          currentPageIcon={v.currentPageIcon}
          icon={v.icon} url={v.url}
          isCurrentPage={v.url === pathname} />)
        }
      </div>
    </div>
  );
}
