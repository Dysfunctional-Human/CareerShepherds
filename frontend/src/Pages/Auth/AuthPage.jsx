import { GalleryVerticalEnd } from "lucide-react"
import logo from '@/assets/logo.png'
import { LoginForm } from "@/components/login-form"
import { useLocation } from "react-router-dom";
import { SignupForm } from "@/components/signup-form";
import { Link } from "react-router-dom"
import VideoBackground from "@/components/VideoBg.jsx"
export default function AuthPage() {
    const location = useLocation();
    const isLogin = location.pathname === "/login";
    const isSingup = location.pathname === "/sign-up";
  return (
    <VideoBackground>
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        {isLogin ? <LoginForm /> : null}
        {isSingup ? <SignupForm /> : null}
      </div>
    </div>
    </VideoBackground>
  )
}
