import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { useLocation } from "react-router-dom";
import { useUser } from "@/context/userContext";
function Onboarding() {
  const { userData} = useUser();
  const name= userData?.firstName;
  const tabs = [
    { no: 0, html: <div className="text-left">Hi {name},<br/>Welcome!</div> },
    { no: 1, html: <div className="text-center">Let's build your Profile</div> },
  ];
  const [tab, setTab] = useState(tabs[0]);
  const [isExiting, setIsExiting] = useState(false); // New state for exit animation

  useEffect(() => {
    const interval = setInterval(() => {
      setTab(() => {
        return tabs[1];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleNextClick = () => {
    setIsExiting(true); // Trigger exit animation
    setTimeout(() => {
      window.location.href = "/onboarding/upload"; // Navigate after animation
    }, 1500); // Timeout matches the exit animation duration
  };

  return (
    <div className="w-screen h-screen flex items-center  justify-center">
      <AnimatePresence mode="wait">
        {!isExiting && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 1,
              scale: { type: "spring", visualDuration: 0.8, bounce: 0.2 },
            }}
            className="bg-[#c83b70] h-3/4 w-3/4 rounded-3xl flex items-center justify-center  relative"
          >
            <motion.div
              key={tab.no}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 2 }}
              className="text-white text-9xl font-semibold"
            >
              {tab.html}
            </motion.div>
            {tab.no === 1 ? (
              <div
                className="text-white flex flex-row items-center space-x-2 rounded-full absolute bottom-4 right-4"
                style={{ color: "#fff" }}
              >
                <div>Click Next to proceed</div>
                <InteractiveHoverButton
                  front="Next"
                  back="Next"
                  className="bg-[#c83b70] border-[#c83b70]"
                  onClick={handleNextClick}
                ></InteractiveHoverButton>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Onboarding;
