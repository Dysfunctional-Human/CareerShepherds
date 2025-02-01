import { Button } from "../../components/ui/button";
import BoxReveal from "../../components/ui/box-reveal";
import { memo } from "react";
import { InteractiveHoverButton } from '../../components/ui/interactive-hover-button';
import { Link} from "react-router-dom";
import RetroGrid from "../../components/ui/retro-grid";
import React from "react";

const CallToAction = React.memo(function CallToAction() {
  return (
    <div className=" relative bg-black text-white w-full h-screen flex flex-col items-center justify-start overflow-hidden p-20">
      
      <BoxReveal boxColor={"#f87171"} duration={0.5}>
        <p className="text-[9rem] font-semibold">
          Join us Now!<span className="text-[#f87171]">.</span>
        </p>
      </BoxReveal>

      <BoxReveal boxColor={"#f87171"} duration={0.5}>
        <h2 className="text-2xl font-extralight">
            Let's help you get started on your journey to success.
        </h2>
      </BoxReveal>

      <BoxReveal boxColor={"#f87171"} duration={0.5}>
        <Link to='/login'>
        <InteractiveHoverButton front="Get Started" back="Now!" className="mt-[1.6rem] z-10 text-black "></InteractiveHoverButton>
        </Link>
      </BoxReveal>
      <RetroGrid  className=" -z-0 overflow-clip" ></RetroGrid>
    </div>
  );
});

export default CallToAction;
