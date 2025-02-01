import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function FormNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext
}) {
  return (
    <div className="flex justify-between items-center mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Step {currentStep + 1} of {totalSteps}
      </span>
      <Button
        type="button"
        onClick={onNext}
        disabled={currentStep === totalSteps - 1}
      >
        Next <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
