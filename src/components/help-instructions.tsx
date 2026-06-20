import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function HelpInstructions() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Help</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>How to use the promptgenerator</DialogTitle>
          <DialogDescription>
            Follow these steps to generate and manage your   prompts.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ol className="list-decimal list-inside space-y-2">
            <li>Enter your prompt specifications in the input field.</li>
            <li>Click the "Generate Prompt" button to create your   prompt.</li>
            <li>View the generated prompt in the output field.</li>
            <li>Use the "Save/Export Prompt" button to save your prompt.</li>
            <li>Keep track of your usage with the counter at the bottom.</li>
            <li>After 5 free generations, you'll need to enter an API key to continue.</li>
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  )
}

