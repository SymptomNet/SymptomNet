
import { X } from "lucide-react";
import { motion } from "motion/react"

export default function SymptomBox({ text, onDelete, onChange }) {
  return (
    <motion.div className="relative flex items-center justify-start px-2 py-3
    w-full min-h-28 bg-white/5 rounded-xl"
    layout
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
      <textarea className="w-[80%] min-h-22 h-full text-white p-2 focus:outline-none"
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