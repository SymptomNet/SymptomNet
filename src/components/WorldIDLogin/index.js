"use client";

import { VerificationLevel, IDKitWidget } from "@worldcoin/idkit";
import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";

export default function WorldIDLogin({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [verified] = useState(false);
  const [error, setError] = useState(null);

  // App ID and action from environment variables (with fallbacks for development)
  const app_id = process.env.NEXT_PUBLIC_WORLDID_APP_ID;
  const action = process.env.NEXT_PUBLIC_WORLDID_ACTION_ID;

  console.log(app_id)
  console.log(action)

  const handleProof = async (result) => {
    try {
      setLoading(true);
      console.log("Proof received from IDKit:", result);

      const response = await fetch('/api/auth/worldid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Verification failed!');
      }

      const data = await response.json();
      console.log("Response from backend:", data);

      if (!data.success) {
        throw new Error(data.detail || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      setLoading(false);
      throw error; // Rethrow to be caught by the widget
    }
  };

  if (verified) {
    return (
      <div className="text-green-600 font-semibold">
        ✓ Identity verified!
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <IDKitWidget
        app_id={app_id}
        action={action}
        onSuccess={onSuccess}
        handleVerify={handleProof}
        verification_level={VerificationLevel.Device}
      >
        {({ open }) => (
          <motion.div
            className="flex flex-row justify-center items-center space-x-5
              w-64 h-12 bg-[#8de9ad] text-black shadow-lg
              rounded-xl cursor-pointer hover:shadow-[0_0px_30px_rgba(141,233,173,1)] transition-shadow"
            whileHover={{
              translateY: -10,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setLoading(true);
              setError(null);
              open();
            }}
          >
            <div className="flex items-center">
              {loading ? 'Verifying...' : 'Continue With WorldID'}
            </div>
            <Image src={'/worldID.svg'} alt="worldID" width={25} height={25} />
          </motion.div>
        )}
      </IDKitWidget>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          Error: {error}
        </div>
      )}
    </div>
  );
}