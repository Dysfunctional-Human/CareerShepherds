import logo from "@/assets/logo.svg"
import React,{useState,useEffect,useRef} from "react"
import { Send, User, Cross, Rocket, FileUser, Laugh, Sidebar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import ThinkingAnimation  from "@/components/ui/thinking-animation"
import axios from "axios"
import { useMutation,useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import Markdown from "react-markdown"

export default function ChatInterface({ sessionId, sessions, setSessions }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [loading,setLoading]=useState(false);
  // Find the current session messages
  const session = sessions?.find((s) => s.sessionId === sessionId);
  const messages = session ? session.messages : [];

  // Scroll to the bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mutation to send message
  const { mutate, isError, isLoading, error } = useMutation({
    mutationFn: async ({ sessionId, message }) => {
      console.log(sessionId, message);
      setLoading(true);
      const res = await axios.post("/api/chatbot/chat", { sessionId:sessionId, message });
      return res.data;
    },
    onSuccess: (data) => {
      const newBotMessage = { timestamp: Date.now(), text: data.message, human: false };
      setLoading(false);
      setSessions((prev) =>
        prev.map((s) =>
          s.sessionId === sessionId ? { ...s, messages: [...s.messages, newBotMessage] } : s
        )
      );
      
      scrollToBottom();
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Error: ${error.message}`);
    },
  });

  // Handle sending message
  const handleSend = () => {
    if (!session || !input.trim()) return;

    const newUserMessage = { timestamp: Date.now(), text: input, human: true };

    // Optimistically update UI before API call
    setSessions((prev) =>
      prev.map((s) =>
        s.sessionId === sessionId ? { ...s, messages: [...s.messages, newUserMessage] } : s
      )
    );

    setInput("");

    // Send message to backend
    mutate({ sessionId, message: input });
  };

  return (
    <div className=" w-full  -m-8 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-7xl h-[calc(80vh)] rounded-3xl backdrop-blur-xl bg-black text-white hover:border-zinc-800 border border-zinc-900 shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center gap-2">
            {/* <div className="h-8 rounded-lg bg-zinc-800">
                <Sidebar ></Sidebar>
              {/* <img src={logo} alt="ShepherdAI Logo" className="w-8 h-8" /> </div>*/}
            
            <span className="font-medium">ShepherdAI - {session?.title}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow overflow-auto p-6 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center gap-3 mb-6">
              <div className=" rounded-xl bg-zinc-800">
                <img src={logo} alt="ShepherdAI Logo" className="w-12 h-12" />
              </div>
              <h1 className="text-2xl font-semibold text-white">
                Hi, Welcome
              </h1>
              <h2 className="text-3xl font-semibold text-white">
                Can I help you with anything?
              </h2>
              <p className="text-zinc-600 max-w-2xl">
                Ready to assist you with anything you need, from answering
                questions to providing recommendations. Let's get started!
              </p>
            </div>
          ) : (
            
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.human? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.human
                        ? `${colors.blue}`
                        : `${colors.green}`
                    }`}
                  >
                    <Markdown>{message.text}</Markdown>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className={`max-w-[70%] p-3 rounded-lg ${colors.green} backdrop-blur-sm`}>
                    <ThinkingAnimation />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        {/* 
          {messages.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: <Rocket className="w-4 h-4 text-white" />,
                  title: "Optimize Your Resume",
                  subtitle: "Learn how to stand out"
                },
                {
                  icon: <Cross className="w-4 h-4 text-white" />,
                  title: "Get career assistance",
                  subtitle: "know which career is right for you"
                },
                {
                  icon: <FileUser className="w-4 h-4 text-white" />,
                  title: "Cover Letter Tips",
                  subtitle:
                    "Write a compelling cover letter based on your resume"
                }
              ].map((card, index) => (
                <Card
                  key={index}
                  className="p-4 flex flex-col items-start justify-center backdrop-blur-xl bg-white/50 border-white/40 transition-all duration-200 
                    hover:bg-white/70 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-zinc-800">
                        {card.title}
                      </h3>
                      <p className="text-sm text-zinc-600">{card.subtitle}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )} */}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/20">
          <div className="relative flex items-center">
            <Button variant="ghost" size="icon" className="absolute left-2">
              <Laugh className="w-5 h-5 text-zinc-500" />
            </Button>
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === "Enter" && handleSend()}
              placeholder="Ask SherpherdAI anything..."
              className="pl-12 pr-24 py-6"
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              className="absolute right-2
                bg-black text-white border border-zinc-900
                rounded-lg px-4 py-2 transition-all duration-200 hover:bg-white hover:text-black hover:shadow-lg 
                hover:-translate-y-0.5 active:translate-y-0"
            >
              Send <Send className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
const colors= {
    blue:
      "bg-blue-50 text-blue-700 border border-blue-200 hover:border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/30 dark:hover:border-blue-600/50",
    purple:
      "bg-purple-50 text-purple-700 border border-purple-200 hover:border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700/30 dark:hover:border-purple-600/50",
    green:
      "bg-green-50 text-green-700 border border-green-200 hover:border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/30 dark:hover:border-green-600/50"
}