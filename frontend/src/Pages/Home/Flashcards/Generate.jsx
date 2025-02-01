import  FlashcardArray  from "@/components/ui/FlashcardArray";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { color, motion } from "framer-motion";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
function Generate() {
  const LoadingCard=[{
    id:0,
    frontHTML:<TextShimmer>Generating your questions...</TextShimmer>,
    backHTML:<TextShimmer>Please wait...</TextShimmer>
  }];
  const [inputText,setInputText]=useState("");
  const cards = [];
  const [qa_pair,setQA_pair]=useState([]);
  const [loading,setLoading]=useState(true);
  const [visible,setVisible]=useState(false);
  async function GenerateFlash(){
    setLoading(true);
    setVisible(true);
    const questions=await axios.post('http://localhost:8000/api/generate-questions', { text: inputText });
    for(let i=0;i<questions.data.length;i++){
      cards.push({
        id:i,
        frontHTML:(questions.data[i]).substr(2),
        backHTML:<TextShimmer>Answers are loading...</TextShimmer>
      });
      console.log(questions.data[i]);
    };
    setLoading(false);
    setQA_pair(cards);
    const answers=await axios.get('http://localhost:8000/api/generate-answers');
    for(let i=0;i<cards.length;i++){
      cards[i].backHTML=answers.data[i];
      console.log(answers.data[i]);
    }
    setQA_pair(cards);

  }
  return (
    <>
    <div className="flex flex-col items-center justify-center h-screen pt-16" style={{ pointerEvents: 'auto' }}>
      <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1.3 }}>
        {visible?
            <>
            {loading?
            <FlashcardArray cards={LoadingCard} 
              frontContentStyle={{display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem"}}
              frontCardStyle={{backgroundColor:"#000",borderWidth:"1px",borderColor:"#27272a" }}  
              backContentStyle={{display:"flex",alignItems:"center",justifyContent:"center" ,fontSize:"1.5rem"}}
              backCardStyle={{backgroundColor:"#000",borderWidth:"1px",borderColor:"#27272a"}} 
              />:
            <FlashcardArray cards={qa_pair} 
              frontContentStyle={{display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",padding:"1rem",textAlign:"center",color:"#fff"}}
              frontCardStyle={{backgroundColor:"#000",borderWidth:"1px",borderColor:"#27272a"}} 
              backContentStyle={{display:"flex",alignItems:"center",justifyContent:"center" ,fontSize:"1rem",padding:"1rem",paddingTop:"2rem",textAlign:"center",color:"#fff"}}
              backCardStyle={{backgroundColor:"#000",borderWidth:"1px",borderColor:"#27272a",overflow:"auto"}} 
            />}
            </>
          :null}
      </motion.div>
      {(loading && !visible)?
        <>
          <Textarea placeholder="Enter text to generate.."  required onChange={(e) => setInputText(e.target.value)} value={inputText} className=" w-1/2"></Textarea>
          <Button className='mt-4' type="submit" onClick={() => {
              if (!inputText.trim()) {
                toast.error('Please enter some text');
              } else {
                GenerateFlash();
              }
            }} >
                Generate Flashcards
          </Button>
        </>:null
      }
    </div>
    </>
  );
}
export default Generate;