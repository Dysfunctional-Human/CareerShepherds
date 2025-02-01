import { Progress } from "@/components/ui/progress"

const ProgressBar = ({ percentage }) => {
  return (
    <div className="w-full mb-4">
      <Progress value={percentage} className="w-full" />
      <p className="text-sm text-muted-foreground mt-1">
        Your profile is {percentage}% complete
      </p>
    </div>
  )
}

export default ProgressBar
