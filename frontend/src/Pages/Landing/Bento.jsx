import React, { memo } from "react";
import { RocketIcon, } from "@radix-ui/react-icons";
import { BotMessageSquare,ScanText, SquareUserRound,LibraryBig} from 'lucide-react';
import { BentoCard, BentoGrid } from "../../components/ui/bento-grid";
  
const features = [
  {
    Icon: BotMessageSquare,
    name: "Your Personalized AI Mentor",
    description: "Get personalized guidance, bridge skill gaps, and unlock opportunities.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: ScanText,
    name: "Resume Parser",
    description: "Parses your resume providing ATS scores and insights on how to improve it.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: LibraryBig,
    name: "Course Recommendations",
    description: "Get personalized course recommendations based on your skills and career goals.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: SquareUserRound,
    name: "User Dashboard",
    description: " Track your progress, view your resume insights, and access your personalized mentorships",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
      Icon: RocketIcon,
      name: "Last Mile Training",
      description: "Flashcards, quizzes, and other resources to help you ace your interviews.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
];

const MemoizedBento = memo(function Bento() {
  return (
  <section class="relative bg-black flex flex-col items-center justify-center w-full h-4/5 p-20 ">
      <div className="text-9xl font-bold text-white m-5" >What do we offer</div>
    <BentoGrid className="lg:grid-rows-4 bg-black ">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  </section>
  );
});

export default MemoizedBento;
  