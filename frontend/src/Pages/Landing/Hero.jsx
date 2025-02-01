import React from 'react';
import Nav from '@/components/LandingNav';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import job from '@/assets/job.svg'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import VideoBackground from '@/components/VideoBg';
import { Cover } from '@/components/ui/cover';
function Hero() {
  return (
    <VideoBackground>
      {/* Other components can be added here */}
      <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 1.2,
            ease: "easeInOut",
          }}
        >
      <div className='flex justify-center items-center h-screen'>
            <div>
        <div className='text-white text-9xl font-bold ml-16'>Ready to <Cover>accelerate</Cover> your career?</div>
        <div className="w-1/2 bg-gradient-to-r from-transparent via-red-400 to-transparent h-px " />
        <div className='text-white text-2xl w-1/2 font-extralight ml-16 mt-10'>Take the next step with your personalised AI mentor. Discover tailored guidance, bridge skill gaps, and unlock opportunities to achieve your dream career.</div>
        <div className='absolute bottom-32 left-36 hover:scale-110  transition ease-in-out duration-200 transform -translate-x-1/2'>
        {/* <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#b23939_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Get Started Now <ArrowRight size={22} strokeWidth={1} className="ml-2" />
            </span>
        </button> */}
        </div>
        {/* <button className='bg-white text-black font-bold py-2 px-4 rounded-full mt-10 ml-16'>Get Started Now</button> */}
        </div>
      </div>
    </motion.div>
    </VideoBackground>
  );
}

export default Hero;